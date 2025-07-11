import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import ClearableInputField from "@/components/MemberCompts/ClearableInputField";
import DatePickerField from "@/components/MemberCompts/DatePickerField";
import ClearableSelectField from "@/components/MemberCompts/ClearableSelectField";

const AddFamilyMemberDialog = ({ onAdd, open, onOpenChange }) => {
  const form = useForm({
    defaultValues: {
      last_name: "",
      first_name: "",
      middle_name: "",
      relation_to_member: "",
      birth_date: "",
      age: "",
      gender: "",
      educational_attainment: "",
    },
  });

  const handleSubmit = (data) => {
    onAdd(data); 
    form.reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();            
    onOpenChange(false);     
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <ClearableInputField control={form.control} name="last_name" label="Last Name" isEdit inputProps={{placeholder: "Last Name"}}/>
          <ClearableInputField control={form.control} name="first_name" label="First Name" isEdit inputProps={{placeholder: "First Name"}}/>
          <ClearableInputField control={form.control} name="middle_name" label="Middle Name" isEdit inputProps={{placeholder: "Middle Name"}}/>
          <ClearableInputField control={form.control} name="relation_to_member" label="Relation" isEdit inputProps={{placeholder: "Relation"}}/>
          <DatePickerField control={form.control} name="birth_date" label="Date of Birth" isEdit />
          <div className="inline-fields">
                  <ClearableInputField control={form.control} name="age" label="Age" isEdit={false} className="w-1/2" inputProps={{ readOnly: true, placeholder: "Age" }}/>
                  <ClearableSelectField control={form.control} name="gender" label="Gender" isEdit className="w-1/2" options={["Male", "Female", "Prefer not to say"]}/>
          </div>
          <ClearableInputField control={form.control} name="educational_attainment" label="Educational Attainment" isEdit inputProps={{placeholder: "Educational Attainment"}}/>

          <DialogFooter className="flex flex-row gap-2 w-full">
            <Button type="button" variant="cancel_outline" onClick={handleCancel}  className="w-1/2">Cancel</Button>
            <Button type="submit" variant="confirm"  className="w-1/2">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFamilyMemberDialog;