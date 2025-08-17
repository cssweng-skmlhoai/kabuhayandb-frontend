import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Pagination from "@/components/AdminCompts/Pagination";
import DataTable from "@/components/AdminCompts/DataTable";
import ConfirmationDialog from "@/components/AdminCompts/ConfirmationDialog";
import DueFormDialog from "@/components/AdminCompts/DueFormDialog";
import {
  fetchMemberDues,
  applyFilters,
  handleAddDue,
  handleUpdateDue,
  openUpdateForm,
  handleDeleteDue,
  getOutstandingBalance
} from "@/hooks/DuesUtils";

const Dues = () => {
  const { id, name } = useParams();

  const [dues, setDues] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedType, setSelectedType] = useState("All");
  const [addDueType, setAddDueType] = useState("");
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [filteredUnpaid, setFilteredUnpaid] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [receiptNumber, setReceiptNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Unpaid");
  const [selectedDueId, setSelectedDueId] = useState(null);
  const [householdId, setHouseholdId] = useState(null);
  const [dueTypeInput, setDueTypeInput] = useState("");

  const [addDueDialog, setAddDueDialog] = useState(false);
  const [updateDueDialog, setUpdateDueDialog] = useState(false);
  const [deleteDueDialog, setDeleteDueDialog] = useState(false);

  const [unpaidPage, setUnpaidPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const itemsPerPage = 5;
  const paginatedUnpaid = filteredUnpaid.slice((unpaidPage - 1) * itemsPerPage, unpaidPage * itemsPerPage);
  const paginatedPaid = filteredPaid.slice((paidPage - 1) * itemsPerPage, paidPage * itemsPerPage);

  useEffect(() => {
    fetchMemberDues(id, selectedType, setDues, setBalances, (dues, type) =>
      applyFilters(dues, type, setFilteredUnpaid, setFilteredPaid, setUnpaidPage, setPaidPage)
    );
  }, [refreshKey, id, selectedType]);

  useEffect(() => {
    if (!addDueDialog && !updateDueDialog) {
      setDueDate("");
      setAmount("");
      setStatus("");
      setSelectedDueId(null);
    }
    if (addDueDialog && selectedType === "All") {
      setAddDueType("Monthly Amortization");
    }
  }, [addDueDialog, updateDueDialog, selectedType]);

  return (
    <div className="pb-35 bg-customgray1 xl:pb-0">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="pb-5 pt-8 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-max xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Member Dues</p>
                <p>Update Member Dues</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:gap-10 xl:px-40 xl:py-10">
              <Link
                to="/searchMemberDues"
                className="cursor-pointer px-3 rounded-md border border-black flex items-center gap-2 w-30 md:w-40 md:gap-8"
              >
                <IoIosArrowRoundBack className="size-10" />
                <p className="font-poppins text-lg">Back</p>
              </Link>

              <p className="font-semibold text-center text-xl xl:text-2xl">{name}'s Dues</p>

              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setAddDueDialog(true) }}>
                <div className="px-5 py-4 bg-white flex flex-col items-center gap-3 rounded-sm xl:flex-row xl:justify-center">
                  <p className="font-medium">Select Type of Due:</p>
                  <select name="" id="" required
                    value={selectedType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedType(value);
                      applyFilters(dues, value, setFilteredUnpaid, setFilteredPaid, setUnpaidPage, setPaidPage);
                    }}
                    className="bg-customgray2 w-[80%] py-1 rounded-md border border-black md:w-[50%] xl:w-1/3 xl:py-[5px]"
                  >
                    <option value="All">All Dues</option>
                    <option value="Monthly Amortization">
                      Monthly Amortization
                    </option>
                    <option value="Monthly Dues">Monthly Dues</option>
                    <option value="Taxes">Taxes</option>
                    <option value="Penalties">Penalties</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="flex flex-col items-center justify-center gap-5 xl:gap-0 xl:flex-row">
                  <div className="px-5 py-4 bg-white flex flex-col items-center gap-3 rounded-sm xl:w-1/2 xl:flex-row xl:justify-center">
                    <p className="font-medium w-full text-center">Outstanding Balance ({selectedType === "All" ? "All Types" : selectedType})</p>
                    <input
                      className="bg-customgray2 p-2 text-md rounded-sm w-full xl:border xl:border-black" type="text" name="" id="" placeholder="₱ 0.00" readOnly value={`₱ ${getOutstandingBalance(selectedType, balances).toLocaleString("en-US")}`} />
                  </div>

                  <Button className="bg-blue-button w-full rounded-sm !py-5 md:w-1/2 xl:!py-3 xl:!h-auto xl:w-1/5" type="submit">Add New Due</Button>
                </div>
              </form>

              <div className="p-5 bg-white flex flex-col items-center rounded-sm gap-3 xl:border xl:border-black xl:px-15">
                <p className="font-medium">Unpaid Dues</p>
                <p className="text-sm text-gray-500 italic">Tap on a Due to Update It</p>
                <div className="w-full overflow-x-auto">
                  <DataTable
                    data={paginatedUnpaid}
                    onRowClick={(due) => openUpdateForm(due, setReceiptNumber, setSelectedDueId, setDueDate, setAmount, setStatus, setDueTypeInput, setHouseholdId, setUpdateDueDialog)}
                    emptyMessage="No paid dues for this type."
                    columns={[
                      { label: "Due Type", key: "due_type", className: "rounded-tl-md rounded-l-md" },
                      { label: "Amount", key: "amount", render: (d) => `₱ ${parseFloat(d.amount).toLocaleString()}` },
                      { label: "Due Date", key: "due_date", render: (d) => new Date(d.due_date).toLocaleDateString() },
                      { label: "Receipt No.", key: "receipt_number", className: "rounded-tr-md" },
                    ]}
                  />
                </div>

                <Pagination currentPage={unpaidPage} setCurrentPage={setUnpaidPage} totalItems={filteredUnpaid.length} itemsPerPage={itemsPerPage} showRange={false} size="md" dues />
              </div>

              <div className="p-5 bg-white flex flex-col items-center rounded-sm gap-3 xl:border xl:border-black xl:px-15">
                <p className="font-medium">Payment History</p>
                <p className="text-sm text-gray-500 italic">Tap on a Due to Update It</p>
                <div className="w-full overflow-x-auto">
                  <DataTable
                    data={paginatedPaid}
                    onRowClick={(due) => openUpdateForm(due, setReceiptNumber, setSelectedDueId, setDueDate, setAmount, setStatus, setDueTypeInput, setHouseholdId, setUpdateDueDialog)}
                    emptyMessage="No paid dues for this type."
                    columns={[
                      { label: "Due Type", key: "due_type", className: "rounded-tl-md rounded-l-md" },
                      { label: "Amount", key: "amount", render: (d) => `₱ ${parseFloat(d.amount).toLocaleString()}` },
                      { label: "Date Paid", key: "date_paid", render: (d) => new Date(d.date_paid).toLocaleDateString() },
                      { label: "Receipt No.", key: "receipt_number", className: "rounded-tr-md" },
                    ]}
                  />
                </div>

                <Pagination currentPage={paidPage} setCurrentPage={setPaidPage} totalItems={filteredPaid.length} itemsPerPage={itemsPerPage} showRange={false} size="md" dues />
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* dialog for adding dues */}
      <DueFormDialog
        open={addDueDialog}
        setOpen={setAddDueDialog}
        onSubmit={(e) => handleAddDue(e, selectedType, addDueType, dueDate, amount, status, id, setAddDueDialog, setRefreshKey)}
        title="Add New Due"
        dueType={addDueType}
        setDueType={setAddDueType}
        selectedType={selectedType}
        dueDate={dueDate}
        setDueDate={setDueDate}
        amount={amount}
        setAmount={setAmount}
        status={status}
        setStatus={setStatus}
        submitText="Add Due"
      />

      {/* dialog for updating dues */}
      <DueFormDialog
        open={updateDueDialog}
        setOpen={setUpdateDueDialog}
        onSubmit={(e) => handleUpdateDue(e, selectedDueId, dueDate, amount, status, dueTypeInput, householdId, receiptNumber, setUpdateDueDialog, setRefreshKey)}
        title="Update Due"
        showReceipt
        showDelete
        onDeleteClick={() => setDeleteDueDialog(true)}
        receiptNumber={receiptNumber}
        setReceiptNumber={setReceiptNumber}
        dueDate={dueDate}
        setDueDate={setDueDate}
        amount={amount}
        setAmount={setAmount}
        status={status}
        setStatus={setStatus}
        submitText="Update Due"
        dueType={dueTypeInput}
        setDueType={setDueTypeInput}
      />

      {/* dialog for delete confirmation of a due */}
      <ConfirmationDialog
        open={deleteDueDialog}
        setOpen={setDeleteDueDialog}
        title={"Delete This Due?"}
        description={"Are you sure you want to delete this due? Double check before performing this action"}
        confirmText="Delete"
        confirmColor="bg-red-700"
        onConfirm={() => handleDeleteDue(selectedDueId, setDeleteDueDialog, setUpdateDueDialog, setSelectedDueId, setRefreshKey)}
        confirmHover="hover:bg-red-900"
      />
    </div>
  );
};

export default Dues;