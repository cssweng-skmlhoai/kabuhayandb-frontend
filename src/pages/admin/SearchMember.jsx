import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const totalPages = Math.ceil(members.length / membersPerPage);

  const [certCurrentPage, setCertCurrentPage] = useState(1);
  const certsPerPage = 4;
  const indexOfLastCert = certCurrentPage * certsPerPage;
  const indexOfFirstCert = indexOfLastCert - certsPerPage;
  const currentCerts = certs.slice(indexOfFirstCert, indexOfLastCert);
  const certTotalPages = Math.ceil(certs.length / certsPerPage);

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    searchUser();

    if (purpose === "certification") {
      axios
        .get(`${API_URL}/certifications`, {
          headers: {
            Authorization: `Bearer ${API_SECRET}`,
          },
        })
        .then((res) => {
          const certificates = res.data;
          const filteredCerts = certificates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setCerts(filteredCerts);
        })
        .catch((err) => {
          toast.error(err.response?.data?.error || "Something went wrong");
        });
    }
  }, [purpose, API_SECRET]);

  const searchUser = () => {
    axios
      .get(`${API_URL}/members/home?name=${searched}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        if (!res.data) {
          setMembers([]);
        } else {
          const results = Array.isArray(res.data) ? res.data : [res.data];
          setMembers(results);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something went wrong");
      });
  };

  const deleteCertRecord = () => {
    axios
      .delete(`${API_URL}/certifications/${recordId}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then(() => {
        setCerts((prev) => prev.filter((c) => c.id !== recordId));
        setDeleteCertReqDialog(false);
        setCertRecDialog(false);
        setRecordId(null);
        toast.success("Certificate Request Record Successfully Deleted");
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something Went Wrong");
      });
  }

  const openCertRecDialog = (cert) => {
    setCrn(cert.crn);
    setMemberName(`${cert.first_name} ${cert.last_name}`);
    setDatePrinted(cert.created_at);
    setRecordId(cert.id);
    setCertRecDialog(true);
  }

  const createCertRecord = (member_id) => {
    axios
      .post(`${API_URL}/certifications`, { member_id }, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then(() => {
        setAddCertDialog(false);
        navigate(`/certification/${selectedMember}`);
        setSelectedMember(null);
        toast.success("Successfully Created Certification Request Record")
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something Went Wrong");
      });
  };

  const openAddCertDialog = (id) => {
    setSelectedMember(id);
    setAddCertDialog(true);
  }

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

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

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search Member Name"
                    className="border border-gray-300 bg-customgray2 rounded-md p-3 w-full"
                    value={searched}
                    onChange={(e) => setSearched(e.target.value)}
                  />
                  <Button className="font-normal text-md px-5 py-6 bg-blue-button md:px-10" onClick={searchUser}>Search</Button>
                </div>

                {members.length === 0 ? (
                  <p className="text-center text-gray-500 mt-4 bg-customgray2 py-4">Search for a Member.</p>
                ) : (
                  currentMembers.map((member) => (
                    <div
                      key={member.member_id}
                      className="bg-customgray1 px-4 py-7 flex flex-col rounded-md hover:bg-gray-300 xl:relative xl:py-5 xl:mb-0 duration-200 shadow-md"
                      onClick={purpose === "certification" ? () => openAddCertDialog(member.member_id) : () => navigate(`/${purpose}/${member.member_id}/${member.fullname}`)}
                    >

                      <p className="font-semibold text-lg ml-3">{member.fullname}</p>
                    </div>
                  ))
                )}

                <div className={`flex justify-between items-center mt-5 xl:mt-0 ${members.length <= membersPerPage ? "hidden" : ""}`}>
                  <p className="text-sm text-gray-600">
                    {members.length === 0
                      ? "0 results"
                      : `${indexOfFirstMember + 1}-${Math.min(indexOfLastMember, members.length)} of ${members.length}`}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronLeft />
                    </button>
                    <p className="text-sm">
                      Page {currentPage} of {totalPages}
                    </p>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              </div>

              {purpose === "certification" && (
                <div className="flex flex-col items-center gap-3 xl:w-2/5">
                  <p className="text-center font-medium text-xl">Certification Requests</p>
                  <p className="text-sm text-gray-500 italic">Tap on a Record to View It</p>
                  <table className="w-full table-auto text-sm border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-center">
                        <th className="px-4 py-2 rounded-tl-md">CRN</th>
                        <th className="px-4 py-2">Member Name</th>
                        <th className="px-4 py-2 rounded-tr-md">Date Requested <div className="!font-normal">(yyyy-mm-dd)</div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {certs.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            No Certification Requests Found.
                          </td>
                        </tr>
                      ) : (
                        currentCerts.map((cert) => (
                          <tr className="bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 duration-200 shadow-md text-center"
                            onClick={() => openCertRecDialog(cert)}
                            key={cert.id}
                          >
                            <td className="p-4 rounded-l-md">{cert.crn}</td>
                            <td className="p-4">{cert.first_name} {cert.last_name}</td>
                            <td className="p-4">{formatDate(cert.created_at)}</td>
                            <td className="text-gray-500 text-2xl font-light rounded-r-md py-4 pr-2">&rsaquo;</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <div className={`flex justify-between items-center w-full ${certs.length <= certsPerPage ? "hidden" : ""}`}>
                    <p className="text-sm text-gray-600">
                      {certs.length === 0
                        ? "0 results"
                        : `${indexOfFirstCert + 1}-${Math.min(indexOfLastCert, certs.length)} of ${certs.length}`}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCertCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={certCurrentPage === 1}
                        className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${certCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <ChevronLeft />
                      </button>
                      <p className="text-sm">
                        Page {certCurrentPage} of {certTotalPages}
                      </p>
                      <button
                        onClick={() => setCertCurrentPage((prev) => Math.min(prev + 1, certTotalPages))}
                        disabled={certCurrentPage === certTotalPages}
                        className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${certCurrentPage === certTotalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* dialog for certificate request records */}
      <Dialog Dialog open={certRecDialog} onOpenChange={setCertRecDialog} >
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold">
              Certificate Request Record
            </DialogTitle>
            <DialogDescription className="text-md text-gray-700">
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 my-5">
            <div className="flex flex-col gap-2 font-medium text-lg">
              <p>CRN: <span className="font-normal">{crn}</span></p>
              <p>Member Name: <span className="font-normal">{memberName}</span></p>
              <p>Date Requested (yyyy-mm-dd): <span className="font-normal">{formatDate(datePrinted)}</span></p>
            </div>
          </div>
          <DialogFooter className="flex flex-row">
            <button className="bg-red-700 w-1/2 text-white py-3 rounded-md hover:bg-red-900 duration-200" onClick={() => setDeleteCertReqDialog(true)}>
              Delete Record
            </button>
            <DialogClose className="bg-white text-black rounded-md w-1/2 cursor-pointer border border-black hover:bg-gray-300 duration-200">
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* dialog for delete confirmation on certificate request record */}
      <Dialog open={deleteCertReqDialog} onOpenChange={setDeleteCertReqDialog}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <DialogTitle className="text-left">
              Delete This Certification Request Record?
            </DialogTitle>
            <DialogDescription className="text-md text-gray-700">
              Are you sure you want to delete this certification request record? Double check before performing this action
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-between font-normal">
              <Button
                className="w-[48%] bg-red-700 hover:bg-red-900 py-6 font-normal text-md"
                onClick={deleteCertRecord}
              >
                Delete
              </Button>
              <DialogClose className="w-[48%] bg-black rounded-md text-white cursor-pointer hover:bg-gray-900 duration-200">
                Cancel
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for proceeding to member certification */}
      <Dialog open={addCertDialog} onOpenChange={setAddCertDialog}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <DialogTitle className="text-left">Member Certification</DialogTitle>
            <DialogDescription className="text-md text-gray-700">
              This will create a certification request record and will proceed to the selected member's certification
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between gap-4">
            <Button
              className="w-1/2 bg-blue-button py-6 font-normal text-md"
              onClick={() => createCertRecord(selectedMember)}
            >
              Proceed
            </Button>
            <DialogClose className="w-1/2 bg-white rounded-md text-black cursor-pointer border border-black hover:bg-gray-300 duration-200">
              Cancel
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SearchMember