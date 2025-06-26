import { useState } from "react";
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

// To be revised - inline with database structure
// Sample Payment History
const allPayments = [
  { receiptNo: "001", amount: "1,000", date: "2024-01-15" },
  { receiptNo: "002", amount: "1,000", date: "2024-02-15" },
  { receiptNo: "003", amount: "1,000", date: "2024-03-15" },
  { receiptNo: "004", amount: "1,000", date: "2024-04-15" },
  { receiptNo: "005", amount: "1,000", date: "2024-05-15" },
];

// Sample Dues Data
const duesData = {
  "Monthly Amortization": {
    type: "Monthly Amortization",
    status: "Paid",
    amount: "5,000",
    dueDate: "2024-06-30",
  },
  "Monthly Dues": {
    type: "Monthly Dues",
    status: "Unpaid",
    amount: "1,000",
    dueDate: "2024-06-30",
  },
  Taxes: {
    type: "Taxes",
    status: "Unpaid",
    amount: "500",
    dueDate: "2024-07-15",
  },
  Penalties: {
    type: "Penalties",
    status: "Unpaid",
    amount: "300",
    dueDate: "2024-07-20",
  },
  Others: {
    type: "Others",
    status: "Pending",
    amount: "150",
    dueDate: "2024-08-01",
  },
};

const itemsPerPage = 3;

const MemberDues = () => {
  const [selectedDue, setSelectedDue] = useState("");
  const [page, setPage] = useState(1);

  const selectedDetails = duesData[selectedDue] || null;
  const totalPages = Math.ceil(allPayments.length / itemsPerPage);
  const paginatedData = allPayments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="main">
      <div className="info">
        <Card className="card">
          <CardContent>
            <p className="due-label">Select type of due:</p>
            <Select
              value={selectedDue}
              onValueChange={(value) => {
                setSelectedDue(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type of due" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(duesData).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="space-y-4 grid gap-4 sm:grid-cols-2">
            <div className="row">
              <Label htmlFor="type" className="w-24">Type</Label>
              <Input
                id="type"
                readOnly
                value={selectedDue ? selectedDetails.type : ""}
                placeholder="Type"
                className="w-full"
              />
            </div>
            <div className="row">
              <Label htmlFor="status" className="w-24">Status</Label>
              <Input
                id="status"
                readOnly
                value={selectedDue ? selectedDetails.status : ""}
                placeholder="Status"
                className="w-full"
              />
            </div>
            <div className="row">
              <Label htmlFor="amount" className="w-24">Amount</Label>
              <Input
                id="amount"
                readOnly
                value={
                  selectedDue
                    ? `₱ ${selectedDetails.amount.toLocaleString()}`
                    : ""
                }
                placeholder="Amount"
                className="w-full"
              />
            </div>
            <div className="row">
              <Label htmlFor="due-date" className="w-24">Due Date</Label>
              <Input
                id="due-date"
                readOnly
                value={selectedDue ? selectedDetails.dueDate : ""}
                placeholder="mm/dd/yy"
                className="w-full"
              />
            </div>

            {selectedDue && (
              <div className="due-message">
                {/* Logic to be updated based on database */}
                {selectedDetails.amount === 0 ||
                selectedDetails.status.toLowerCase() === "paid" ? (
                  <>You have no outstanding balance as of {"mm-dd-yyyy"}.</>
                ) : (
                  <>
                    Please pay your outstanding balance before or on{" "}
                    {"mm-dd-yyyy"}.
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <h4 className="payment-history-label">Payment History</h4>
            <div className="payment-history-header">
              <span>Receipt No.</span>
              <span>Amount</span>
              <span>Date</span>
            </div>
            <div className="space-y-2">
              {paginatedData.map((payment, index) => (
                <div key={index} className="payment-row">
                  <span>{payment.receiptNo}</span>
                  <span>{`₱ ${payment.amount}`}</span>
                  <span>{payment.date}</span>
                </div>
              ))}
            </div>

            <Pagination className="pagination">
              <PaginationContent className="pagination-content">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className={page === 1 ? "disabled" : ""}
                  />
                </PaginationItem>
                <span className="pagination-page-text">
                  {page} of {totalPages}
                </span>
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className={page === totalPages ? "disabled" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDues;