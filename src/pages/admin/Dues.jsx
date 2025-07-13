import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Dues = () => {
  const { id } = useParams();

  const [dues, setDues] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedType, setSelectedType] = useState("dues");
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [filteredUnpaid, setFilteredUnpaid] = useState([]);

  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Unpaid");
  const [selectedDueId, setSelectedDueId] = useState(null);

  const [addDueDialog, setAddDueDialog] = useState(false);
  const [updateDueDialog, setUpdateDueDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const paginatedUnpaid = filteredUnpaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPaid = filteredPaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      console.log(res.data);
      applyFilters(dues, selectedType);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if (!addDueDialog && !updateDueDialog) {
      setDueDate("");
      setAmount("");
      setStatus("Unpaid");
      setSelectedDueId(null);
    }
  }, [addDueDialog, updateDueDialog]);

  const applyFilters = (allDues, type) => {
    const filtered = allDues.filter(d => d.due_type === type);

    const unpaid = filtered.filter(d => d.status === "Unpaid").sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

    const paid = filtered.filter(d => d.status === "Paid").sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

    setFilteredUnpaid(unpaid);
    setFilteredPaid(paid);
    setCurrentPage(1);
  };

  const handleAddDue = (e) => {
    e.preventDefault();

    const payload = {
      due_date: dueDate,
      amount,
      status,
      due_type: selectedType,
      member_id,
    };

    axios.post(`${API_URL}/dues`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      // update current dues
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
      member_id,
    };

    axios.put(`${API_URL}/dues/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      // update current dues
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="py-5 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-screen xl:bg-white xl:gap-0 xl:px-5">
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
              <p className="font-semibold text-center text-xl xl:text-2xl">Member1's Dues</p>

              <div className="px-5 py-4 bg-white flex flex-col items-center gap-3 rounded-sm xl:flex-row xl:justify-center">
                <p className="font-medium">Select Type of Due:</p>
                <Select onValueChange={(val) => {
                  setSelectedType(val);
                  applyFilters(dues, val);
                }}>
                  <SelectTrigger className="bg-customgray2 w-[80%] !py-1 !h-auto rounded-md border border-black xl:w-1/3 xl:!py-1.5">
                    <SelectValue placeholder="Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amortization">
                      Monthly Amortization
                    </SelectItem>
                    <SelectItem value="dues">Monthly Dues</SelectItem>
                    <SelectItem value="taxes">Taxes</SelectItem>
                    <SelectItem value="penalties">Penalties</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center justify-center gap-5 xl:gap-0 xl:flex-row">
                <div className="px-5 py-4 bg-white flex flex-col items-center gap-3 rounded-sm w-full xl:w-1/2 xl:flex-row xl:justify-center">
                  <p className="font-medium w-full text-center">Outstanding Balance {selectedType}</p>
                  <input
                    className="bg-customgray2 p-2 text-md rounded-sm w-full xl:border xl:border-black" type="text" name="" id="" placeholder="₱ 0.00" readOnly value={`₱ ${Number(balances[selectedType] || 0).toFixed(2)}`} />
                </div>

                <Button className="bg-blue-button w-full rounded-sm !py-5 xl:!py-3 xl:!h-auto xl:w-1/5" onClick={() => setAddDueDialog(true)}>Add New Due</Button>
              </div>

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
                        <th className="px-4 py-2 rounded-tr-md">Date</th>
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
                            key={due.dues_id}
                            className="bg-customgray2 rounded-md cursor-pointer"
                            onClick={() => setUpdateDueDialog(true)}
                          >
                            <td className="px-4 py-2 rounded-l-md">{due.receipt_number}</td>
                            <td className="px-4 py-2">₱ {due.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 rounded-r-md">{new Date(due.due_date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={`flex items-center gap-5 ${filteredPaid.length <= 3 ? "hidden" : ""}`}>
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                    <ChevronLeft />
                  </button>
                  <p>{currentPage}</p>
                  <button
                    onClick={() =>
                      setCurrentPage(p =>
                        Math.min(p + 1, Math.ceil(filteredUnpaid.length / itemsPerPage))
                      )
                    }
                  >
                    <ChevronRight />
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
                        <th className="px-4 py-2 rounded-tr-md">Date</th>
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
                        paginatedPaid.map((due) => (
                          <tr
                            key={due.dues_id}
                            className="bg-customgray2 rounded-md cursor-pointer"
                            onClick={() => setUpdateDueDialog(true)}
                          >
                            <td className="px-4 py-2 rounded-l-md">{due.receipt_number}</td>
                            <td className="px-4 py-2">₱ {due.amount.toFixed(2)}</td>
                            <td className="px-4 py-2 rounded-r-md">{new Date(due.due_date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className={`flex items-center gap-5 ${filteredPaid.length <= 3 ? "hidden" : ""}`}>
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                    <ChevronLeft />
                  </button>
                  <p>{currentPage}</p>
                  <button
                    onClick={() =>
                      setCurrentPage(p =>
                        Math.min(p + 1, Math.ceil(filteredPaid.length / itemsPerPage))
                      )
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* dialog for adding dues */}
      <Dialog open={addDueDialog} onOpenChange={setAddDueDialog}>
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
      <Dialog open={updateDueDialog} onOpenChange={setUpdateDueDialog}>
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
