import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import useAuthStore from "@/authStore";
import imageCompression from "browser-image-compression";

const Settings = () => {
  const { memberId } = useAuthStore();

  const [option, setOption] = useState("username");
  const [credentialsId, setCredentialsId] = useState(null);
  const [initialName, setInitialName] = useState("");
  const [username, setUsername] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pfp, setPfp] = useState(null);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API_URL}/credentials/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      setCredentialsId(res.data.id);
      setInitialName(res.data.username);

      if (res.data.pfp?.data) {
        const imageSrc = bufferToBase64Image(res.data.pfp.data);
        setPfp(imageSrc);
      }
    }).catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
  }, [API_SECRET, memberId]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (option === "username") {
        await axios.put(`${API_URL}/credentials/${credentialsId}`, { username }, {
          headers: { Authorization: `Bearer ${API_SECRET}` },
        });
        setDialogOpen(true);
        setDialogMsg("Username");
        setInitialName(username);
        setUsername("");
      }

      if (option === "password") {
        if (newPass !== confirmPass) {
          toast.error("New Password and Confirm New Password Do Not Match.");
          return;
        }

        await axios.post(`${API_URL}/credentials/password/${memberId}`, {
          current_password: currentPass,
          new_password: newPass,
        }, {
          headers: { Authorization: `Bearer ${API_SECRET}` },
        });

        setDialogOpen(true);
        setDialogMsg("Password");
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
      }

      if (option === "picture" && pfp) {
        let profileFile = pfp;

        if (profileFile) {
          const isBase64 = typeof profileFile === "string";

          if (isBase64) {
            profileFile = base64ToFile(profileFile, "profile-picture");
          } else if (profileFile instanceof File) {
            const validTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!validTypes.includes(profileFile.type)) {
              toast.error("Only JPG, JPEG, or PNG Files are Allowed.");
              return;
            }

            if (profileFile.size > 10 * 1024 * 1024) {
              toast.error("Picture File Size Must be Under 10MB.");
              return;
            }

            profileFile = await compressImage(profileFile);
          }

          const formData = new FormData();
          formData.append("pfp", profileFile);

          await axios.post(`${API_URL}/uploads/member/${memberId}`, formData, {
            headers: {
              Authorization: `Bearer ${API_SECRET}`,
              "Content-Type": "multipart/form-data",
            },
          });

          setDialogOpen(true);
          setDialogMsg("Profile Picture");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 800,
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
    <div className="font-poppins">
      <div className="px-8 py-10">
        <Link
          to="/members"
          className="cursor-pointer px-3 rounded-md border border-black flex items-center gap-2 w-30 md:w-40 md:gap-8"
        >
          <IoIosArrowRoundBack className="size-10" />
          <p className="font-poppins text-lg">Back</p>
        </Link>
      </div>

      <div className="px-9 pb-10 flex flex-col gap-10 xl:flex-row">
        <div className="flex flex-col gap-8 xl:flex-1 xl:mt-20 xl:gap-10">
          <p className="text-center font-semibold text-lg">Account Settings</p>
          <div className="flex flex-col gap-2 xl:gap-7">
            <Button
              className="bg-white hover:bg-gray-300 text-black border border-black text-md !p-2 !h-auto xl:!p-3"
              onClick={() => setOption("username")}
            >
              Change Username
            </Button>
            <Button
              className="bg-white hover:bg-gray-300 text-black border border-black text-md !p-2 !h-auto xl:!p-3"
              onClick={() => setOption("password")}
            >
              Change Password
            </Button>
            <Button
              className="bg-white hover:bg-gray-300 text-black border border-black text-md !p-2 !h-auto xl:!p-3"
              onClick={() => setOption("picture")}
            >
              Change Profile Picture
            </Button>
          </div>
        </div>

        <form className="border border-black rounded-xl p-7 flex flex-col gap-20 min-h-lvh xl:flex-4/7" onSubmit={handleUpdate}>
          <Button
            className="w-2/5 self-end bg-blue-button xl:w-1/5"
            type="submit"
          >
            Save
          </Button>
          {option === "username" && (
            <div className="flex flex-col gap-10 xl:px-7">
              <p>Current Username: {initialName}</p>
              <div className="flex flex-col gap-2">
                <label htmlFor="username">New Username</label>
                <input
                  className="border border-black p-2 rounded-md bg-customgray2"
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter Your New Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={option === "username"}
                />
              </div>
            </div>
          )}

          {option === "password" && (
            <div className="flex flex-col gap-10 xl:px-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="currentpass">Current Password</label>
                <div className="relative">
                  <input
                    className="w-full border border-black p-2 pr-10 rounded-md bg-customgray2"
                    type={showCurrentPass ? "text" : "password"}
                    name=""
                    id="currPass"
                    placeholder="Enter Your Current Password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required={option === "password"}
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showCurrentPass ? <LuEyeOff className="size-5" /> : <LuEye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newpass">New Password</label>
                <div className="relative">
                  <input
                    className="w-full border border-black p-2 pr-10 rounded-md bg-customgray2"
                    type={showNewPass ? "text" : "password"}
                    name=""
                    id="newPass"
                    placeholder="Enter Your New Password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required={option === "password"}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showNewPass ? <LuEyeOff className="size-5" /> : <LuEye className="size-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmpass">Confirm New Password</label>
                <div className="relative">
                  <input
                    className="w-full border border-black p-2 pr-10 rounded-md bg-customgray2"
                    type={showConfirmPass ? "text" : "password"}
                    name=""
                    id="confirmPass"
                    placeholder="Enter Your New Password Again"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required={option === "password"}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showConfirmPass ? <LuEyeOff className="size-5" /> : <LuEye className="size-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {option === "picture" && (
            <div className="flex flex-col gap-8 items-center xl:px-7">
              {pfp ? (
                <img className="size-36 md:size-40 lg:size-44 rounded-full bg-gray-400 object-cover"
                  src={typeof pfp === "string" ? pfp : URL.createObjectURL(pfp)}
                  alt="Profile Picture"
                />
              ) : (
                <IoPersonCircleSharp className="size-44 md:size-40 lg:size-52 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPfp(e.target.files[0])}
                className="hidden"
                id="pfp-upload"
              />
              <label htmlFor="pfp-upload" className="w-1/2 py-4 rounded-md bg-white text-black border border-black hover:bg-gray-300 duration-200 md:w-1/3 lg:w-1/4">
                <p className="text-center">Upload Image</p>
              </label>
            </div>
          )}
        </form>
      </div>

      {/* Dialog for username/password change */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogContent className="w-[70%]">
            <DialogDescription></DialogDescription>
            <p className="pt-3 pb-3 text-center font-medium text-lg">
              Your {dialogMsg} Has Been Updated!
            </p>
          </DialogContent>
        </DialogHeader>
      </Dialog>
    </div>
  );
};

export default Settings;
