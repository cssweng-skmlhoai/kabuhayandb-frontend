import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TextInput from "@/components/AdminCompts/TextInput";
import SelectInput from "@/components/AdminCompts/SelectInput";
import FamilyAccordion from "@/components/AdminCompts/FamilyAccordion";
import FileUpload from "@/components/AdminCompts/FileUpload";
import ConfirmationDialog from "@/components/AdminCompts/ConfirmationDialog";
import CredentialsDialog from "@/components/AdminCompts/CredentialsDialog";
import {
  handleCredentialsDialogEffect,
  handleAddFamilyMember,
  handleFamilyMemberChange,
  confirmRemoveFamilyMember,
  handleDeleteConfirmed,
  handleSubmit,
  calculateAge
} from "@/hooks/AddMemberUtils";

const AddMember = () => {
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState({});
  const [familyData, setFamilyData] = useState({});
  const [householdData, setHouseholdData] = useState({
    Meralco: false,
    Maynilad: false,
    Septic_Tank: false,
  });
  const [familyMembers, setFamilyMembers] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDeleteId, setMemberToDeleteId] = useState(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");

  const [confirmAddDialog, setConfirmAddDialog] = useState(false);
  const [credentialsDialog, setCredentialsDialog] = useState(false);
  const [newCredentials, setNewCredentials] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    return handleCredentialsDialogEffect(credentialsDialog, setSecondsLeft, setShowCloseButton);
  }, [credentialsDialog]);

  return (
    <div>
      <div className=" hidden xl:flex justify-between items-center py-4 px-6 bg-customgray2">
        <Link
          to="/members"
          className="cursor-pointer px-3 rounded-md border border-black flex items-center gap-2"
        >
          <IoIosArrowRoundBack className="size-10" />
          <p className="font-poppins text-lg">Back</p>
        </Link>
      </div>

      <form
        className="p-5 bg-customgray1 flex flex-col gap-4 xl:grid xl:grid-cols-3 xl:p-8 xl:gap-7"
        onSubmit={(e) => { e.preventDefault(); setConfirmAddDialog(true) }}
      >
        <div className="flex flex-col gap-4 xl:col-start-1">
          <div className="flex justify-between items-center xl:hidden">
            <Link to="/members">
              <IoIosArrowRoundBack className="size-10 cursor-pointer" />
            </Link>
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <TextInput label="Last Name" value={memberData.last_name} onChange={e => setMemberData({ ...memberData, last_name: e.target.value })} required disabled={false} placeholder="Last Name" />
            <TextInput label="First Name" value={memberData.first_name} onChange={e => setMemberData({ ...memberData, first_name: e.target.value })} required disabled={false} placeholder="First Name" />
            <TextInput label="Middle Name" value={memberData.middle_name} onChange={e => setMemberData({ ...memberData, middle_name: e.target.value })} required disabled={false} placeholder="Middle Name" />
            <TextInput label="Date of Birth" type="date" value={memberData.birth_date} onChange={e => {
              const value = e.target.value;
              const age = calculateAge(value);
              setMemberData((prev) => ({
                ...prev,
                birth_date: value,
                age,
              }));
            }} disabled={false} />
            <div className="flex justify-between gap-4">
              <div className="flex flex-col w-1/2">
                <TextInput label="Age" value={memberData.age || ""} readOnly disabled placeholder="00" />
              </div>
              <div className="flex flex-col w-1/2">
                <SelectInput label="Gender" value={memberData.gender} onChange={e => setMemberData({ ...memberData, gender: e.target.value })} options={["Male", "Female", "Other"]} disabled={false} />
              </div>
            </div>
            <TextInput label="Position" value={familyData.head_position} onChange={e => setFamilyData({ ...familyData, head_position: e.target.value })} required disabled={false} placeholder="Position" />
            <TextInput label="Contact Number" type="number" value={memberData.contact_number} onChange={e => setMemberData({ ...memberData, contact_number: e.target.value })} required disabled={false} placeholder="Contact Number" />
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <TextInput label="TCT No." value={householdData.tct_no} onChange={e => setHouseholdData({ ...householdData, tct_no: e.target.value })} required disabled={false} placeholder="TCT Number" />
            <div className="flex gap-4">
              <div className="flex flex-col w-[48%]">
                <TextInput label="Block No." type="number" value={householdData.block_no} onChange={e => setHouseholdData({ ...householdData, block_no: e.target.value })} required disabled={false} placeholder="Block Number" />
              </div>
              <div className="flex flex-col w-[48%]">
                <TextInput label="Lot No." type="number" value={householdData.lot_no} onChange={e => setHouseholdData({ ...householdData, lot_no: e.target.value })} required disabled={false} placeholder="Lot Number" />
              </div>
            </div>
            <TextInput label="Share of Open Space" type="number" value={householdData.open_space_share} onChange={e => setHouseholdData({ ...householdData, open_space_share: e.target.value })} required disabled={false} placeholder="Open Space Share" />
            <TextInput label="Area" type="number" value={householdData.area} onChange={e => setHouseholdData({ ...householdData, area: e.target.value })} required disabled={false} placeholder="Area" />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:col-start-2">
          <div className="bg-white px-5 py-3 flex justify-between items-center rounded-md font-poppins">
            <p className="font-medium">Family Composition ({familyMembers.length})</p>
            <div
              className="flex items-center gap-2 bg-customgray1 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-gray-400 duration-300"
              onClick={() => handleAddFamilyMember(setFamilyMembers)}
            >
              <FaPlus />
              <p>Add</p>
            </div>
          </div>
          <FamilyAccordion
            members={familyMembers}
            onChange={(index, field, value) =>
              handleFamilyMemberChange(setFamilyMembers, familyMembers, index, field, value)
            }
            onRemove={(index, name) =>
              confirmRemoveFamilyMember(setMemberToDeleteId, setMemberToDeleteName, setDeleteDialogOpen, index, name)
            }
          />
        </div>

        <div className="flex flex-col gap-4 xl:col-start-3">
          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <FileUpload
              label="Conformity Signature"
              file={memberData.confirmity_signature}
              onChange={(e) => setMemberData({ ...memberData, confirmity_signature: e.target.files[0] })}
              disabled={false}
            />
            <TextInput label="Remarks" value={memberData.remarks || ""} onChange={e => setMemberData({ ...memberData, remarks: e.target.value })} disabled={false} placeholder="Remarks" />
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <p className="mb-3">Other Info</p>

            <SelectInput
              label="Housing Conditions/Types"
              value={householdData.condition_type}
              onChange={e => setHouseholdData({ ...householdData, condition_type: e.target.value })}
              options={[
                "Needs minor repair", "Needs major repair", "Dilapidated/Condemned",
                "Under renovation/Being repaired", "Unfinished construction", "Under construction"
              ]}
              disabled={false}
            />

            <div className="flex justify-between mb-3">
              {["Meralco", "Maynilad", "Septic_Tank"].map((key) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <label htmlFor={key}>{key.replace("_", " ")}</label>
                  <Checkbox
                    id={key}
                    className={`border bg-customgray1 size-6`}
                    checked={!!householdData[key]}
                    onCheckedChange={(checked) => setHouseholdData({ ...householdData, [key]: checked })}
                  />
                </div>
              ))}
            </div>

            <SelectInput
              label="Land Acquisition"
              value={familyData.land_acquisition}
              onChange={e => setFamilyData({ ...familyData, land_acquisition: e.target.value })}
              options={["CMP", "Direct Buying", "On Process", "Auction", "Organized Community", "Expropriation"]}
              disabled={false}
            />

            <SelectInput
              label="Status of Occupancy"
              value={familyData.status_of_occupancy}
              onChange={e => setFamilyData({ ...familyData, status_of_occupancy: e.target.value })}
              options={["Owner", "Sharer", "Renter"]}
              disabled={false}
            />
          </div>

          <div className="flex w-full justify-between gap-4 font-poppins">
            <button
              className="w-1/2 px-5 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition duration-200 xl:hidden"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </button>
            <button
              className="w-1/2 px-5 py-2 rounded-md text-white bg-blue-button hover:bg-black transition duration-200 xl:w-full"
              type="submit"
            >
              Add Member
            </button>
          </div>
        </div>
      </form>

      {/* dialog for delete confirmation on family member */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title={"Delete This Family Member?"}
        description={<>
          Are you sure you want to remove <span className="font-bold">{memberToDeleteName}</span> as a family member?
        </>}
        confirmText="Delete"
        confirmColor="bg-red-700"
        onConfirm={() => handleDeleteConfirmed(setFamilyMembers, memberToDeleteId, setDeleteDialogOpen)}
        confirmHover="hover:bg-red-900"
      />

      {/* dialog for cofirmation of creating a member */}
      <ConfirmationDialog
        open={confirmAddDialog}
        setOpen={setConfirmAddDialog}
        title={"Add Member?"}
        description={"Proceed to add this member? Please double-check the details before proceeding."}
        confirmText="Proceed"
        onConfirm={(e) =>
          handleSubmit({
            e,
            memberData,
            familyData,
            householdData,
            familyMembers,
            setCredentialsDialog,
            setNewCredentials,
          })
        }
      />

      {/* dialog for new credentials */}
      <CredentialsDialog
        open={credentialsDialog}
        setOpen={setCredentialsDialog}
        credentials={newCredentials}
        onClose={() => {
          setCredentialsDialog(false);
          setNewCredentials({});
          navigate("/members");
          toast.success("Member Successfully Added");
        }}
        showCloseButton={showCloseButton}
        secondsLeft={secondsLeft}
      />
    </div>
  );
};

export default AddMember;
