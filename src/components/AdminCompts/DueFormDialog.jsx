import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

const DueFormDialog = ({ open, setOpen, onSubmit, title = "Add New Due", showReceipt = false, showDelete = false, onDeleteClick, dueType, setDueType, selectedType = "All", receiptNumber, setReceiptNumber, dueDate, setDueDate, amount, setAmount, status, setStatus, submitText = "Submit", }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[80%] flex items-center justify-center">
        <form onSubmit={onSubmit} className="w-[95%]">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-md text-gray-700"></DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 my-5">
            <div className="flex flex-col gap-2">
              {showReceipt && (
                <>
                  <label htmlFor="receipt">Receipt Number</label>
                  <input
                    className="bg-customgray2 p-2 text-md rounded-sm"
                    type="number"
                    placeholder="e.g. 0001"
                    required
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                  />
                </>
              )}

              {selectedType === "All" && (
                <>
                  <label htmlFor="dueType">Due Type</label>
                  <select
                    required
                    className="bg-customgray2 p-2 text-md rounded-sm"
                    value={dueType}
                    onChange={(e) => setDueType(e.target.value)}
                  >
                    <option value="Monthly Amortization">Monthly Amortization</option>
                    <option value="Monthly Dues">Monthly Dues</option>
                    <option value="Taxes">Taxes</option>
                    <option value="Penalties">Penalties</option>
                    <option value="Others">Others</option>
                  </select>
                </>
              )}

              <label htmlFor="duedate">Due Date</label>
              <input
                className="bg-customgray2 p-2 text-md rounded-sm"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <label htmlFor="amount">Amount</label>
              <input
                className="bg-customgray2 p-2 text-md rounded-sm"
                type="number"
                placeholder="₱ 0.00"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <label htmlFor="status">Status</label>
              <select
                required
                className="bg-customgray2 p-2 text-md rounded-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled hidden></option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              {showDelete && (
                <button
                  type="button"
                  onClick={onDeleteClick}
                  className="bg-red-700 text-white text-sm w-1/4 py-1 rounded-md hover:bg-red-900 duration-200 self-center mt-3 mb-2"
                >
                  Delete Due
                </button>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-row">
            <button
              type="submit"
              className="bg-blue-button w-1/2 text-white py-3 rounded-md hover:bg-black duration-200"
            >
              {submitText}
            </button>
            <DialogClose className="bg-white text-black rounded-md w-1/2 cursor-pointer border border-black hover:bg-gray-300 duration-200">
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DueFormDialog