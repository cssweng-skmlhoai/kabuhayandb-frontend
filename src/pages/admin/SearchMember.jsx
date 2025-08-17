import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/AdminCompts/SearchBar";
import Pagination from "@/components/AdminCompts/Pagination";
import DataTable from "@/components/AdminCompts/DataTable";
import ConfirmationDialog from "@/components/AdminCompts/ConfirmationDialog";
import { searchUser } from "@/hooks/MemberListUtils";
import { formatDate } from "@/hooks/EditMemberUtils";
import {
  fetchCertReqs,
  deleteCertRecord,
  openCertRecDialog,
  createCertRecord,
  openAddCertDialog
} from "@/hooks/CertificationUtils";

const SearchMember = ({ purpose }) => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [searched, setSearched] = useState("");
  const [certs, setCerts] = useState([]);

  const [certRecDialog, setCertRecDialog] = useState(false);
  const [crn, setCrn] = useState("");
  const [memberName, setMemberName] = useState("");
  const [datePrinted, setDatePrinted] = useState("");
  const [recordId, setRecordId] = useState(null);

  const [addCertDialog, setAddCertDialog] = useState(false);
  const [deleteCertReqDialog, setDeleteCertReqDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const [certCurrentPage, setCertCurrentPage] = useState(1);
  const certsPerPage = 4;
  const indexOfLastCert = certCurrentPage * certsPerPage;
  const indexOfFirstCert = indexOfLastCert - certsPerPage;
  const currentCerts = certs.slice(indexOfFirstCert, indexOfLastCert);

  useEffect(() => {
    searchUser(searched, setMembers, setCurrentPage);

    if (purpose === "certification") {
      fetchCertReqs(setCerts);
    }
  }, [purpose, searched]);

  return (
    <div className="pb-35 xl:pb-0">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="pb-5 pt-8 px-7 flex flex-col gap-10 font-poppins xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Search Member ({`${purpose === "dues" ? "Dues" : "Certification"}`})</p>
                <p>
                  {purpose === "dues" && (
                    <>
                      Check <span className="font-semibold">Monthly Dues Report</span> or{" "}
                    </>
                  )}
                  Select a Member to {purpose === "dues" ? "Manage" : "Issue"} their{" "}
                  <span className="font-semibold">
                    {purpose === "dues" ? "Dues" : "Certificate"}
                  </span>
                </p>
              </div>
              {purpose === "dues" && (
                <Link to="/monthlyDuesReport">
                  <Button className="font-normal px-10 py-6 bg-blue-button">Generate Monthly Dues Report</Button>
                </Link>
              )}
            </div>

            <div className={`flex flex-col gap-8 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:py-10 ${purpose === "certification" ? "xl:flex-row xl:px-25" : "xl:px-60"}`}>
              <div className={`flex flex-col gap-5 ${purpose === "certification" ? "xl:w-3/5" : ""}`}>
                <div className="flex flex-col text-center xl:hidden">
                  <p className="font-semibold text-2xl">Search Member ({`${purpose === "dues" ? "Dues" : "Certification"}`})</p>
                  <p>
                    {purpose === "dues" && (
                      <>
                        Check <span className="font-semibold">Monthly Dues Report</span> or{" "}
                      </>
                    )}
                    Select a Member to {purpose === "dues" ? "Manage" : "Issue"} their{" "}
                    <span className="font-semibold">
                      {purpose === "dues" ? "Dues" : "Certificate"}
                    </span>
                  </p>
                  {purpose === "dues" && (
                    <div className="py-5 flex justify-center xl:hidden">
                      <Link to="/monthlyDuesReport">
                        <Button className="font-normal px-10 py-6 bg-blue-button">Generate Monthly Dues Report</Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <SearchBar value={searched} onChange={setSearched} onSearch={() => searchUser(searched, setMembers, setCurrentPage)} />
                  <p className="text-sm italic text-gray-500">Note: Empty the search bar and press 'Search' to show all members</p>
                </div>

                {members.length === 0 ? (
                  <p className="text-center text-gray-500 mt-4 bg-customgray2 py-4">Search for a Member.</p>
                ) : (
                  currentMembers.map((member) => (
                    <div
                      key={member.member_id}
                      className="bg-customgray1 px-4 py-7 flex flex-col rounded-md hover:bg-gray-300 xl:relative xl:py-5 xl:mb-0 duration-200 shadow-md"
                      onClick={purpose === "certification" ? () => openAddCertDialog(member.member_id, setSelectedMember, setAddCertDialog) : () => navigate(`/${purpose}/${member.member_id}/${member.fullname}`)}
                    >

                      <p className="font-semibold text-lg ml-3">{member.fullname}</p>
                    </div>
                  ))
                )}

                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={members.length} itemsPerPage={membersPerPage} showRange />
              </div>

              {purpose === "certification" && (
                <div className="flex flex-col items-center gap-3 xl:w-2/5">
                  <p className="text-center font-medium text-xl">Certification Requests</p>
                  <p className="text-sm text-gray-500 italic">Tap on a Record to View It</p>
                  <DataTable
                    data={currentCerts}
                    onRowClick={(cert) => openCertRecDialog(cert, setCrn, setMemberName, setDatePrinted, setRecordId, setCertRecDialog)}
                    center
                    emptyMessage="No Certification Requests Found."
                    columns={[
                      { label: "CRN", key: "crn", className: "rounded-l-md" },
                      { label: "Member Name", key: "name", render: (c) => `${c.first_name} ${c.last_name}` },
                      { label: "Date Requested (yyyy-mm-dd)", key: "created_at", render: (c) => formatDate(c.created_at), className: "rounded-r-md" },
                    ]}
                    certs
                  />

                  <Pagination currentPage={certCurrentPage} setCurrentPage={setCertCurrentPage} totalItems={certs.length} itemsPerPage={certsPerPage} showRange certs />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* dialog for certificate request records */}
      <ConfirmationDialog
        open={certRecDialog}
        setOpen={setCertRecDialog}
        title={"Certificate Request Record"}
        description={""}
        confirmText="Delete Record"
        confirmColor="bg-red-700"
        onConfirm={() => setDeleteCertReqDialog(true)}
        confirmHover="hover:bg-red-900"
        certification
        crn={crn}
        memberName={memberName}
        datePrinted={datePrinted}
      />

      {/* dialog for delete confirmation on certificate request record */}
      <ConfirmationDialog
        open={deleteCertReqDialog}
        setOpen={setDeleteCertReqDialog}
        title={"Delete This Certification Request Record?"}
        description={"Are you sure you want to delete this certification request record? Double check before performing this action"}
        confirmText="Delete"
        confirmColor="bg-red-700"
        onConfirm={() => deleteCertRecord(recordId, setCerts, setDeleteCertReqDialog, setCertRecDialog, setRecordId)}
        confirmHover="hover:bg-red-900"
      />

      {/* Dialog for proceeding to member certification */}
      <ConfirmationDialog
        open={addCertDialog}
        setOpen={setAddCertDialog}
        title={"Member Certification"}
        description={"This will create a certification request record and will proceed to the selected member's certification"}
        confirmText="Proceed"
        onConfirm={() => createCertRecord(selectedMember, setAddCertDialog, navigate, selectedMember, setSelectedMember)}
      />
    </div>
  )
}

export default SearchMember