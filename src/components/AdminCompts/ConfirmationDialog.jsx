import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ConfirmationDialog = ({ open, setOpen, title, description, confirmText = "Confirm", cancelText = "Cancel", confirmColor = "bg-blue-button", cancelColor = "bg-black", onConfirm, confirmHover = "", certification = false, crn = "", memberName = "", datePrinted = "" }) => {

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-left">{title}</DialogTitle>
          <DialogDescription className="text-md text-gray-700">{description}</DialogDescription>
        </DialogHeader>

        {certification && (
          <div className="flex flex-col gap-3 my-5">
            <div className="flex flex-col gap-2 font-medium text-lg">
              <p>CRN: <span className="font-normal">{crn}</span></p>
              <p>Member Name: <span className="font-normal">{memberName}</span></p>
              <p>Date Requested (yyyy-mm-dd): <span className="font-normal">{formatDate(datePrinted)}</span></p>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between gap-4">
          <Button
            className={`w-[48%] py-6 text-md font-normal ${confirmColor} ${confirmHover}`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <DialogClose className={`w-1/2 rounded-md text-white cursor-pointer hover:opacity-80 duration-200 ${cancelColor}`}>
            {cancelText}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog