import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const MemberDues = () => {
  const { memberId } = useAuthStore();

  const [dues, setDues] = useState([]);
  const [balances, setBalances] = useState({});
  const [selectedType, setSelectedType] = useState("dues");
  const [filteredPaid, setFilteredPaid] = useState([]);
  const [filteredUnpaid, setFilteredUnpaid] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const paginatedUnpaid = filteredUnpaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedPaid = filteredPaid.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      console.error(err);
    });
  }, [memberId, API_SECRET, selectedType]);

  const applyFilters = (allDues, type) => {
    const normalizedType = type.toLowerCase();
    const filtered = allDues.filter(d => d.due_type.toLowerCase() === normalizedType);

    const unpaid = filtered.filter(d => d.status === "Unpaid").sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

    const paid = filtered.filter(d => d.status === "Paid").sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid));

    setFilteredUnpaid(unpaid);
    setFilteredPaid(paid);
    setCurrentPage(1);
  };

  return (
    <div className="main">
      <div className="info space-y-4">
        {/* Select Due Type */}
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
                  <SelectItem value="amortization">Monthly Amortization</SelectItem>
                  <SelectItem value="dues">Monthly Dues</SelectItem>
                  <SelectItem value="taxes">Taxes</SelectItem>
                  <SelectItem value="penalties">Penalties</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="card">
          <CardContent className="card-content flex flex-col items-center text-center gap-2">
            <Label className="card-label">Outstanding Balance</Label>

            {Number(balances?.[selectedType] || 0) === 0 ? (
              <p className="text-sm italic">
                You have no outstanding balance as of {format(new Date(), "MMMM d, yyyy")}.
              </p>
            ) : (
              <Input
                readOnly
                value={`₱ ${Number(balances?.[selectedType]).toFixed(2)}`}
                className="w-full md:w-64 text-center"
                style={{ backgroundColor: "#F0EDED" }}
              />
            )}
          </CardContent>
        </Card>

        {/* Unpaid Dues Table */}
        <Card className="card">
          <CardContent className="card-content">
            <Label className="card-label">Unpaid Dues ({selectedType})</Label>

            {paginatedUnpaid.length === 0 ? (
              <p className="text-center text-sm italic">You have no unpaid dues for this type as of {format(new Date(), "MMMM d, yyyy")}.</p>
            ) : (
              <>
                <div className="payment-history-header">
                  <span>Receipt No.</span>
                  <span>Amount</span>
                  <span>Due Date</span>
                </div>
                <div className="space-y-2.5">
                  {paginatedUnpaid.map((due) => (
                    <div key={due.id} className="payment-row">
                      <span>{due.receipt_number}</span>
                      <span>₱ {Number(due.amount).toFixed(2)}</span>
                      <span>{format(new Date(due.due_date), "MMMM d, yyyy")}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredUnpaid.length > itemsPerPage && (
              <Pagination className="pagination mt-4">
                <PaginationContent className="pagination-content">
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} />
                  </PaginationItem>
                  <span className="pagination-page-text">{currentPage} of {Math.ceil(filteredUnpaid.length / itemsPerPage)}</span>
                  <PaginationItem>
                    <PaginationNext onClick={() =>
                      setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredUnpaid.length / itemsPerPage)))
                    } />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>

        {/* Payment History Table */}
        <Card className="card">
          <CardContent className="card-content">
            <Label className="card-label">Payment History ({selectedType})</Label>
            {paginatedPaid.length === 0 ? (
              <p className="text-center text-sm italic">You have no payment history for this type as of {format(new Date(), "MMMM d, yyyy")}.</p>
            ) : (
              <>
                <div className="payment-history-header">
                  <span>Receipt No.</span>
                  <span>Amount</span>
                  <span>Date Paid</span>
                </div>
                <div className="space-y-2.5">
                  {paginatedPaid.map((due) => (
                    <div key={due.id} className="payment-row">
                      <span>{due.receipt_number}</span>
                      <span>₱ {Number(due.amount).toFixed(2)}</span>
                      <span>{format(new Date(due.date_paid), "MMMM d, yyyy")}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {filteredPaid.length > itemsPerPage && (
              <Pagination className="pagination mt-4">
                <PaginationContent className="pagination-content">
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} />
                  </PaginationItem>
                  <span className="pagination-page-text">{currentPage} of {Math.ceil(filteredPaid.length / itemsPerPage)}</span>
                  <PaginationItem>
                    <PaginationNext onClick={() =>
                      setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredPaid.length / itemsPerPage)))
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