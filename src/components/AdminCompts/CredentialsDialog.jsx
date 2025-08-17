import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const CredentialsDialog = ({ open, setOpen, credentials, onClose, showCloseButton, secondsLeft }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[80%] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">TAKE NOTE!</DialogTitle>
          <DialogDescription>
          </DialogDescription>
          <div className="text-gray-700 flex flex-col items-center gap-3 text-lg">
            <div className="font-medium text-center">
              The following are the credentials of this newly created member.<br />
              PLEASE NOTE THEM DOWN. THIS WILL ONLY SHOW ONCE.
            </div>
            <div>Username: <span className="font-semibold">{credentials.username}</span></div>
            <div>Password: <span className="font-semibold">{credentials.password}</span></div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="w-full bg-blue-button mt-5 py-6 text-md font-normal"
            onClick={onClose}
            disabled={!showCloseButton}
          >
            {showCloseButton ? "Close" : `Close (${secondsLeft})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CredentialsDialog