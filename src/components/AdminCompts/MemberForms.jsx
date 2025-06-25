import React from 'react';
import { Button } from '@/components/ui/button';
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MemberForms = ({ view, setView }) => {
  return (
    <div>
      <div className='p-5 bg-customgray1 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <IoIosArrowRoundBack className='size-10 cursor-pointer' onClick={() => setView("list")} />
          {view !== "add" && (
            <Button className="bg-blue-button cursor-pointer" onClick={() => setView(view === "view" ? "edit" : "view")}>
              {view === "view" ? "Edit Details" : "Cancel"}
            </Button>
          )}
        </div>

        {/* all inputs are not supposed to be editable on view details but become editable on edit details */}
        <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
          <label htmlFor="lastname">Last Name</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Last Name" type="text" name="" id="" disabled={view === "view"} />

          <label htmlFor="firstname">First Name</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="First Name" type="text" name="" id="" disabled={view === "view"} />

          <label htmlFor="middlename">Middle Name</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Middle Name" type="text" name="" id="" disabled={view === "view"} />

          <label htmlFor="birthdate">Date of Birth</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" type="date" name="" id="" disabled={view === "view"} />

          <div className='flex justify-between gap-4'>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="age">Age</label>
              <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="00" type="number" name="" id="" disabled={view === "view"} />
            </div>

            <div className='flex flex-col w-1/2'>
              <label htmlFor="gender">Gender</label>
              <Select>
                <SelectTrigger id='gender' className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                  <SelectValue placeholder="Male/Female" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <label htmlFor="position">Position</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Position" type="text" name="" id="" disabled={view === "view"} />

          <label htmlFor="contact">Contact Number</label>
          <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />

        </div>

        <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
          <label htmlFor="tct">TCT No.</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />

          <div className='flex justify-between gap-4'>
            <div className='flex flex-col w-1/2'>
              <label htmlFor="block">Block No.</label>
              <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />
            </div>

            <div className='flex flex-col w-1/2'>
              <label htmlFor="lot">Lot No.</label>
              <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />
            </div>
          </div>

          <label htmlFor="openspace">Share of Open Space</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />

          <label htmlFor="total">Total</label>
          <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={view === "view"} />
        </div>

        <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
          <label htmlFor="signature">Conformity/Signature</label>
          <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="-----" type="text" name="" id="" disabled={view === "view"} />

          <label htmlFor="remarks">Remarks</label>
          <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />
        </div>

        <div className='bg-white px-5 py-3 flex justify-between rounded-md font-poppins'>
          <p className='font-medium'>Family Composition (n)</p>
          {(view === "edit" || view === "add") && (
            <div className='flex items-center gap-2 bg-customgray1 px-2 rounded-sm cursor-pointer'>
              <FaPlus />
              <p>Add</p>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="member1">
            <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer">Family Member 1</AccordionTrigger>
            <AccordionContent className="flex flex-col bg-white px-5 pb-5 font-poppins rounded-b-sm">
              <label htmlFor="famlastname">Last Name</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />

              <label htmlFor="famfirstname">First Name</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />

              <label htmlFor="fammiddlename">Middle Name</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />

              <label htmlFor="relation">Relation to Member</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />

              <label htmlFor="fambirthdate">Date of Birth</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="date" name="" id="" disabled={view === "view"} />

              <div className='flex w-full justify-between gap-4'>
                <div className='flex flex-col w-1/2'>
                  <label htmlFor="famage">Age</label>
                  <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="number" name="" id="" disabled={view === "view"} />
                </div>

                <div className='flex flex-col w-1/2'>
                  <label htmlFor="famgender">Gender</label>
                  <Select>
                    <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                      <SelectValue placeholder="Options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <label htmlFor="education">Educational Attainment</label>
              <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Remarks" type="text" name="" id="" disabled={view === "view"} />

              {(view === "edit" || view === "add") && (
                <Button className="w-1/5 self-center"><FaRegTrashAlt />Delete</Button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
          <p className='mb-3'>Other Info</p>

          <label htmlFor="housing">Housing Conditions/Types</label>
          <Select>
            <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm mb-3 ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
              <SelectValue placeholder="Options" />
            </SelectTrigger>
            <SelectContent>

            </SelectContent>
          </Select>

          <div className='flex justify-between'>
            <div className='flex flex-col items-center mb-3 gap-1'>
              <label htmlFor="meralco">Meralco</label>
              <Checkbox id="meralco" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} />
            </div>

            <div className='flex flex-col items-center mb-3 gap-1'>
              <label htmlFor="maynilad">Maynilad</label>
              <Checkbox id="maynilad" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} />
            </div>

            <div className='flex flex-col items-center mb-3 gap-1'>
              <label htmlFor="septic">Septic Tank</label>
              <Checkbox id="septic" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} />
            </div>
          </div>

          <label htmlFor="acquisition">Land Acquisition</label>
          <Select>
            <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm mb-3 ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
              <SelectValue placeholder="Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cmp">CMP</SelectItem>
              <SelectItem value="direct">Direct Buying</SelectItem>
              <SelectItem value="process">On Process</SelectItem>
              <SelectItem value="auction">Auction</SelectItem>
              <SelectItem value="organized">Organized Community</SelectItem>
              <SelectItem value="expropriation">Expropriation</SelectItem>
            </SelectContent>
          </Select>

          <label htmlFor="occupancy">Status of Occupancy</label>
          <Select>
            <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
              <SelectValue placeholder="Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="sharer">Sharer</SelectItem>
              <SelectItem value="renter">Renter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex w-full justify-between gap-4 font-poppins'>
          <Button className="w-1/2 bg-white text-black hover:bg-gray-200" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</Button>
          {(view === "edit" || view === "add") && (
            <Button className="w-1/2 bg-blue-button">
              {view === "edit" ? "Save Changes" : "Add Member"}
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}

export default MemberForms