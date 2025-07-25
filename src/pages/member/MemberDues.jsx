import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import "./Members.css";
import useAuthStore from "@/authStore";
import axios from "axios";
import { toast } from "sonner";

const MemberDues = () => {
  const { memberId } = useAuthStore();

  const [dues, setDues] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedType, setSelectedType] = useState("All");
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [filteredUnpaid, setFilteredUnpaid] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 3;
  // const paginatedUnpaid = filteredUnpaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  // const paginatedPaid = filteredPaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    axios.get(`${API_URL}/dues/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      const { dues, balances } = res.data;
      setDues(dues);
      setBalances(balances);
      applyFilters(dues, selectedType);
    }).catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
  }, [memberId, API_SECRET, selectedType]);

  const applyFilters = (allDues, type) => {
    const filtered = type === "All" ? allDues : allDues.filter(d => d.due_type === type);

    const unpaid = filtered.filter(d => d.status === "Unpaid").sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

    const paid = filtered.filter(d => d.status === "Paid").sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid));

    setFilteredUnpaid(unpaid);
    setFilteredPaid(paid);
    setUnpaidPage(1);
    setPaidPage(1);
  };

  const dueTypeBalances = (type) => {
    if (type === "Monthly Amortization") return "amortization";
    if (type === "Monthly Dues") return "monthly";
    if (type === "Taxes") return "taxes";
    if (type === "Penalties") return "penalties";
    if (type === "Others") return "others";
  }

  const getOutstandingBalance = (type) => {
    if (type === "All") {
      return Object.values(balances).reduce((acc, val) => acc + parseFloat(val || 0), 0);
    }
    return parseFloat(balances[dueTypeBalances(type)] || 0);
  };

  return (
    <div className="main">
      <div className="info space-y-4">
        <Card className="card">
          <CardContent className="card-content flex justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:max-w-lg">
              <p className="card-label-flex">Select type of due:</p>
              <Select
                value={selectedType}
                onValueChange={(val) => {
                  setSelectedType(val);
                  applyFilters(dues, val);
                }}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select type of due" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Dues</SelectItem>
                  <SelectItem value="Monthly Amortization">Monthly Amortization</SelectItem>
                  <SelectItem value="Monthly Dues">Monthly Dues</SelectItem>
                  <SelectItem value="Taxes">Taxes</SelectItem>
                  <SelectItem value="Penalties">Penalties</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="card-content flex flex-col items-center text-center gap-2">
            <Label className="card-label">Outstanding Balance ({selectedType === "All" ? "All Types" : selectedType})</Label>
            {getOutstandingBalance(selectedType) === 0 ? (
              <p className="text-sm italic">
                You have no outstanding balance as of {format(new Date(), "MMMM d, yyyy")}.
              </p>
            ) : (
              <input
                className="bg-customgray2 p-2 text-md rounded-sm w-full xl:border xl:border-black"
                type="text"
                readOnly
                value={`₱ ${getOutstandingBalance(selectedType).toLocaleString("en-US")}`}
              />
            )}
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="card-content">
            <Label className="card-label">Unpaid Dues ({selectedType})</Label>
            {paginatedUnpaid.length === 0 ? (
              <p className="text-center text-sm italic">
                You have no unpaid dues for this type as of {format(new Date(), "MMMM d, yyyy")}.
              </p>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className={`${selectedType === "All" ? "min-w-[500px]" : "min-w-[380px]"}`}>
                  <div className={`font-semibold grid text-center text-sm py-2 ${selectedType === "All" ? "grid-cols-4" : "grid-cols-3"}`}>
                    {selectedType === "All" && (<span>Due Type</span>)}
                    <span>Amount</span>
                    <span>Due Date</span>
                    <span>Receipt No.</span>
                  </div>
                  <div className="space-y-2.5">
                    {paginatedUnpaid.map((due) => (
                      <div key={due.id} className={`grid text-center py-2 text-sm bg-[#F0EDED] rounded-md ${selectedType === "All" ? "grid-cols-4" : "grid-cols-3"}`}>
                        {selectedType === "All" && (<span>{due.due_type}</span>)}
                        <span>₱ {Number(due.amount).toFixed(2)}</span>
                        <span>{format(new Date(due.due_date), "MMMM d, yyyy")}</span>
                        <span>{due.receipt_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {filteredUnpaid.length > itemsPerPage && (
              <Pagination className="pagination mt-4">
                <PaginationContent className="pagination-content">
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setUnpaidPage(p => Math.max(p - 1, 1))} />
                  </PaginationItem>
                  <span className="pagination-page-text">
                    Page {unpaidPage} of {totalUnpaidPages}
                  </span>
                  <PaginationItem>
                    <PaginationNext onClick={() =>
                      setUnpaidPage(p => Math.min(p + 1, Math.ceil(filteredUnpaid.length / itemsPerPage)))
                    } />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="card-content">
            <Label className="card-label">Payment History ({selectedType})</Label>
            {paginatedPaid.length === 0 ? (
              <p className="text-center text-sm italic">
                You have no payment history for this type as of {format(new Date(), "MMMM d, yyyy")}.
              </p>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className={`${selectedType === "All" ? "min-w-[500px]" : "min-w-[380px]"}`}>
                  <div className={`font-semibold grid text-center text-sm py-2 ${selectedType === "All" ? "grid-cols-4" : "grid-cols-3"}`}>
                    {selectedType === "All" && (<span>Due Type</span>)}
                    <span>Amount</span>
                    <span>Date Paid</span>
                    <span>Receipt No.</span>
                  </div>
                  <div className="space-y-2.5">
                    {paginatedPaid.map((due) => (
                      <div key={due.id} className={`grid text-center py-2 text-sm bg-[#F0EDED] rounded-md ${selectedType === "All" ? "grid-cols-4" : "grid-cols-3"}`}>
                        {selectedType === "All" && (<span>{due.due_type}</span>)}
                        <span>₱ {Number(due.amount).toFixed(2)}</span>
                        <span>{format(new Date(due.due_date), "MMMM d, yyyy")}</span>
                        <span>{due.receipt_number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {filteredPaid.length > itemsPerPage && (
              <Pagination className="pagination mt-4">
                <PaginationContent className="pagination-content">
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPaidPage(p => Math.max(p - 1, 1))} />
                  </PaginationItem>
                  <span className="pagination-page-text">
                    Page {paidPage} of {totalPaidPages}
                  </span>
                  <PaginationItem>
                    <PaginationNext onClick={() =>
                      setPaidPage(p => Math.min(p + 1, Math.ceil(filteredPaid.length / itemsPerPage)))
                    } />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDues;