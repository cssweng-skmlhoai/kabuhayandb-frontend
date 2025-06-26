import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
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
import "./Members.css";

const HHMembers = () => {
  const form = useForm({
    defaultValues: {
      id: "",
      last_name: "Doe",
      first_name: "John",
      middle_name: "M",
      birth_date: "1990-01-01",
      age: "34",
      gender: "Male",
      position: "Officer",
      contact_number: "09123456789",
      family: [
        {
          id: "",
          last_name: "Doe",
          first_name: "Kahn",
          middle_name: "M",
          relation_to_family: "Spouse",
          birth_date: "1991-01-01",
          age: "33",
          gender: "Female",
          education: "Graduate",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "family",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openAccordions, setOpenAccordions] = useState([]);

  return (
    <div className="main">
      <div className="btn-div">
        {isEditing ? (
          <>
            <Button variant="cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <ConfirmDialog
              title="Save Changes"
              description="Are you sure you want to save these changes?"
              triggerLabel="Save Details"
              onConfirm={() => setIsEditing(false)}
              variant="edit_details"
            />
          </>
        ) : (
          <Button variant="edit_details" onClick={() => setIsEditing(true)}>
            Edit Details
          </Button>
        )}
      </div>

      <div className="info">
        <Form {...form}>
          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 grid gap-4 sm:grid-cols-2">
                {[
                  { name: "last_name", label: "Last Name" },
                  { name: "first_name", label: "First Name" },
                  { name: "middle_name", label: "Middle Name" },
                ].map(({ name, label }) => (
                  <ClearableInputField
                    key={name}
                    control={form.control}
                    name={name}
                    label={label}
                    isEditing={isEditing}
                  />
                ))}

                <DatePickerField
                  control={form.control}
                  name="birth_date"
                  label="Date of Birth"
                  isEditing={isEditing}
                />

                <div className="inline-fields">
                  <ClearableInputField
                    control={form.control}
                    name="age"
                    label="Age"
                    isEditing={isEditing}
                    className="w-1/2"
                    inputType="number"
                  />
                  <ClearableSelectField
                    control={form.control}
                    name="gender"
                    label="Gender"
                    isEditing={isEditing}
                    className="w-1/2"
                    options={["Male", "Female", "Prefer not to say"]}
                  />
                </div>

                {[
                  { name: "position", label: "Position" },
                  { name: "contact_number", label: "Contact Number" },
                ].map(({ name, label }) => (
                  <ClearableInputField
                    key={name}
                    control={form.control}
                    name={name}
                    label={label}
                    isEditing={isEditing}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content">
              <div className="accordion">
                <p className="text-lg font-semibold">
                  Family Composition ({fields.length})
                </p>
                {isEditing && (
                  <Button
                    variant="add"
                    onClick={() => {
                      append({
                        last_name: "",
                        first_name: "",
                        middle_name: "",
                        relation_to_family: "",
                        birth_date: "",
                        age: "",
                        gender: "",
                        education: "",
                      });
                      setOpenAccordions((prev) => [
                        ...prev,
                        `member-${fields.length}`,
                      ]);
                    }}
                  >
                    <Plus />
                    Add
                  </Button>
                )}
              </div>

              <Accordion
                type="multiple"
                value={openAccordions}
                onValueChange={setOpenAccordions}
                className="space-y-4"
              >
                {fields.map((member, index) => (
                  <AccordionItem key={member.id} value={`member-${index}`}>
                    <AccordionTrigger>
                      {form.watch(`family.${index}.firstName`) ||
                        `Family Member ${index + 1}`}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-4 grid gap-4 sm:grid-cols-2">
                        {[
                          { name: "last_name", label: "Last Name" },
                          { name: "first_name", label: "First Name" },
                          { name: "middle_name", label: "Middle Name" },
                          {
                            name: "relation_to_family",
                            label: "Relation to Member",
                          },
                        ].map(({ name, label }) => (
                          <ClearableInputField
                            key={name}
                            control={form.control}
                            name={`family.${index}.${name}`}
                            label={label}
                            isEditing={isEditing}
                          />
                        ))}

                        <DatePickerField
                          control={form.control}
                          name="birth_date"
                          label="Date of Birth"
                          isEditing={isEditing}
                        />
                        <div className="flex gap-4">
                          <ClearableInputField
                            control={form.control}
                            name={`family.${index}.age`}
                            label="Age"
                            isEditing={isEditing}
                            className="w-1/2"
                          />
                          <ClearableSelectField
                            control={form.control}
                            name={`family.${index}.gender`}
                            label="Gender"
                            isEditing={isEditing}
                            className="w-1/2"
                            options={["Male", "Female", "Other"]}
                          />
                        </div>

                        <div>
                          <ClearableInputField
                            control={form.control}
                            name={`family.${index}.education`}
                            label="Education"
                            isEditing={isEditing}
                          />
                        </div>

                        {isEditing && (
                          <div className="delete">
                            <ConfirmDialog
                              title="Delete Family Member"
                              description="Are you sure you want to delete"
                              triggerLabel={
                                <>
                                  <Trash2 />
                                  Delete Family Member
                                </>
                              }
                              onConfirm={() => {
                                remove(index);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default HHMembers;