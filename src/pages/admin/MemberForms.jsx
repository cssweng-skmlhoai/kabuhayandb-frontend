import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';

const MemberForms = ({ view }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allDetails, setAllDetails] = useState({});

  const [householdData, setHouseholdData] = useState({});
  const [memberData, setMemberData] = useState({});
  const [familyData, setFamilyData] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);

  const [confirmEditDialog, setConfirmEditDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDeleteId, setMemberToDeleteId] = useState(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  const handleAddFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        last_name: "",
        first_name: "",
        middle_name: "",
        birth_date: "",
        gender: "",
        relation_to_family: "",
        educational_attainment: "",
      },
    ]);
  };

  const handleRemoveFamilyMember = (key) => {
    setFamilyMembers((prev) =>
      prev.flatMap((member) => {
        const memberKey = member.id ?? member.tempId;
        if (memberKey === key) {
          return member.id ? [{ ...member, update: false }] : [];
        }
        return [member];
      })
    );
  };

  const handleFamilyMemberChange = (key, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((member) => {
        const memberKey = member.id ?? member.tempId;
        if (memberKey === key) {
          return { ...member, [field]: value };
        }
        return member;
      })
    );
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/members/info/${id}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        const data = res.data;
        setAllDetails(data);

        const signatureImage = bufferToBase64Image(data.confirmity_signature?.data);

        setMemberData({
          last_name: data.last_name,
          first_name: data.first_name,
          middle_name: data.middle_name,
          birth_date: data.birth_date,
          gender: data.gender,
          contact_number: data.contact_number,
          confirmity_signature: signatureImage,
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
          area: data.area,
        });

        const transformedFamilyMembers = (data.family_members || []).map(
          (fm) => {
            const { relation, ...rest } = fm;
            return {
              ...rest,
              relation_to_member: relation,
              update: true,
            };
          }
        );
        setFamilyMembers(transformedFamilyMembers);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something went wrong");
      });
  }, [id, API_SECRET]);

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

  useEffect(() => {
    const area = parseFloat(householdData.area) || 0;
    const openSpace = parseFloat(householdData.open_space_share) || 0;
    const total = parseFloat((area + openSpace).toFixed(2));

    setAllDetails((prev) => ({
      ...prev,
      total: total,
    }));
  }, [householdData.area, householdData.open_space_share]);

  // function to update member details
  const handleUpdates = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      let confirmityFile = memberData.confirmity_signature;

      if (confirmityFile) {
        const isBase64 = typeof confirmityFile === "string";

        if (isBase64) {
          confirmityFile = base64ToFile(confirmityFile, "signature");
        } else if (confirmityFile instanceof File) {
          const validTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!validTypes.includes(confirmityFile.type)) {
            toast.error("Only JPG, JPEG, or PNG files are allowed.");
            return;
          }

          if (confirmityFile.size > 10 * 1024 * 1024) {
            toast.error("Signature image must be under 10MB.");
            return;
          }

          confirmityFile = await compressImage(confirmityFile);
        }

        formData.append("confirmity_signature", confirmityFile);
      }

      const cleanedMemberData = {
        ...memberData,
        confirmity_signature: confirmityFile,
      };

      const cleanedFamilyMembers = familyMembers.map(
        ({ age: _age, tempId: _tempId, ...rest }) => rest
      );

      formData.append("members", JSON.stringify(cleanedMemberData));
      formData.append("families", JSON.stringify(familyData));
      formData.append("households", JSON.stringify(householdData));
      formData.append("family_members", JSON.stringify(cleanedFamilyMembers));

      await axios.put(`${API_URL}/members/info/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/members");
      toast.success("Member Successfully Updated");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      toast.error(`Compression failed: ${error.message || error}`);
      return file;
    }
  };

  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  const isEdit = view === "edit";
  const filteredMembers = familyMembers.filter((m) => m.update !== false);

  const confirmRemoveFamilyMember = (key, fullName) => {
    setMemberToDeleteId(key);
    setMemberToDeleteName(fullName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    handleRemoveFamilyMember(memberToDeleteId);
    setDeleteDialogOpen(false);
  };

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
        <Link to={`/members/${id}${isEdit ? "" : "/edit"}`}>
          <Button className="bg-blue-button cursor-pointer">
            {isEdit ? "Cancel" : "Edit Details"}
          </Button>
        </Link>
      </div>

      <form
        className="p-5 bg-customgray1 flex flex-col gap-4 xl:grid xl:grid-cols-3 xl:p-8 xl:gap-7"
        onSubmit={(e) => { e.preventDefault(); setConfirmEditDialog(true) }}
      >
        <div className="flex flex-col gap-4 xl:col-start-1">
          <div className="flex justify-between items-center xl:hidden">
            <Link to="/members">
              <IoIosArrowRoundBack className="size-10 cursor-pointer" />
            </Link>
            <Link to={`/members/${id}${isEdit ? "" : "/edit"}`}>
              <Button className="bg-blue-button cursor-pointer">
                {isEdit ? "Cancel" : "Edit Details"}
              </Button>
            </Link>
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="lastname">Last Name</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Last Name"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={memberData?.last_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, last_name: e.target.value })
              }
            />

            <label htmlFor="firstname">First Name</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="First Name"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={memberData?.first_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, first_name: e.target.value })
              }
            />

            <label htmlFor="middlename">Middle Name</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Middle Name"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={memberData?.middle_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, middle_name: e.target.value })
              }
            />

            <label htmlFor="birthdate">Date of Birth</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              type="date"
              name=""
              id=""
              disabled={!isEdit}
              value={formatDate(memberData?.birth_date) || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, birth_date: e.target.value })
              }
            />

            <div className="flex justify-between gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="age">Age</label>
                <input
                  className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
                  placeholder="00"
                  type="number"
                  name=""
                  id=""
                  value={allDetails?.age || ""}
                  readOnly
                />
              </div>

              <div className="flex flex-col w-1/2 relative">
                <label htmlFor="gender">Gender</label>
                <select
                  name=""
                  id=""
                  required
                  disabled={!isEdit}
                  value={memberData?.gender || ""}
                  onChange={(e) =>
                    setMemberData({ ...memberData, gender: e.target.value })
                  }
                  className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
                >
                  <option value="" disabled hidden></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {!memberData.gender && (
                  <span className="absolute left-3 top-[32px] text-sm opacity-50 pointer-events-none z-0">
                    Male/Female
                  </span>
                )}
              </div>
            </div>

            <label htmlFor="position">Position</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Position"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={familyData?.head_position || ""}
              onChange={(e) =>
                setFamilyData({ ...familyData, head_position: e.target.value })
              }
            />

            <label htmlFor="contact">Contact Number</label>
            <input
              className={`bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Contact Number"
              type="number"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={memberData?.contact_number || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, contact_number: e.target.value })
              }
            />
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="tct">TCT No.</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="TCT Number"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={householdData?.tct_no || ""}
              onChange={(e) =>
                setHouseholdData({ ...householdData, tct_no: e.target.value })
              }
            />

            <div className="flex justify-between gap-4">
              <div className="flex flex-col w-[48%]">
                <label htmlFor="block">Block No.</label>
                <input
                  className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
                  placeholder="Block Number"
                  type="number"
                  name=""
                  id=""
                  disabled={!isEdit}
                  required
                  value={householdData?.block_no || ""}
                  onChange={(e) =>
                    setHouseholdData({
                      ...householdData,
                      block_no: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-[48%]">
                <label htmlFor="lot">Lot No.</label>
                <input
                  className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
                  placeholder="Lot Number"
                  type="number"
                  name=""
                  id=""
                  disabled={!isEdit}
                  required
                  value={householdData?.lot_no || ""}
                  onChange={(e) =>
                    setHouseholdData({
                      ...householdData,
                      lot_no: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <label htmlFor="openspace">Share of Open Space</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Open Space Share"
              type="number"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={householdData?.open_space_share || ""}
              onChange={(e) =>
                setHouseholdData({
                  ...householdData,
                  open_space_share: e.target.value,
                })
              }
            />

            <label htmlFor="openspace">Area</label>
            <input
              className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Area"
              type="number"
              name=""
              id=""
              disabled={!isEdit}
              required
              value={householdData?.area || ""}
              onChange={(e) =>
                setHouseholdData({ ...householdData, area: e.target.value })
              }
            />

            <label htmlFor="total">Total</label>
            <input
              className={`bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Total"
              type="number"
              name=""
              id=""
              value={allDetails?.total || ""}
              readOnly
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:col-start-2">
          <div className="bg-white px-5 py-3 flex justify-between items-center rounded-md font-poppins">
            <p className="font-medium">
              Family Composition ({filteredMembers.length})
            </p>
            {isEdit && (
              <div
                className="flex items-center gap-2 bg-customgray1 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-gray-400 duration-300"
                onClick={handleAddFamilyMember}
                variant="outline"
              >
                <FaPlus />
                <p>Add</p>
              </div>
            )}
          </div>

          <Accordion type="multiple">
            <div className="flex flex-col gap-4">
              {filteredMembers?.map((member, index) => {
                const key = member.id ?? member.tempId;
                return (
                  <AccordionItem key={key} value={`member-${key}`}>
                    <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer">
                      Family Member {index + 1}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col bg-white px-5 pb-5 font-poppins rounded-b-sm">
                      <label htmlFor="famlastname">Last Name</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="Last Name"
                        type="text"
                        name=""
                        id=""
                        disabled={!isEdit}
                        required
                        value={member?.last_name || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "last_name",
                            e.target.value
                          )
                        }
                      />

                      <label htmlFor="famfirstname">First Name</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="First Name"
                        type="text"
                        name=""
                        id=""
                        disabled={!isEdit}
                        required
                        value={member?.first_name || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "first_name",
                            e.target.value
                          )
                        }
                      />

                      <label htmlFor="fammiddlename">Middle Name</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="Middle Name"
                        type="text"
                        name=""
                        id=""
                        disabled={!isEdit}
                        required
                        value={member?.middle_name || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "middle_name",
                            e.target.value
                          )
                        }
                      />

                      <label htmlFor="relation">Relation to Member</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="Relation to Member"
                        type="text"
                        name=""
                        id=""
                        disabled={!isEdit}
                        required
                        value={member?.relation_to_member || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "relation_to_member",
                            e.target.value
                          )
                        }
                      />

                      <label htmlFor="fambirthdate">Date of Birth</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="Birth Date"
                        type="date"
                        name=""
                        id=""
                        value={formatDate(member?.birth_date) || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "birth_date",
                            e.target.value
                          )
                        }
                      />

                      <div className="flex w-full justify-between gap-4">
                        <div className="flex flex-col w-1/2">
                          <label htmlFor="famage">Age</label>
                          <input
                            className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                            placeholder="00"
                            type="number"
                            name=""
                            id=""
                            value={member?.age || ""}
                            readOnly
                          />
                        </div>

                        <div className="flex flex-col w-1/2 relative">
                          <label htmlFor="famgender">Gender</label>
                          <select
                            name=""
                            id=""
                            required
                            disabled={!isEdit}
                            value={member?.gender || ""}
                            onChange={(e) =>
                              handleFamilyMemberChange(
                                key,
                                "gender",
                                e.target.value
                              )
                            }
                            className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
                          >
                            <option value="" disabled hidden></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>

                          {!member.gender && (
                            <span className="absolute left-3 top-[29px] text-sm opacity-50 pointer-events-none z-0">
                              Male/Female
                            </span>
                          )}
                        </div>
                      </div>

                      <label htmlFor="education">Educational Attainment</label>
                      <input
                        className={`bg-customgray2 p-2 text-sm rounded-sm mb-3 ${isEdit ? "bg-gray-200" : ""}`}
                        placeholder="Educational Attainment"
                        type="text"
                        name=""
                        id=""
                        disabled={!isEdit}
                        required
                        value={member?.educational_attainment || ""}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            key,
                            "educational_attainment",
                            e.target.value
                          )
                        }
                      />

                      {isEdit && (
                        <Button
                          className="w-1/4 self-center bg-blue-button xl:w-2/5"
                          type="button"
                          onClick={() =>
                            confirmRemoveFamilyMember(
                              key,
                              `${member.first_name} ${member.last_name}`
                            )
                          }
                          variant="destructive"
                        >
                          <FaRegTrashAlt />
                          Delete
                        </Button>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </div>
          </Accordion>
        </div>

        <div className="flex flex-col gap-4 xl:col-start-3">
          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="signature">Confirmity/Signature</label>
            {memberData?.confirmity_signature ? (
              <img
                src={typeof memberData.confirmity_signature === "string"
                  ? memberData.confirmity_signature
                  : URL.createObjectURL(memberData.confirmity_signature)}
                alt="Signature"
                className="w-full max-w-xs border border-gray-300 rounded mb-3"
              />
            ) : (
              <p className={`text-sm italic text-gray-500 mb-3 bg-customgray2 pl-2 py-2 rounded-md ${isEdit ? "bg-gray-200" : ""}`}>No signature uploaded.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setMemberData({ ...memberData, confirmity_signature: e.target.files[0], })
              }
              className="hidden"
              id="signature-upload"
            />

            <label
              htmlFor="signature-upload"
              className={`w-1/2 py-2 rounded-md text-sm bg-blue-button text-white border border-black hover:bg-black duration-200 text-center cursor-pointer mb-3 ${isEdit ? "" : "hidden"}`}
            >
              Upload Signature
            </label>

            <label htmlFor="remarks">Remarks</label>
            <input
              className={`bg-customgray2 p-2 text-sm rounded-sm ${isEdit ? "bg-gray-200" : ""}`}
              placeholder="Remarks"
              type="text"
              name=""
              id=""
              disabled={!isEdit}
              value={memberData?.remarks || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, remarks: e.target.value })
              }
            />
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <p className="mb-3">Other Info</p>

            <label htmlFor="housing">Housing Conditions/Types</label>
            <div className="relative">
              <select
                name=""
                id=""
                required
                disabled={!isEdit}
                value={householdData?.condition_type || ""}
                onChange={(e) =>
                  setHouseholdData({
                    ...householdData,
                    condition_type: e.target.value,
                  })
                }
                className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm w-full ${isEdit ? "bg-gray-200" : ""}`}
              >
                <option value="" disabled hidden></option>
                <option value="Needs minor repair">Needs minor repair</option>
                <option value="Needs major repair">Needs major repair</option>
                <option value="Dilapidated/Condemned">
                  Dilapidated/Condemned
                </option>
                <option value="Under renovation/Being repaired">
                  Under renovation/Being repaired
                </option>
                <option value="Unfinished construction">
                  Unfinished construction
                </option>
                <option value="Under construction">Under construction</option>
              </select>

              {!householdData.condition_type && (
                <span className="absolute left-3 top-[4px] text-sm opacity-50 pointer-events-none z-0">
                  Options
                </span>
              )}
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col items-center mb-3 gap-1">
                <label htmlFor="meralco">Meralco</label>
                <Checkbox
                  id="meralco"
                  className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`}
                  checked={!!householdData?.Meralco || false}
                  onCheckedChange={(checked) =>
                    setHouseholdData({ ...householdData, Meralco: checked })
                  }
                />
              </div>

              <div className="flex flex-col items-center mb-3 gap-1">
                <label htmlFor="maynilad">Maynilad</label>
                <Checkbox
                  id="maynilad"
                  className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`}
                  checked={!!householdData?.Maynilad || false}
                  onCheckedChange={(checked) =>
                    setHouseholdData({ ...householdData, Maynilad: checked })
                  }
                />
              </div>

              <div className="flex flex-col items-center mb-3 gap-1">
                <label htmlFor="septic">Septic Tank</label>
                <Checkbox
                  id="septic"
                  className={`border bg-customgray1 size-6 ${view === "view" ? "pointer-events-none cursor-default opacity-100" : ""}`}
                  checked={!!householdData?.Septic_Tank || false}
                  onCheckedChange={(checked) =>
                    setHouseholdData({ ...householdData, Septic_Tank: checked })
                  }
                />
              </div>
            </div>

            <label htmlFor="acquisition">Land Acquisition</label>
            <div className="relative">
              <select
                name=""
                id=""
                required
                disabled={!isEdit}
                value={familyData?.land_acquisition || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    land_acquisition: e.target.value,
                  })
                }
                className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm w-full ${isEdit ? "bg-gray-200" : ""}`}
              >
                <option value="" disabled hidden></option>
                <option value="CMP">CMP</option>
                <option value="Direct Buying">Direct Buying</option>
                <option value="On Process">On Process</option>
                <option value="Auction">Auction</option>
                <option value="Organized Community">Organized Community</option>
                <option value="Expropriation">Expropriation</option>
              </select>

              {!familyData.land_acquisition && (
                <span className="absolute left-3 top-[4px] text-sm opacity-50 pointer-events-none z-0">
                  Options
                </span>
              )}
            </div>

            <label htmlFor="occupancy">Status of Occupancy</label>
            <div className="relative">
              <select
                name=""
                id=""
                required
                disabled={!isEdit}
                value={familyData?.status_of_occupancy || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    status_of_occupancy: e.target.value,
                  })
                }
                className={`mb-3 bg-customgray2 p-2 text-sm rounded-sm w-full ${isEdit ? "bg-gray-200" : ""}`}
              >
                <option value="" disabled hidden></option>
                <option value="Owner">Owner</option>
                <option value="Sharer">Sharer</option>
                <option value="Renter">Renter</option>
              </select>

              {!familyData.status_of_occupancy && (
                <span className="absolute left-3 top-[4px] text-sm opacity-50 pointer-events-none z-0">
                  Options
                </span>
              )}
            </div>
          </div>

          <div className="flex w-full justify-between gap-4 font-poppins">
            <button
              className="w-1/2 px-5 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition duration-200 xl:hidden"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </button>
            {isEdit && (
              <button
                className="w-1/2 px-5 py-2 rounded-md text-white bg-blue-button hover:bg-black transition duration-200 xl:w-full"
                type="submit"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </form>

      {/* dialog for delete confirmation on family member */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <DialogTitle className="text-left">
              Delete This Family Member?
            </DialogTitle>
            <DialogDescription className="text-md text-gray-700">
              Are you sure you want to remove <span className="font-bold">{memberToDeleteName}</span> as a
              family member?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <Button
                className="w-[48%] bg-red-700 hover:bg-red-900 font-normal text-md py-6"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </Button>
              <DialogClose className="w-[48%] bg-black rounded-md text-white cursor-pointer hover:bg-gray-900 duration-200">
                Cancel
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* dialog for cofirmation of editing the member */}
      <Dialog open={confirmEditDialog} onOpenChange={setConfirmEditDialog}>
        <DialogContent className="w-[80%]">
          <DialogHeader>
            <DialogTitle className="text-left">
              Edit Member?
            </DialogTitle>
            <DialogDescription className="text-md text-gray-700">
              Proceed to edit this member? Please double-check the details before proceeding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-full flex justify-between">
              <Button
                className="w-[45%] bg-blue-button py-6 text-md font-normal"
                onClick={handleUpdates}
              >
                Proceed
              </Button>
              <DialogClose className="w-[45%] bg-black rounded-md text-white cursor-pointer hover:bg-gray-900 duration-200">
                Cancel
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberForms;
