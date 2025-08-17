import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaRegTrashAlt } from "react-icons/fa";
import TextInput from "./TextInput";
import SelectInput from './SelectInput';

const FamilyAccordion = ({ members = [], isEdit = true, onChange, onRemove }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <Accordion type="multiple">
      <div className="flex flex-col gap-4">
        {members.map((member, index) => {
          const key = member.id ?? member.tempId ?? index;
          const handle = (field, value) => onChange(key, field, value);

          return (
            <AccordionItem key={key} value={`member-${key}`}>
              <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer">
                Family Member {index + 1}
              </AccordionTrigger>
              <AccordionContent className="bg-white px-5 pb-5 font-poppins rounded-b-sm flex flex-col gap-2">
                <TextInput label="Last Name" value={member.last_name} onChange={e => handle("last_name", e.target.value)} disabled={!isEdit} placeholder="Last Name" />
                <TextInput label="First Name" value={member.first_name} onChange={e => handle("first_name", e.target.value)} disabled={!isEdit} placeholder="First Name" />
                <TextInput label="Middle Name" value={member.middle_name} onChange={e => handle("middle_name", e.target.value)} disabled={!isEdit} placeholder="Middle Name" />
                <TextInput label="Relation to Member" value={member.relation_to_member} onChange={e => handle("relation_to_member", e.target.value)} disabled={!isEdit} placeholder="Relation to Member" />
                <TextInput label="Date of Birth" value={formatDate(member.birth_date)} onChange={e => handle("birth_date", e.target.value)} disabled={!isEdit} type="date" />
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col w-1/2">
                    <TextInput label="Age" value={member.age} readOnly disabled placeholder="00" />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <SelectInput label="Gender" value={member.gender} onChange={e => handle("gender", e.target.value)} options={["Male", "Female", "Other"]} disabled={!isEdit} placeholderTop="29px" />
                  </div>
                </div>
                <TextInput label="Educational Attainment" value={member.educational_attainment} onChange={e => handle("educational_attainment", e.target.value)} disabled={!isEdit} placeholder="Educational Attainment" />

                {isEdit && (
                  <button
                    type="button"
                    onClick={() => onRemove(key, `${member.first_name} ${member.last_name}`)}
                    className="w-1/4 self-center bg-red-700 text-white py-2 rounded-md hover:bg-red-900 duration-200 xl:w-2/5"
                  >
                    <FaRegTrashAlt className="inline mr-2" />
                    Delete
                  </button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </div>
    </Accordion>
  )
}

export default FamilyAccordion