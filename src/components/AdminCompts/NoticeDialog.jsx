import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const NoticeDialog = ({ open, setOpen, message }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[70%]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <p className="pt-3 pb-3 text-center font-medium text-lg">
              {message}
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default NoticeDialog