import React, { useState } from "react";
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
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  const handleAddFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        last_name: "",
        first_name: "",
        middle_name: "",
        birth_date: "",
        age: "",
        gender: "",
        relation_to_member: "",
        educational_attainment: "",
      },
    ]);
  };

  const handleRemoveFamilyMember = (index) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updated = [...familyMembers];

    if (field === "birth_date") {
      const age = calculateAge(value);
      updated[index] = { ...updated[index], birth_date: value, age };
    } else {
      updated[index][field] = value;
    }

    setFamilyMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { age: _age, ...cleanedMemberData } = memberData;
    const cleanedFamilyMembers = familyMembers.map(
      ({ age: _age, ...rest }) => rest
    );

    const payload = {
      members: cleanedMemberData,
      families: familyData,
      households: householdData,
      family_members: cleanedFamilyMembers,
    };
    console.log(payload);
    axios
      .post(`${API_URL}/members/info`, payload, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then(() => {
        navigate("/members");
      })
      .catch((err) => console.log(err));
  };

  function calculateAge(birthdateStr) {
    const birthDate = new Date(birthdateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return isNaN(age) ? "" : age;
  }

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
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 xl:col-start-1">
          <div className="flex justify-between items-center xl:hidden">
            <Link to="/members">
              <IoIosArrowRoundBack className="size-10 cursor-pointer" />
            </Link>
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="lastname">Last Name</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Last Name"
              type="text"
              name=""
              id=""
              required
              value={memberData.last_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, last_name: e.target.value })
              }
            />

            <label htmlFor="firstname">First Name</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="First Name"
              type="text"
              name=""
              id=""
              required
              value={memberData.first_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, first_name: e.target.value })
              }
            />

            <label htmlFor="middlename">Middle Name</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Middle Name"
              type="text"
              name=""
              id=""
              required
              value={memberData.middle_name || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, middle_name: e.target.value })
              }
            />

            <label htmlFor="birthdate">Date of Birth</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              type="date"
              name=""
              id=""
              required
              value={memberData.birth_date || ""}
              onChange={(e) => {
                const value = e.target.value;
                const age = calculateAge(value);
                setMemberData((prev) => ({
                  ...prev,
                  birth_date: value,
                  age,
                }));
              }}
            />

            <div className="flex justify-between gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="age">Age</label>
                <input
                  className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
                  placeholder="00"
                  type="number"
                  name=""
                  id=""
                  value={memberData.age || ""}
                  readOnly
                />
              </div>

              <div className="flex flex-col w-1/2 relative">
                <label htmlFor="gender">Gender</label>
                <select
                  name=""
                  id=""
                  required
                  value={memberData.gender || ""}
                  onChange={(e) =>
                    setMemberData({ ...memberData, gender: e.target.value })
                  }
                  className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
                >
                  <option value="" disabled hidden></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {!memberData.gender && (
                  <span className="absolute left-3 top-[28px] text-sm opacity-50 pointer-events-none z-0">
                    Male/Female
                  </span>
                )}
              </div>
            </div>

            <label htmlFor="position">Position</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Position"
              type="text"
              name=""
              id=""
              required
              value={familyData.head_position || ""}
              onChange={(e) =>
                setFamilyData({ ...familyData, head_position: e.target.value })
              }
            />

            <label htmlFor="contact">Contact Number</label>
            <input
              className="bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Contact Number"
              type="number"
              name=""
              id=""
              required
              value={memberData.contact_number || ""}
              onChange={(e) =>
                setMemberData({ ...memberData, contact_number: e.target.value })
              }
            />
          </div>

          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="tct">TCT No.</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="TCT Number"
              type="number"
              name=""
              id=""
              required
              value={householdData.tct_no || ""}
              onChange={(e) =>
                setHouseholdData({ ...householdData, tct_no: e.target.value })
              }
            />

            <div className="flex justify-between gap-4">
              <div className="flex flex-col w-1/2">
                <label htmlFor="block">Block No.</label>
                <input
                  className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
                  placeholder="Block Number"
                  type="number"
                  name=""
                  id=""
                  required
                  value={householdData.block_no || ""}
                  onChange={(e) =>
                    setHouseholdData({
                      ...householdData,
                      block_no: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label htmlFor="lot">Lot No.</label>
                <input
                  className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
                  placeholder="Lot Number"
                  type="number"
                  name=""
                  id=""
                  required
                  value={householdData.lot_no || ""}
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
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Open Space Share"
              type="number"
              name=""
              id=""
              required
              value={householdData.open_space_share || ""}
              onChange={(e) =>
                setHouseholdData({
                  ...householdData,
                  open_space_share: e.target.value,
                })
              }
            />

            <label htmlFor="area">Area</label>
            <input
              className="bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Area"
              type="number"
              name=""
              id=""
              required
              value={householdData.area || ""}
              onChange={(e) =>
                setHouseholdData({ ...householdData, area: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:col-start-2">
          <div className="bg-white px-5 py-3 flex justify-between rounded-md font-poppins">
            <p className="font-medium">
              Family Composition ({familyMembers.length})
            </p>
            <div
              className="flex items-center gap-2 bg-customgray1 px-2 rounded-sm cursor-pointer hover:bg-gray-400 duration-300"
              onClick={handleAddFamilyMember}
              variant="outline"
            >
              <FaPlus />
              <p>Add</p>
            </div>
          </div>

          <Accordion type="single" collapsible>
            <div className="flex flex-col gap-4">
              {familyMembers.map((member, index) => (
                <AccordionItem key={index} value={`member${index}`}>
                  <AccordionTrigger className="hover:no-underline bg-white p-5 rounded-md font-poppins font-medium data-[state=open]:rounded-b-none cursor-pointer">
                    Family Member {index + 1}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col bg-white px-5 pb-5 font-poppins rounded-b-sm">
                    <label htmlFor="famlastname">Last Name</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="Last Name"
                      type="text"
                      name=""
                      id=""
                      required
                      value={member.last_name || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "last_name",
                          e.target.value
                        )
                      }
                    />

                    <label htmlFor="famfirstname">First Name</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="First Name"
                      type="text"
                      name=""
                      id=""
                      required
                      value={member.first_name || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "first_name",
                          e.target.value
                        )
                      }
                    />

                    <label htmlFor="fammiddlename">Middle Name</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="Middle Name"
                      type="text"
                      name=""
                      id=""
                      required
                      value={member.middle_name || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "middle_name",
                          e.target.value
                        )
                      }
                    />

                    <label htmlFor="relation">Relation to Member</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="Relation to Member"
                      type="text"
                      name=""
                      id=""
                      required
                      value={member.relation_to_member || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "relation_to_member",
                          e.target.value
                        )
                      }
                    />

                    <label htmlFor="fambirthdate">Date of Birth</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="Birth Date"
                      type="date"
                      name=""
                      id=""
                      required
                      value={member.birth_date || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "birth_date",
                          e.target.value
                        )
                      }
                    />

                    <div className="flex w-full justify-between gap-4">
                      <div className="flex flex-col w-1/2">
                        <label htmlFor="famage">Age</label>
                        <input
                          className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                          placeholder="Age"
                          type="number"
                          name=""
                          id=""
                          value={member.age || ""}
                          readOnly
                        />
                      </div>

                      <div className="flex flex-col w-1/2 relative">
                        <label htmlFor="famgender">Gender</label>
                        <select
                          name=""
                          id=""
                          required
                          value={member.gender || ""}
                          onChange={(e) =>
                            handleFamilyMemberChange(
                              index,
                              "gender",
                              e.target.value
                            )
                          }
                          className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
                        >
                          <option value="" disabled hidden></option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>

                        {!member.gender && (
                          <span className="absolute left-3 top-[24px] text-sm opacity-50 pointer-events-none z-0">
                            Male/Female
                          </span>
                        )}
                      </div>
                    </div>

                    <label htmlFor="education">Educational Attainment</label>
                    <input
                      className="bg-customgray2 py-1 px-2 text-sm rounded-sm mb-3"
                      placeholder="Educational Attainment"
                      type="text"
                      name=""
                      id=""
                      required
                      value={member.educational_attainment || ""}
                      onChange={(e) =>
                        handleFamilyMemberChange(
                          index,
                          "educational_attainment",
                          e.target.value
                        )
                      }
                    />

                    <Button
                      className="w-1/4 self-center bg-blue-button xl:w-2/5"
                      onClick={() => handleRemoveFamilyMember(index)}
                      variant="destructive"
                    >
                      <FaRegTrashAlt />
                      Delete
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>
        </div>

        <div className="flex flex-col gap-4 xl:col-start-3">
          <div className="bg-white p-5 flex flex-col rounded-md font-poppins font-normal">
            <label htmlFor="signature">Confirmity/Signature</label>
            <input
              className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="-----"
              type="text"
              name=""
              id=""
              value={memberData.confirmity_signature || ""}
              onChange={(e) =>
                setMemberData({
                  ...memberData,
                  confirmity_signature: e.target.value,
                })
              }
            />

            <label htmlFor="remarks">Remarks</label>
            <input
              className="bg-customgray2 py-1 px-2 text-sm rounded-sm"
              placeholder="Remarks"
              type="text"
              name=""
              id=""
              value={memberData.remarks || ""}
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
                value={householdData.condition_type || ""}
                onChange={(e) =>
                  setHouseholdData({
                    ...householdData,
                    condition_type: e.target.value,
                  })
                }
                className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm w-full"
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
                  className="border bg-customgray1 size-6"
                  checked={!!householdData.Meralco || false}
                  onCheckedChange={(checked) =>
                    setHouseholdData({ ...householdData, Meralco: checked })
                  }
                />
              </div>

              <div className="flex flex-col items-center mb-3 gap-1">
                <label htmlFor="maynilad">Maynilad</label>
                <Checkbox
                  id="maynilad"
                  className="border bg-customgray1 size-6"
                  checked={!!householdData.Maynilad || false}
                  onCheckedChange={(checked) =>
                    setHouseholdData({ ...householdData, Maynilad: checked })
                  }
                />
              </div>

              <div className="flex flex-col items-center mb-3 gap-1">
                <label htmlFor="septic">Septic Tank</label>
                <Checkbox
                  id="septic"
                  className="border bg-customgray1 size-6"
                  checked={!!householdData.Septic_Tank || false}
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
                value={familyData.land_acquisition || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    land_acquisition: e.target.value,
                  })
                }
                className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm w-full"
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
                value={familyData.status_of_occupancy || ""}
                onChange={(e) =>
                  setFamilyData({
                    ...familyData,
                    status_of_occupancy: e.target.value,
                  })
                }
                className="mb-3 bg-customgray2 py-1 px-2 text-sm rounded-sm w-full"
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
    </div>
  );
};

export default AddMember;
