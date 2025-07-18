import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const Dues = () => {
  const { id, name } = useParams();

  const [dues, setDues] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [filteredUnpaid, setFilteredUnpaid] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Unpaid");
  const [selectedDueId, setSelectedDueId] = useState(null);
  // const [paidDate, setPaidDate] = useState(null);
  const [householdId, setHouseholdId] = useState(null);

  const [addDueDialog, setAddDueDialog] = useState(false);
  const [updateDueDialog, setUpdateDueDialog] = useState(false);

  const [unpaidPage, setUnpaidPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const itemsPerPage = 5;
  const paginatedUnpaid = filteredUnpaid.slice((unpaidPage - 1) * itemsPerPage, unpaidPage * itemsPerPage);
  const paginatedPaid = filteredPaid.slice((paidPage - 1) * itemsPerPage, paidPage * itemsPerPage);
  const totalUnpaidPages = Math.ceil(filteredUnpaid.length / itemsPerPage);
  const totalPaidPages = Math.ceil(filteredPaid.length / itemsPerPage);

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API_URL}/dues/member/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      const { dues, balances } = res.data;
      setDues(dues);
      setBalances(balances);
      applyFilters(dues, selectedType);
    }).catch((err) => {
      console.log(err);
    });
  }, [refreshKey, API_SECRET, id, selectedType]);

  useEffect(() => {
    if (!addDueDialog && !updateDueDialog) {
      setDueDate("");
      setAmount("");
      setStatus("");
      setSelectedDueId(null);
    }
  }, [addDueDialog, updateDueDialog]);

  const applyFilters = (allDues, type) => {
    const filtered = allDues.filter(d => d.due_type === type);

    const unpaid = filtered.filter(d => d.status === "Unpaid").sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    const paid = filtered.filter(d => d.status === "Paid").sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

    setFilteredUnpaid(unpaid);
    setFilteredPaid(paid);
    setUnpaidPage(1);
    setPaidPage(1);
  };

  const handleAddDue = (e) => {
    e.preventDefault();

    const payload = {
      due_date: dueDate,
      amount,
      status,
      due_type: selectedType,
      member_id: id,
    };

    axios.post(`${API_URL}/dues`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      const newDue = res.data;
      const updatedDues = [...dues, newDue];

      let newBalance = 0.0;
      if (status === "Unpaid") {
        newBalance = (balances[dueTypeBalances(selectedType)] || 0) + parseFloat(amount);
      }
      else if (status === "Paid" && balances[dueTypeBalances(selectedType)] == 0) {
        newBalance = 0.0;
      }
      else {
        newBalance = (balances[dueTypeBalances(selectedType)] || 0) - parseFloat(amount);
      }

      setBalances(prev => ({
        ...prev,
        [dueTypeBalances(selectedType)]: newBalance,
      }));

      setDues(updatedDues);
      applyFilters(updatedDues, selectedType);
      setAddDueDialog(false);
    }).catch((err) => {
      console.log(err);
    });
  }

  const handleUpdateDue = (e) => {
    e.preventDefault();

    const payload = {
      due_date: dueDate,
      amount,
      status,
      due_type: selectedType,
      household_id: householdId,
    };

    axios.put(`${API_URL}/dues/${selectedDueId}`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then(() => {
      setUpdateDueDialog(false);
      setRefreshKey(prev => prev + 1);
    }).catch((err) => {
      console.log(err);
    });
  };

  const openUpdateForm = (due) => {
    setSelectedDueId(due.id);
    setDueDate(due.due_date.slice(0, 10));
    setAmount(due.amount);
    setStatus(due.status);
    // setPaidDate(due.date_paid);
    setHouseholdId(due.household_id);
    setUpdateDueDialog(true);
  };

  const dueTypeBalances = (type) => {
    if (type === "Monthly Amortization") return "amortization";
    if (type === "Monthly Dues") return "monthly";
    if (type === "Taxes") return "taxes";
    if (type === "Penalties") return "penalties";
    if (type === "Others") return "others";
  }

  return (
    <div>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="py-5 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-max xl:bg-white xl:gap-0 xl:px-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Member Dues</p>
                <p>Update Member Dues</p>
              </div>
              <div className="flex gap-3">
                <Button className="rounded-sm bg-white border-1 border-black hover:bg-gray-300 text-customgray3 cursor-pointer">
                  <LiaFileDownloadSolid className="size-5" />
                  <p>Export</p>
                </Button>
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
                      applyFilters(dues, value);
                    }}
                    className="bg-customgray2 w-[80%] py-1 rounded-md border border-black md:w-[50%] xl:w-1/3 xl:py-[5px]"
                  >
                    <option value="" disabled hidden></option>
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
                    <p className="font-medium w-full text-center">Outstanding Balance ({selectedType})</p>
                    <input
                      className="bg-customgray2 p-2 text-md rounded-sm w-full xl:border xl:border-black" type="text" name="" id="" placeholder="₱ 0.00" readOnly value={`₱ ${parseFloat(balances[dueTypeBalances(selectedType)] || 0).toLocaleString("en-US")}`} />
                  </div>

                  <Button className="bg-blue-button w-full rounded-sm !py-5 md:w-1/2 xl:!py-3 xl:!h-auto xl:w-1/5" type="submit">Add New Due</Button>
                </div>
              </form>

              <div className="p-5 bg-white flex flex-col items-center rounded-sm gap-3 xl:gap-5 xl:border xl:border-black xl:px-15">
                <p className="font-medium">Unpaid Dues (Type)</p>
                <div className="w-full overflow-x-auto">
                  <table className="w-full table-auto border-separate border-spacing-y-2 text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="px-4 py-2 rounded-tl-md">
                          Receipt No.
                        </th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2 rounded-tr-md">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUnpaid.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            No unpaid dues for this type.
                          </td>
                        </tr>
                      ) : (
                        paginatedUnpaid.map((due) => (
                          <tr
                            key={due.id}
                            className="bg-customgray2 rounded-md cursor-pointer hover:bg-customgray1 duration-200"
                            onClick={() => openUpdateForm(due)}
                          >
                            <td className="px-4 py-2 rounded-l-md">{due.receipt_number}</td>
                            <td className="px-4 py-2">₱ {parseFloat(due.amount).toLocaleString("en-US")}</td>
                            <td className="px-4 py-2 rounded-r-md">{new Date(due.due_date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={`flex items-center gap-7 ${filteredUnpaid.length <= 5 ? "hidden" : ""}`}>
                  <button onClick={() => setUnpaidPage(p => Math.max(p - 1, 1))}>
                    <ChevronLeft className="size-8 hover:bg-gray-300 rounded-md duration-200" />
                  </button>
                  <p>Page {unpaidPage} of {totalUnpaidPages}</p>
                  <button
                    onClick={() =>
                      setUnpaidPage(p =>
                        Math.min(p + 1, Math.ceil(filteredUnpaid.length / itemsPerPage))
                      )
                    }
                  >
                    <ChevronRight className="size-8 hover:bg-gray-300 rounded-md duration-200" />
                  </button>
                </div>
              </div>

              <div className="p-5 bg-white flex flex-col items-center rounded-sm gap-3 xl:gap-5 xl:border xl:border-black xl:px-15">
                <p className="font-medium">Payment History (Type)</p>
                <div className="w-full overflow-x-auto">
                  <table className="w-full table-auto border-separate border-spacing-y-2 text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="px-4 py-2 rounded-tl-md">
                          Receipt No.
                        </th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2 rounded-tr-md">Paid Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPaid.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            No unpaid dues for this type.
                          </td>
                        </tr>
                      ) : (
                        paginatedPaid.map((due) => (
                          <tr
                            key={due.id}
                            className="bg-customgray2 rounded-md cursor-pointer hover:bg-customgray1 duration-200"
                            onClick={() => openUpdateForm(due)}
                          >
                            <td className="px-4 py-2 rounded-l-md">{due.receipt_number}</td>
                            <td className="px-4 py-2">₱ {parseFloat(due.amount).toLocaleString("en-US")}</td>
                            <td className="px-4 py-2 rounded-r-md">{new Date(due.due_date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={`flex items-center gap-5 ${filteredPaid.length <= 5 ? "hidden" : ""}`}>
                  <button onClick={() => setPaidPage(p => Math.max(p - 1, 1))}>
                    <ChevronLeft className="size-8 hover:bg-gray-300 rounded-md duration-200" />
                  </button>
                  <p>Page {paidPage} of {totalPaidPages}</p>
                  <button
                    onClick={() =>
                      setPaidPage(p =>
                        Math.min(p + 1, Math.ceil(filteredPaid.length / itemsPerPage))
                      )
                    }
                  >
                    <ChevronRight className="size-8 hover:bg-gray-300 rounded-md duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* dialog for adding dues */}
      <Dialog Dialog open={addDueDialog} onOpenChange={setAddDueDialog} >
        <DialogContent className="w-[80%]">
          <form onSubmit={handleAddDue}>
            <DialogHeader>
              <DialogTitle className="text-center font-semibold">
                Add New Due
              </DialogTitle>
              <DialogDescription className="text-md text-gray-700">
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 my-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="duedate">Due Date</label>
                <input
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  type="date"
                  name=""
                  id=""
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />

                <label htmlFor="amount">Amount</label>
                <input
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  type="number"
                  name=""
                  id=""
                  placeholder="₱ 0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <label htmlFor="Status">Status</label>
                <select
                  name="" id=""
                  required
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled hidden></option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
            <DialogFooter className="flex flex-row">
              <DialogClose className="bg-white text-black rounded-md w-1/2 cursor-pointer border border-black hover:bg-gray-300 duration-200">
                Cancel
              </DialogClose>
              <button type="submit" className="bg-blue-button w-1/2 text-white py-3 rounded-md hover:bg-black duration-200">
                Add Due
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* dialog for updating dues */}
      <Dialog Dialog open={updateDueDialog} onOpenChange={setUpdateDueDialog} >
        <DialogContent className="w-[80%]">
          <form onSubmit={handleUpdateDue}>
            <DialogHeader>
              <DialogTitle className="text-center font-semibold">
                Update Due
              </DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 my-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="duedate">Due Date</label>
                <input
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  type="date"
                  name=""
                  id=""
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />

                <label htmlFor="amount">Amount</label>
                <input
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  type="number"
                  name=""
                  id=""
                  placeholder="₱ 0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <label htmlFor="Status">Status</label>
                <select
                  name="" id=""
                  required
                  className="bg-customgray2 p-2 text-md rounded-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled hidden></option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
            <DialogFooter className="flex flex-row">
              <DialogClose className="bg-white text-black rounded-md w-1/2 cursor-pointer border border-black hover:bg-gray-300 duration-200">
                Cancel
              </DialogClose>
              <button type="submit" className="bg-blue-button w-1/2 text-white py-3 rounded-md hover:bg-black duration-200">
                Update Due
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default Dues;