import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import ClearableInputField from "@/components/MemberCompts/ClearableInputField";
import ClearableSelectField from "@/components/MemberCompts/ClearableSelectField";
import CheckboxField from "@/components/MemberCompts/CheckboxField";
import ConfirmDialog from "@/components/MemberCompts/ConfirmDialog";
import { toast } from "sonner";
import axios from "axios";
import "./Members.css";
import useAuthStore from "@/authStore";
import imageCompression from 'browser-image-compression';

const HousingUtilities = ({ view }) => {
  const memberId = useAuthStore((s) => s.memberId);
  const navigate = useNavigate();

  const [savedData, setSavedData] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const isEdit = view === "edit";

  const form = useForm({
    mode: "all",
    defaultValues: {
      tct_no: "",
      block_no: "",
      lot_no: "",
      area: "",
      open_space_share: "",
      total: "",
      confirmity_signature: "",
      remarks: "",
      Meralco: 0,
      Maynilad: 0,
      Septic_Tank: 0,
      condition_type: "",
      land_acquisition: "",
      status_of_occupancy: "",
    },
  });

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

        const signatureImage = bufferToBase64Image(data.confirmity_signature?.data);

        const household = {
          tct_no: data.tct_no,
          block_no: data.block_no,
          lot_no: data.lot_no,
          area: data.area,
          open_space_share: data.open_space_share,
          total: data.total || "",
          confirmity_signature: signatureImage || "",
          remarks: data.remarks,
          condition_type: data.condition_type,
          Meralco: data.Meralco,
          Maynilad: data.Maynilad,
          Septic_Tank: data.Septic_Tank,
          land_acquisition: data.land_acquisition,
          status_of_occupancy: data.status_of_occupancy,
        };

        setSavedData(household);
        setSignatureFile(signatureImage || null);
        form.reset(household);
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

  // function to update housing & utilities details
  const handleUpdates = async (data) => {
    try {
      const formData = new FormData();
      let confirmityFile = signatureFile;

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

      const payload = {
        members: {
          confirmity_signature: confirmityFile,
          remarks: data.remarks,
        },
        families: {
          land_acquisition: data.land_acquisition,
          status_of_occupancy: data.status_of_occupancy,
        },
        households: {
          tct_no: data.tct_no,
          block_no: data.block_no,
          lot_no: data.lot_no,
          area: data.area,
          open_space_share: data.open_space_share,
          condition_type: data.condition_type,
          Meralco: data.Meralco,
          Maynilad: data.Maynilad,
          Septic_Tank: data.Septic_Tank,
        },
        family_members: [],
      };

      formData.append("members", JSON.stringify(payload.members));
      formData.append("families", JSON.stringify(payload.families));
      formData.append("households", JSON.stringify(payload.households));
      formData.append("family_members", JSON.stringify(payload.family_members));


      await axios.put(`${API_URL}/members/info/${memberId}`, formData, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSavedData(data);
      toast.success("Changes saved successfully!");
      navigate(`/memberView/housing-utilities`);
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
      toast.error("Compression failed:", error);
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

  return (
    <div className="main">
      <div className="btn-div">
        {isEdit ? (
          <>
            <Button
              variant="cancel"
              className="py-6 border border-black hover:bg-gray-300"
              onClick={() => {
                if (savedData) {
                  form.reset(savedData);
                }
                navigate(`/memberView/housing-utilities`);
              }}
            >
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
            onClick={() => navigate(`/memberView/housing-utilities/edit`)}
          >
            {" "}
            Edit Details{" "}
          </Button>
        )}
      </div>

      <Form {...form}>
        <div className="info">
          <Card className="card">
            <CardContent className="card-content">
              <div className="space-y-4 mt-4">

                <ClearableInputField control={form.control} name="tct_no" label="TCT No." isEdit={isEdit} inputProps={{ placeholder: "000-0000000000" }} rules={{ required: "Please enter your TCT number" }} />

                <div className="flex gap-4">
                  <ClearableInputField control={form.control} name="block_no" label="Block No." className="w-1/2" isEdit={isEdit} inputProps={{ placeholder: "00" }} rules={{ required: "Please enter your block number" }} />
                  <ClearableInputField control={form.control} name="lot_no" label="Lot No." className="w-1/2" isEdit={isEdit} inputProps={{ placeholder: "00" }} rules={{ required: "Please enter your lot number" }} />
                </div>

                <ClearableInputField control={form.control} name="area" label="Area" isEdit={isEdit} inputProps={{ placeholder: "00" }} rules={{ required: "Please enter your area" }} />
                <ClearableInputField control={form.control} name="open_space_share" label="Share of Open Space" isEdit={isEdit} inputProps={{ placeholder: "00" }} rules={{ required: "Please enter your share of open space" }} />
                <ClearableInputField control={form.control} name="total" label="Total" isEdit={false} inputProps={{ readOnly: true, placeholder: "00" }} />

              </div>
            </CardContent>
          </Card >

          <Card className="card">
            <CardContent className="card-content">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="signature" className="font-medium">Conformity/Signature</label>

                  {signatureFile ? (
                    <img
                      src={
                        typeof signatureFile === "string" ? signatureFile : URL.createObjectURL(signatureFile)
                      }
                      alt="Signature"
                      className="w-full max-w-xs border border-gray-300 rounded mb-3"
                    />
                  ) : (
                    <p className={`text-sm italic text-gray-500 mb-3 bg-customgray2 pl-2 rounded-md ${isEdit ? "py-2" : "py-2.5"}`}>
                      No signature uploaded.
                    </p>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSignatureFile(e.target.files[0])}
                    className="hidden"
                    id="signature-upload"
                  />

                  <label
                    htmlFor="signature-upload"
                    className={`w-1/2 py-2 rounded-md text-sm bg-blue-button text-white border border-black hover:bg-black duration-200 text-center cursor-pointer mb-3 ${isEdit ? "" : "hidden"
                      } sm:hidden`}
                  >
                    Upload Signature
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <ClearableInputField
                    control={form.control}
                    name="remarks"
                    label="Remarks"
                    isEdit={isEdit}
                    inputProps={{ placeholder: "Remarks" }}
                  />
                </div>
              </div>

              <label
                htmlFor="signature-upload"
                className={`w-1/4 py-2 rounded-md text-sm bg-blue-button text-white border border-black hover:bg-black duration-200 text-center cursor-pointer ${isEdit ? "sm:block hidden" : "hidden"
                  }`}
              >
                Upload Signature
              </label>
            </CardContent>
          </Card>

          <Card className="card">
            <CardContent className="card-content space-y-4">
              <p className="text-xl font-medium"> Other Info </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <ClearableSelectField control={form.control} name="condition_type" label="Housing Condition/ Types" isEdit={isEdit}
                  options={[
                    "Needs minor repair",
                    "Needs major repair",
                    "Dilapidated/Condemned",
                    "Under renovation/Being repaired",
                    "Unfinished construction",
                    "Under construction",
                  ]}
                  rules={{ required: "Please select from the options" }}
                  className="pb-2 w-full"
                />

                <div className="sm:col-start-2">
                  <div className="flex justify-center gap-6 pb-2">
                    <CheckboxField control={form.control} name="Meralco" label="Meralco" isEdit={isEdit} className="text-black" />
                    <CheckboxField control={form.control} name="Maynilad" label="Maynilad" isEdit={isEdit} className="text-black" />
                    <CheckboxField control={form.control} name="Septic_Tank" label="Septic Tank" isEdit={isEdit} className="text-black" />
                  </div>
                </div>

                <ClearableSelectField control={form.control} name="land_acquisition" label="Land Acquisition" isEdit={false}
                  options={[
                    "CMP",
                    "Direct Buying",
                    "On Process",
                    "Auction",
                    "Organized Community",
                    "Expropriation",
                  ]}
                  rules={{ required: "Please select from the options" }}
                  className="pb-2 w-full"
                />
                <ClearableSelectField control={form.control} name="status_of_occupancy" label="Status of Occupancy" isEdit={false} options={["Owner", "Sharer", "Renter"]} className="w-full sm:col-span-2 sm:w-1/2" />
              </div>
            </CardContent>
          </Card >
        </div >
      </Form >
    </div >
  );
};

export default HousingUtilities;
