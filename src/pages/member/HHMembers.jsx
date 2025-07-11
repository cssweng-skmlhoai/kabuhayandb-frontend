import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
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
import axios from "axios";
import "./Members.css";

const HHMembers = ({view}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [savedData, setSavedData] = useState(null);
  const [deletedFamilyMembers, setDeletedFamilyMembers] = useState([]);
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

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/members/info/${id}`, {
        headers: { 
          Authorization: `Bearer ${API_SECRET}` 
        },
      }).then((res) => {
        const data = res.data;
        const normalizedData = {
          last_name: data.last_name,
          first_name: data.first_name,
          middle_name: data.middle_name,
          birth_date: data.birth_date,
          age: data.age,
          gender: data.gender,
          contact_number: data.contact_number,
          position: data.position,
          family: (data.family_members || []).map((fm) => ({
            id: fm.id,
            last_name: fm.last_name,
            first_name: fm.first_name,
            middle_name: fm.middle_name,
            relation_to_member: fm.relation,
            birth_date: fm.birth_date,
            age: fm.age,
            gender: fm.gender,
            educational_attainment: fm.educational_attainment,
          })),
        };

        setSavedData(normalizedData); 
        form.reset(normalizedData);  

      }).catch(err => 
        console.log(err))
  }, [form, id]);

  // function for the deletion of a family member from the form
  const handleDeleteFamilyMember = (indexToRemove) => {
    const memberToDelete = form.getValues(`family.${indexToRemove}`);

    if (memberToDelete?.id) {
      setDeletedFamilyMembers((prev) => [...prev, memberToDelete]);
    }

    remove(indexToRemove);
  };

  // function to update member details
  const handleUpdates = async (data) => {
    const cleanedFamilyMembers = data.family.map((member) => {
      const {
        id,
        last_name,
        first_name,
        middle_name,
        relation_to_member,
        birth_date,
        gender,
        educational_attainment,
      } = member;

      return {
        id: id || null,
        last_name,
        first_name,
        middle_name,
        relation_to_member,
        birth_date,
        gender,
        educational_attainment,
      };
    });

    // append deleted family members 
    for (const deleted of deletedFamilyMembers) {
      cleanedFamilyMembers.push({
        id: deleted.id,
        update: false, 
      });
    }

    const payload = {
      members: {
        last_name: data.last_name,
        first_name: data.first_name,
        middle_name: data.middle_name,
        birth_date: data.birth_date,
        gender: data.gender,
        contact_number: data.contact_number,
      },
      families: {
        head_position: data.position,
      },
      households: {}, 
      family_members: cleanedFamilyMembers,
    };

    try {
      await axios.put(`${API_URL}/members/info/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      });

      setDeletedFamilyMembers([]);
      setSavedData(data);
      navigate(`/members/${id}`);
      toast.success("Changes saved successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again!");
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
              onClick={() => {
                if (savedData) {
                  form.reset(savedData);
                  setDeletedFamilyMembers([]);
                } 
                navigate(`/members/${id}`);
                }
              }> Cancel</Button>

            <ConfirmDialog title="Save Changes" description="Are you sure you want to save these changes?" triggerLabel="Save Details" onConfirm={form.handleSubmit(handleUpdates)} variant="edit_details"/>
          </>
        ) : (
          <Button variant="edit_details" onClick={() => navigate(`/members/${id}/edit`)}> Edit Details </Button>
        )}
      </div>

      <div className="info">
        <Form {...form}>
          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 grid gap-4 sm:grid-cols-2">
                <ClearableInputField control={form.control} name="last_name" label="Last Name" isEdit={isEdit} inputProps={{placeholder: "Last Name"}} rules={{required: "Please enter your last name"}}/>
                <ClearableInputField control={form.control} name="first_name" label="First Name" isEdit={isEdit} inputProps={{placeholder: "First Name"}} rules={{required: "Please enter your first name"}}/>
                <ClearableInputField control={form.control} name="middle_name" label="Middle Name" isEdit={isEdit} inputProps={{placeholder: "Middle Name"}} rules={{required: "Please enter your middle name"}}/>
                <DatePickerField control={form.control} name="birth_date" label="Date of Birth" isEdit={isEdit} rules={{required: "Please select your birth date"}}/>

                <div className="inline-fields">
                  <ClearableInputField control={form.control} name="age" label="Age" isEdit={false} className="w-1/2" inputProps={{ readOnly: true, placeholder: "Age" }}/>
                  <ClearableSelectField control={form.control} name="gender" label="Gender" isEdit={isEdit} className="w-1/2" options={["Male", "Female", "Other"]} rules={{required: "Please choose from the gender options"}}/>
                </div>

                <ClearableInputField control={form.control} name="position" label="Position" isEdit={isEdit} inputProps={{placeholder: "Position"}} rules={{required: "Please enter your position"}}/>
                <ClearableInputField control={form.control} name="contact_number" label="Contact Number" isEdit={isEdit} 
                  rules={{
                    required: "Please enter your contact number",
                    pattern: {
                      value: /^[0-9]{11}$/,
                      message: "Must be an 11-digit number",
                    },
                  }}
                  inputProps={{placeholder: "Contact Number"}}/>
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <div className="accordion">
                <p className="text-lg font-semibold"> Family Composition ({fields.length}) </p>
                {isEdit && (
                  <>
                    <Button variant="add" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-1" />
                      Add
                    </Button>

                    <AddFamilyMemberDialog
                      open={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      onAdd={(data) => {
                        append(data);
                        setOpenAccordions((prev) => [...prev, `member-${fields.length}`]);
                      }}
                    />
                  </>
                )}
              </div>

              <Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions} className="space-y-4">
                {fields.map((member, index) => {
                  const watchedFirstName = watchedFamily?.[index]?.first_name;

                  return (
                    <AccordionItem key={member.id || index} value={`member-${index}`}>
                      <AccordionTrigger className={`text-base`}> {watchedFirstName || `Family Member ${index + 1}`} </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                          <ClearableInputField control={form.control} name={`family.${index}.last_name`} label="Last Name" isEdit={isEdit} inputProps={{placeholder: "Last Name"}} rules={{required: "Please enter the last name of the family member"}}/>
                          <ClearableInputField control={form.control} name={`family.${index}.first_name`} label="First Name" isEdit={isEdit} inputProps={{placeholder: "First Name"}} rules={{required: "Please enter the first name of the family member"}}/>
                          <ClearableInputField control={form.control} name={`family.${index}.middle_name`} label="Middle Name" isEdit={isEdit} inputProps={{placeholder: "Middle Name"}} rules={{required: "Please enter the middle name of the family member"}}/>
                          <ClearableInputField control={form.control} name={`family.${index}.relation_to_member`} label="Relation to Member" isEdit={isEdit} inputProps={{placeholder: "Relation to Member"}} rules={{required: "Please enter the relation to member"}}/>
                          <DatePickerField control={form.control} name={`family.${index}.birth_date`} label="Birth Date" isEdit={isEdit} rules={{required: "Please select the birth date of the family member"}}/>
                          
                          <div className="flex gap-4">
                            <ClearableInputField control={form.control} name={`family.${index}.age`} label="Age" isEdit={false} className="w-1/2" inputProps={{ readOnly: true, placeholder: "Age" }}/>
                            <ClearableSelectField control={form.control} name={`family.${index}.gender`} label="Gender" isEdit={isEdit} className="w-1/2" options={["Male", "Female", "Prefer not to say"]} rules={{required: "Please choose from the gender options"}}/>
                          </div>

                          <div>
                            <ClearableInputField control={form.control} name={`family.${index}.educational_attainment`} label="Education" isEdit={isEdit} inputProps={{placeholder: "Educational Attainment"}} rules={{required: "Please enter the educational attainment of the member"}}/>
                          </div>

                          {isEdit && (
                            <div className="delete">
                              <ConfirmDialog 
                                title="Delete Family Member" 
                                description="Are you sure you want to delete"
                                triggerLabel={ <><Trash2 /> Delete Family Member</>}
                                onConfirm={() => { 
                                  handleDeleteFamilyMember(index);
                                  toast(`${watchedFirstName || "Family member"} has been removed.`, {
                                    duration: 3000,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

            </CardContent>
          </Card>

        </Form>
      </div>

    </div>
    <BackToTopButton />
    </>
  );
};


export default HHMembers;