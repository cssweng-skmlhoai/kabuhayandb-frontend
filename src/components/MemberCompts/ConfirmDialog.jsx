import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  trigger,
  triggerLabel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="edit_details" className="p-6 hover:bg-black">{triggerLabel}</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="py-5 px-7 mr-3 border border-black hover:bg-gray-300">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction className="!py-2 !px-7 !h-auto ml-3 hover:bg-black" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
