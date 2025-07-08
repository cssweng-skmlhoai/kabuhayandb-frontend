import React, { useEffect, useState } from 'react';
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
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MemberForms = ({ view }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allDetails, setAllDetails] = useState({});

  const [householdData, setHouseholdData] = useState({});
  const [memberData, setMemberData] = useState({});
  const [familyData, setFamilyData] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  const handleAddFamilyMember = () => {
    setFamilyMembers(prev => [...prev, {
      tempId: Date.now(), last_name: '', first_name: '', middle_name: '',
      birth_date: '', gender: '',
      relation_to_family: '', educational_attainment: ''
    }]);
  };

  const handleRemoveFamilyMember = (key) => {
    setFamilyMembers(prev =>
      prev.flatMap(member => {
        const memberKey = member.id ?? member.tempId;
        if (memberKey === key) {
          return member.id ? [{ ...member, update: false }] : []; // soft delete if has ID
        }
        return [member];
      })
    );
  };

  const handleFamilyMemberChange = (key, field, value) => {
    setFamilyMembers(prev =>
      prev.map(member => {
        const memberKey = member.id ?? member.tempId;
        if (memberKey === key) {
          return { ...member, [field]: value };
        }
        return member;
      })
    );
  };

  useEffect(() => {
    axios.get(`${API_URL}/members/info/${id}`, {
      headers: {
        'Authorization': `Bearer ${API_SECRET}`
      }
    }).then(res => {
      const data = res.data;
      setAllDetails(data);

      setMemberData({
        last_name: data.last_name,
        first_name: data.first_name,
        middle_name: data.middle_name,
        birth_date: data.birth_date,
        gender: data.gender,
        contact_number: data.contact_number,
        confirmity_signature: data.confirmity_signature,
        remarks: data.remarks,
      });

      setFamilyData({
        head_position: data.position,
        land_acquisition: data.land_acquisition,
        status_of_occupancy: data.status_of_occupancy,
      });

      setHouseholdData({
        tct_no: data.tct_no,
        block_no: data.block_no,
        lot_no: data.lot_no,
        open_space_share: data.open_space_share,
        condition_type: data.condition_type,
        Meralco: data.Meralco,
        Maynilad: data.Maynilad,
        Septic_Tank: data.Septic_Tank,
      });

      const transformedFamilyMembers = (data.family_members || []).map(fm => {
        const { relation, ...rest } = fm;
        return {
          ...rest,
          relation_to_member: relation,
          update: true
        };
      });
      setFamilyMembers(transformedFamilyMembers);

    }).catch(err => {
      console.log(err)
    });
  }, [id]);

  // function to update member details
  const handleUpdates = () => {
    const cleanedFamilyMembers = familyMembers.map(({ age, tempId, ...rest }) => rest);

    const payload = {
      members: memberData,
      families: familyData,
      households: householdData,
      family_members: cleanedFamilyMembers
    };
    console.log(payload);

    axios.put(`${API_URL}/members/info/${id}`, payload, {
      headers: {
        'Authorization': `Bearer ${API_SECRET}`
      }
    }).then(() => {
      navigate('/members');
    }).catch(err => console.log(err))
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  };

  const isEdit = view === 'edit';
  const filteredMembers = familyMembers.filter(m => m.update !== false);

  return (
    <div>
      <div className=' hidden xl:flex justify-between items-center py-4 px-6 bg-customgray2'>
        <Link to="/members" className='cursor-pointer px-3 rounded-md border border-black flex items-center gap-2'>
          <IoIosArrowRoundBack className='size-10' />
          <p className='font-poppins text-lg'>Back</p>
        </Link>
        <Link to={`/members/${id}${isEdit ? '' : '/edit'}`}>
          <Button className="bg-blue-button cursor-pointer">
            {isEdit ? "Cancel" : "Edit Details"}
          </Button>
        </Link>
      </div>

      <div className='p-5 bg-customgray1 flex flex-col gap-4 xl:grid xl:grid-cols-3 xl:p-8 xl:gap-7'>
        <div className='flex flex-col gap-4 xl:col-start-1'>
          <div className='flex justify-between items-center xl:hidden'>
            <Link to="/members">
              <IoIosArrowRoundBack className='size-10 cursor-pointer' />
            </Link>
            <Link to={`/members/${id}${isEdit ? '' : '/edit'}`}>
              <Button className="bg-blue-button cursor-pointer">
                {isEdit ? "Cancel" : "Edit Details"}
              </Button>
            </Link>
          </div>

          <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
            <label htmlFor="lastname">Last Name</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Last Name" type="text" name="" id="" disabled={!isEdit} value={memberData?.last_name || ""}
              onChange={e => setMemberData({ ...memberData, last_name: e.target.value })} />

            <label htmlFor="firstname">First Name</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="First Name" type="text" name="" id="" disabled={!isEdit} value={memberData?.first_name || ""}
              onChange={e => setMemberData({ ...memberData, first_name: e.target.value })} />

            <label htmlFor="middlename">Middle Name</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Middle Name" type="text" name="" id="" disabled={!isEdit} value={memberData?.middle_name || ""}
              onChange={e => setMemberData({ ...memberData, middle_name: e.target.value })} />

            <label htmlFor="birthdate">Date of Birth</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" type="date" name="" id="" disabled={!isEdit} value={formatDate(memberData?.birth_date) || ""}
              onChange={e => setMemberData({ ...memberData, birth_date: e.target.value })} />

            <div className='flex justify-between gap-4'>
              <div className='flex flex-col w-1/2'>
                <label htmlFor="age">Age</label>
                <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="00" type="number" name="" id="" disabled={!isEdit} value={allDetails?.age || ""} readOnly />
              </div>

              <div className='flex flex-col w-1/2'>
                <label htmlFor="gender">Gender</label>
                <Select value={memberData?.gender || ""} onValueChange={(value) => setMemberData({ ...memberData, gender: value })}>
                  <SelectTrigger id='gender' className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                    <SelectValue placeholder="Male/Female" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label htmlFor="position">Position</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Position" type="text" name="" id="" disabled={!isEdit} value={familyData?.head_position || ""} onChange={e => setFamilyData({ ...familyData, head_position: e.target.value })} />

            <label htmlFor="contact">Contact Number</label>
            <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Contact Number" type="number" name="" id="" disabled={!isEdit} value={memberData?.contact_number || ""}
              onChange={e => setMemberData({ ...memberData, contact_number: e.target.value })} />

          </div>

          <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
            <label htmlFor="tct">TCT No.</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="TCT Number" type="text" name="" id="" disabled={!isEdit} value={householdData?.tct_no || ""} onChange={e => setHouseholdData({ ...householdData, tct_no: e.target.value })} />

            <div className='flex justify-between gap-4'>
              <div className='flex flex-col w-1/2'>
                <label htmlFor="block">Block No.</label>
                <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Block Number" type="number" name="" id="" disabled={!isEdit} value={householdData?.block_no || ""} onChange={e => setHouseholdData({ ...householdData, block_no: e.target.value })} />
              </div>

              <div className='flex flex-col w-1/2'>
                <label htmlFor="lot">Lot No.</label>
                <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Lot Number" type="number" name="" id="" disabled={!isEdit} value={householdData?.lot_no || ""} onChange={e => setHouseholdData({ ...householdData, lot_no: e.target.value })} />
              </div>
            </div>

            <label htmlFor="openspace">Share of Open Space</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Open Space Share" type="number" name="" id="" disabled={!isEdit} value={householdData?.open_space_share || ""} onChange={e => setHouseholdData({ ...householdData, open_space_share: e.target.value })} />

            <label htmlFor="total">Total</label>
            <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Total" type="number" name="" id="" disabled={!isEdit} value={allDetails?.total || ""} readOnly />
          </div>
        </div>

        <div className='flex flex-col gap-4 xl:col-start-2'>
          <div className='bg-white px-5 py-3 flex justify-between rounded-md font-poppins'>
            <p className='font-medium'>Family Composition ({filteredMembers.length})</p>
            {isEdit && (
              <div className='flex items-center gap-2 bg-customgray1 px-2 rounded-sm cursor-pointer hover:bg-gray-400 duration-300' onClick={handleAddFamilyMember} variant='outline'>
                <FaPlus />
                <p>Add</p>
              </div>
            )}
          </div>

          <Accordion type="single" collapsible>
            <div className='flex flex-col gap-4'>
              {filteredMembers?.map((member, index) => {
                const key = member.id ?? member.tempId;
                return (
                  <AccordionItem key={key} value={`member-${key}`}>
                    <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer">Family Member {index + 1}</AccordionTrigger>
                    <AccordionContent className="flex flex-col bg-white px-5 pb-5 font-poppins rounded-b-sm">
                      <label htmlFor="famlastname">Last Name</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Last Name" type="text" name="" id="" disabled={!isEdit} value={member?.last_name || ""} onChange={e => handleFamilyMemberChange(key, 'last_name', e.target.value)} />

                      <label htmlFor="famfirstname">First Name</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="First Name" type="text" name="" id="" disabled={!isEdit} value={member?.first_name || ""} onChange={e => handleFamilyMemberChange(key, 'first_name', e.target.value)} />

                      <label htmlFor="fammiddlename">Middle Name</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Middle Name" type="text" name="" id="" disabled={!isEdit} value={member?.middle_name || ""} onChange={e => handleFamilyMemberChange(key, 'middle_name', e.target.value)} />

                      <label htmlFor="relation">Relation to Member</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Relation to Member" type="text" name="" id="" disabled={!isEdit} value={member?.relation_to_member || ""} onChange={e => handleFamilyMemberChange(key, 'relation_to_member', e.target.value)} />

                      <label htmlFor="fambirthdate">Date of Birth</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Birth Date" type="date" name="" id="" disabled={!isEdit} value={formatDate(member?.birth_date) || ""} onChange={e => handleFamilyMemberChange(key, 'birth_date', e.target.value)} />

                      <div className='flex w-full justify-between gap-4'>
                        <div className='flex flex-col w-1/2'>
                          <label htmlFor="famage">Age</label>
                          <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="00" type="number" name="" id="" disabled={!isEdit} value={member?.age || ""} readOnly />
                        </div>

                        <div className='flex flex-col w-1/2'>
                          <label htmlFor="famgender">Gender</label>
                          <Select value={member?.gender || ""} onValueChange={(value) => handleFamilyMemberChange(key, 'gender', value)}>
                            <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`} >
                              <SelectValue placeholder="Options" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <label htmlFor="education">Educational Attainment</label>
                      <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3" placeholder="Educational Attainment" type="text" name="" id="" disabled={!isEdit} value={member?.educational_attainment || ""} onChange={e => handleFamilyMemberChange(key, 'educational_attainment', e.target.value)} />

                      {isEdit && (
                        <Button className="w-1/5 self-center bg-blue-button xl:w-2/5" onClick={() => handleRemoveFamilyMember(key)} variant='destructive'><FaRegTrashAlt />Delete</Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </div>
          </Accordion>
        </div>

        <div className='flex flex-col gap-4 xl:col-start-3'>
          <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
            <label htmlFor="signature">Conformity/Signature</label>
            <input className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="-----" type="text" name="" id="" disabled={!isEdit} value={""}
              onChange={e => setMemberData({ ...memberData, confirmity_signature: e.target.value })} />

            <label htmlFor="remarks">Remarks</label>
            <input className="bg-customgray2 py-1 px-2 text-sm rounded-sm" placeholder="Remarks" type="text" name="" id="" disabled={!isEdit} value={memberData?.remarks || ""}
              onChange={e => setMemberData({ ...memberData, remarks: e.target.value })} />
          </div>

          <div className='bg-white p-5 flex flex-col rounded-md font-poppins font-normal'>
            <p className='mb-3'>Other Info</p>

            <label htmlFor="housing">Housing Conditions/Types</label>
            <Select value={householdData?.condition_type || ""} onValueChange={(value) => setHouseholdData({ ...householdData, condition_type: value })}>
              <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm mb-3 ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                <SelectValue placeholder="Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Needs minor repair">Needs minor repair</SelectItem>
                <SelectItem value="Needs major repair">Needs major repair</SelectItem>
                <SelectItem value="Dilapidated/Condemned">Dilapidated/Condemned</SelectItem>
                <SelectItem value="Under renovation/Being repaired">Under renovation/Being repaired</SelectItem>
                <SelectItem value="Unfinished construction">Unfinished construction</SelectItem>
                <SelectItem value="Under construction">Under construction</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex justify-between'>
              <div className='flex flex-col items-center mb-3 gap-1'>
                <label htmlFor="meralco">Meralco</label>
                <Checkbox id="meralco" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} checked={!!householdData?.Meralco || false} onCheckedChange={(checked) => setHouseholdData({ ...householdData, Meralco: checked })} />
              </div>

              <div className='flex flex-col items-center mb-3 gap-1'>
                <label htmlFor="maynilad">Maynilad</label>
                <Checkbox id="maynilad" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} checked={!!householdData?.Maynilad || false} onCheckedChange={(checked) => setHouseholdData({ ...householdData, Maynilad: checked })} />
              </div>

              <div className='flex flex-col items-center mb-3 gap-1'>
                <label htmlFor="septic">Septic Tank</label>
                <Checkbox id="septic" className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`} checked={!!householdData?.Septic_Tank || false} onCheckedChange={(checked) => setHouseholdData({ ...householdData, Septic_Tank: checked })} />
              </div>
            </div>

            <label htmlFor="acquisition">Land Acquisition</label>
            <Select value={familyData?.land_acquisition || ""} onValueChange={(value) => setFamilyData({ ...familyData, land_acquisition: value })}>
              <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm mb-3 ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                <SelectValue placeholder="Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CMP">CMP</SelectItem>
                <SelectItem value="Direct Buying">Direct Buying</SelectItem>
                <SelectItem value="On Process">On Process</SelectItem>
                <SelectItem value="Auction">Auction</SelectItem>
                <SelectItem value="Organized Community">Organized Community</SelectItem>
                <SelectItem value="Expropriation">Expropriation</SelectItem>
              </SelectContent>
            </Select>

            <label htmlFor="occupancy">Status of Occupancy</label>
            <Select value={familyData?.status_of_occupancy || ""} onValueChange={(value) => setFamilyData({ ...familyData, status_of_occupancy: value })}>
              <SelectTrigger className={`bg-customgray2 w-full !py-1 !h-auto rounded-sm ${view === "view" ? "pointer-events-none cursor-default text-black opacity-100" : ""}`}>
                <SelectValue placeholder="Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Sharer">Sharer</SelectItem>
                <SelectItem value="Renter">Renter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex w-full justify-between gap-4 font-poppins'>
            <button className="w-1/2 px-5 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition duration-200 xl:hidden" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to Top</button>
            {isEdit && (
              <button className="w-1/2 px-5 py-2 rounded-md text-white bg-blue-button hover:bg-black transition duration-200 xl:w-full" onClick={handleUpdates}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemberForms