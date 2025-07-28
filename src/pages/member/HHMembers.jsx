import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DatePickerField from "@/components/MemberCompts/DatePickerField";
import ClearableSelectField from "@/components/MemberCompts/ClearableSelectField";
import ConfirmDialog from "@/components/MemberCompts/ConfirmDialog";
import ClearableInputField from "@/components/MemberCompts/ClearableInputField";
import AddFamilyMemberDialog from "@/components/MemberCompts/AddFamilyMemberDialog";
import BackToTopButton from "@/components/MemberCompts/BackToTopButton";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";
import "./Members.css";
import useAuthStore from "@/authStore";

const HHMembers = ({ view }) => {
  const memberId = useAuthStore((s) => s.memberId);
  const navigate = useNavigate();

  const [savedData, setSavedData] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [openAccordions, setOpenAccordions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isEdit = view === "edit";

  const form = useForm({
    mode: "all",
    defaultValues: {
      id: "",
      last_name: "",
      first_name: "",
      middle_name: "",
      birth_date: "",
      age: "",
      gender: "",
      contact_number: "",
      position: "",
      family: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "family",
  });

  const watchedFamily = useWatch({
    control: form.control,
    name: "family",
  });

  const visibleFamilyCount = watchedFamily.filter((m) => m.update !== false).length || 0;

  const toDateString = (date) =>
    date instanceof Date ? format(date, "yyyy-MM-dd") : date;

  const watchedBirthDate = useWatch({ control: form.control, name: "birth_date" });

  // function to calculate age to show in the input field
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const hasNotHadBirthdayThisYear =
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

    if (hasNotHadBirthdayThisYear) {
      age--;
    }

    return age;
  };

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/members/info/${memberId}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        const data = res.data;

        const signatureBase64 = bufferToBase64Image(data.confirmity_signature?.data);

        const normalizedData = {
          last_name: data.last_name,
          first_name: data.first_name,
          middle_name: data.middle_name,
          birth_date: data.birth_date,
          age: data.age,
          gender: data.gender,
          contact_number: data.contact_number,
          position: data.position,
          family: (data.family_members || [])
            .filter((fm) => fm.update !== false)
            .map((fm) => ({
              id: fm.id,
              last_name: fm.last_name,
              first_name: fm.first_name,
              middle_name: fm.middle_name,
              relation_to_member: fm.relation,
              birth_date: fm.birth_date,
              age: fm.age,
              gender: fm.gender,
              educational_attainment: fm.educational_attainment,
              update: true,
            })),
        };

        setSignatureFile(signatureBase64);
        setSavedData(normalizedData);
        form.reset(normalizedData);
      })
      .catch((err) => toast.error(err.response?.data?.error || "Something went wrong"));
  }, [form, memberId, API_SECRET]);

  const bufferToBase64Image = (bufferData) => {
    if (!bufferData) return null;

    const uint8Array = new Uint8Array(bufferData);

    const header = uint8Array.slice(0, 4).join(",");

    let mime = "image/png";
    if (header === "255,216,255,224" || header === "255,216,255,225") {
      mime = "image/jpeg";
    } else if (header === "137,80,78,71") {
      mime = "image/png";
    }

    const binary = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    const base64 = btoa(binary);
    return `data:${mime};base64,${base64}`;
  };

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // function for the deletion of a family member from the form
  const handleDeleteFamilyMember = (indexToRemove) => {
    const memberToDelete = form.getValues(`family.${indexToRemove}`);
    const name = memberToDelete?.first_name || `Family member`;
    if (memberToDelete?.id) {
      form.setValue(`family.${indexToRemove}.update`, false);
    } else {
      remove(indexToRemove);
    }
    toast(`${name} has been removed.`, {
      duration: 3000,
    });
  };

  // function to update member details
  const handleUpdates = async (data) => {
    try {
      const cleanedFamilyMembers = data.family
        .filter((m) => m.update || (m.id && m.update === false))
        .map((member) => ({
          id: member.id,
          last_name: member.last_name,
          first_name: member.first_name,
          middle_name: member.middle_name,
          relation_to_member: member.relation_to_member,
          birth_date: toDateString(member.birth_date),
          gender: member.gender,
          educational_attainment: member.educational_attainment,
          update: member.update !== false,
        }));

      const payload = {
        members: {
          last_name: data.last_name,
          first_name: data.first_name,
          middle_name: data.middle_name,
          birth_date: toDateString(data.birth_date),
          gender: data.gender,
          contact_number: data.contact_number,
        },
        families: {
          head_position: data.position,
        },
        households: {},
        family_members: cleanedFamilyMembers,
      };

      const formData = new FormData();

      formData.append("members", JSON.stringify(payload.members));
      formData.append("families", JSON.stringify(payload.families));
      formData.append("households", JSON.stringify(payload.households));
      formData.append("family_members", JSON.stringify(payload.family_members));

      let fileToUpload = signatureFile;

      if (typeof fileToUpload === "string") {
        fileToUpload = base64ToFile(fileToUpload, "signature");
      }

      if (fileToUpload instanceof File) {
        formData.append("confirmity_signature", fileToUpload);
      }

      await axios.put(`${API_URL}/members/info/${memberId}`, formData, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSavedData(data);
      navigate(`/memberView`);
      toast.success("Changes saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="main">
        <div className="btn-div">
          {isEdit ? (
            <>
              <Button
                variant="cancel"
                className="p-6 border border-black hover:bg-gray-300"
                onClick={() => {
                  if (savedData) {
                    form.reset(savedData);
                  }
                  navigate(`/memberView`);
                }}>
                Cancel
              </Button>

              <ConfirmDialog
                title="Save Changes"
                description="Are you sure you want to save these changes?"
                triggerLabel="Save Details"
                onConfirm={form.handleSubmit(handleUpdates)}
                variant="edit_details"
              />
            </>
          ) : (
            <Button
              variant="edit_details"
              className="p-6 hover:bg-black"
              onClick={() => navigate(`/memberView/edit`)}
            >
              {" "}
              Edit Details{" "}
            </Button>
          )}
        </div>

        <div className="info">
          <Form {...form}>
            <Card className="card">
              <CardContent className="card-content">
                <div className="space-y-4 grid gap-4 sm:grid-cols-2">
                  <ClearableInputField control={form.control} name="last_name" label="Last Name" isEdit={isEdit} inputProps={{ placeholder: "Last Name" }} rules={{ required: "Please enter your last name" }} />
                  <ClearableInputField control={form.control} name="first_name" label="First Name" isEdit={isEdit} inputProps={{ placeholder: "First Name" }} rules={{ required: "Please enter your first name" }} />
                  <ClearableInputField control={form.control} name="middle_name" label="Middle Name" isEdit={isEdit} inputProps={{ placeholder: "Middle Name" }} rules={{ required: "Please enter your middle name" }} />
                  <DatePickerField control={form.control} name="birth_date" label="Date of Birth" isEdit={isEdit} rules={{ required: "Please select your birth date" }} />

                  <div className="inline-fields">
                    <ClearableInputField control={form.control} name="age" label="Age" isEdit={false} className="w-1/2" inputProps={{ readOnly: true, placeholder: "Age", value: calculateAge(watchedBirthDate) }} />
                    <ClearableSelectField control={form.control} name="gender" label="Gender" isEdit={isEdit} className="w-1/2" options={["Male", "Female", "Other"]} rules={{ required: "Please choose from the gender options" }} />
                  </div>

                  <ClearableInputField control={form.control} name="position" label="Position" isEdit={isEdit} inputProps={{ placeholder: "Position" }} rules={{ required: "Please enter your position" }} />
                  <ClearableInputField control={form.control} name="contact_number" label="Contact Number" isEdit={isEdit}
                    rules={{
                      required: "Please enter your contact number",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Must be an 11-digit number",
                      },
                    }}
                    inputProps={{ placeholder: "Contact Number" }} />
                </div >
              </CardContent >
            </Card >

            <div className="flex flex-col gap-4 card">
              <div className="bg-white px-5 py-6 flex justify-between items-center rounded-md font-poppins">
                <p className="font-medium">Family Composition ({visibleFamilyCount})</p>

                {isEdit && (
                  <div
                    className="flex items-center gap-2 bg-customgray1 px-2 py-2 rounded-sm cursor-pointer hover:bg-gray-400 duration-300"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-1 size-5" />
                    <p>Add</p>
                  </div>
                )}
              </div>

              <AddFamilyMemberDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAdd={(data) => {
                  append({ ...data, update: true });
                  setOpenAccordions((prev) => [...prev, `member-${fields.length}`]);
                }}
              />

              <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
                <div className="flex flex-col gap-4">
                  {fields.map((member, index) => {
                    const isDeleted = form.getValues(`family.${index}.update`) === false;
                    if (isDeleted) return null;

                    const watchedFirstName = watchedFamily?.[index]?.first_name;

                    return (
                      <AccordionItem key={member.id ?? `new-${index}`} value={`member-${index}`}>
                        <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer text-md">
                          {watchedFirstName || `Family Member ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col bg-white px-5 pb-5 font-poppins rounded-b-md">
                          <div className="grid gap-4 sm:grid-cols-2 mt-4">
                            <ClearableInputField control={form.control} name={`family.${index}.last_name`} label="Last Name" isEdit={isEdit} inputProps={{ placeholder: "Last Name" }} rules={{ required: "Please enter the last name" }} />
                            <ClearableInputField control={form.control} name={`family.${index}.first_name`} label="First Name" isEdit={isEdit} inputProps={{ placeholder: "First Name" }} rules={{ required: "Please enter the first name" }} />
                            <ClearableInputField control={form.control} name={`family.${index}.middle_name`} label="Middle Name" isEdit={isEdit} inputProps={{ placeholder: "Middle Name" }} rules={{ required: "Please enter the middle name" }} />
                            <ClearableInputField control={form.control} name={`family.${index}.relation_to_member`} label="Relation to Member" isEdit={isEdit} inputProps={{ placeholder: "Relation" }} rules={{ required: "Please enter the relation" }} />
                            <DatePickerField control={form.control} name={`family.${index}.birth_date`} label="Birth Date" isEdit={isEdit} rules={{ required: "Please select the birth date" }} />

                            <div className="flex gap-4 col-span-2">
                              <ClearableInputField control={form.control} name={`family.${index}.age`} label="Age" isEdit={false} className="w-1/2" inputProps={{ readOnly: true, placeholder: "Age", value: calculateAge(watchedFamily?.[index]?.birth_date) }} />
                              <ClearableSelectField control={form.control} name={`family.${index}.gender`} label="Gender" isEdit={isEdit} className="w-1/2" options={["Male", "Female", "Prefer not to say"]} rules={{ required: "Please choose gender" }} />
                            </div>

                            <ClearableInputField control={form.control} name={`family.${index}.educational_attainment`} label="Educational Attainment" isEdit={isEdit} inputProps={{ placeholder: "Educational Attainment" }} rules={{ required: "Please enter the educational attainment" }} />
                          </div>

                          {isEdit && (
                            <div className="mt-4 self-end">
                              <ConfirmDialog
                                title="Delete Family Member"
                                description="Are you sure you want to delete this member?"
                                triggerLabel={<><Trash2 className="mr-1" /> Delete</>}
                                onConfirm={() => handleDeleteFamilyMember(index)}
                              />
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </div>
              </Accordion>
            </div>

          </Form >
        </div >
      </div >
      <BackToTopButton />
    </>
  );
};

export default HHMembers;