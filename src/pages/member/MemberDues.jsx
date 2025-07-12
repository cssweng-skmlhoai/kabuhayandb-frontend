import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import axios from "axios";
import "./Members.css";

const MemberDues = () => {
  const { id } = useParams();

  const [selectedDue, setSelectedDue] = useState("");

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  return (
    <div className="main">
      <div className="info space-y-4">
        {/* Select Due Type */}
        <Card className="card">
          <CardContent className="card-content flex justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:max-w-lg">
              <p className="card-label-flex">Select type of due:</p>
              <Select defaultValue="Monthly Amortization">
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select type of due" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Monthly Amortization" value="Monthly Amortization">Monthly Amortization</SelectItem>
                  <SelectItem key="Monthly Dues" value="Monthly Dues">Monthly Dues</SelectItem>
                  <SelectItem key="Taxes" value="Taxes">Taxes</SelectItem>
                  <SelectItem key="Penalties" value="Penalties">Penalties</SelectItem>
                  <SelectItem key="Others" value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="card">
          <CardContent className="card-content flex justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:max-w-lg">
              <Label className="card-label-flex">Outstanding Balance:</Label>
              <Input readOnly value="₱ 100.00" className="w-full md:w-64" />
            </div>
          </CardContent>
        </Card>

        {/* Unpaid Dues Table */}
        <Card className="card">
          <CardContent className="card-content">
            <h4 className="card-label">Unpaid Dues (Type)</h4>
            <div className="payment-history-header">
              <span>Receipt No.</span>
              <span>Amount</span>
              <span>Due Date</span>
            </div>
            <div className="space-y-2.5">
              <div className="payment-row">
                <span>RI234</span>
                <span>₱ 100.00</span>
                <span>11/07/25</span>
              </div>
              <div className="payment-row">
                <span>####</span>
                <span>₱ 0.00</span>
                <span>00/00/00</span>
              </div>
              <div className="payment-row">
                <span>####</span>
                <span>₱ 0.00</span>
                <span>00/00/00</span>
              </div>
            </div>

            <Pagination className="pagination mt-4">
              <PaginationContent className="pagination-content">
                <PaginationItem>
                  <PaginationPrevious disabled />
                </PaginationItem>
                <span className="pagination-page-text">1 of 1</span>
                <PaginationItem>
                  <PaginationNext disabled />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        {/* Payment History Table */}
        <Card className="card">
          <CardContent className="card-content">
            <h4 className="card-label">Payment History (Type)</h4>
            <div className="payment-history-header">
              <span>Receipt No.</span>
              <span>Amount</span>
              <span>Date Paid</span>
            </div>
            <div className="space-y-2.5">
              <div className="payment-row">
                <span>####</span>
                <span>₱ 0.00</span>
                <span>00/00/00</span>
              </div>
              <div className="payment-row">
                <span>####</span>
                <span>₱ 0.00</span>
                <span>00/00/00</span>
              </div>
              <div className="payment-row">
                <span>####</span>
                <span>₱ 0.00</span>
                <span>00/00/00</span>
              </div>
            </div>

            <Pagination className="pagination mt-4">
              <PaginationContent className="pagination-content">
                <PaginationItem>
                  <PaginationPrevious disabled />
                </PaginationItem>

                <PaginationItem>
                  <span className="pagination-page-text flex items-center">1 of 1</span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext disabled />
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