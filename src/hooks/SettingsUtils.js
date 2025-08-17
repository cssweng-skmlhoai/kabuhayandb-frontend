import axios from "axios";
import { toast } from "sonner";
import { bufferToBase64Image, compressImage, base64ToFile } from "./ImageUtils";
import { API_URL, API_SECRET } from "./Constants";

// fetch user credentials
export const fetchCredentials = (
  memberId,
  setCredentialsId,
  setInitialName,
  setPfp
) => {
  axios
    .get(`${API_URL}/credentials/member/${memberId}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      setCredentialsId(res.data.id);
      setInitialName(res.data.username);

      if (res.data.pfp?.data) {
        const imageSrc = bufferToBase64Image(res.data.pfp.data);
        setPfp(imageSrc);
      }
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// update user credentials
export const handleUpdate = async ({
  e,
  option,
  username,
  currentPass,
  newPass,
  confirmPass,
  pfp,
  credentialsId,
  memberId,
  setDialogOpen,
  setDialogMsg,
  setInitialName,
  setUsername,
  setCurrentPass,
  setNewPass,
  setConfirmPass,
}) => {
  e.preventDefault();

  try {
    if (option === "username") {
      await axios.put(
        `${API_URL}/credentials/${credentialsId}`,
        { username },
        {
          headers: { Authorization: `Bearer ${API_SECRET}` },
        }
      );
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

      await axios.post(
        `${API_URL}/credentials/password/${memberId}`,
        {
          current_password: currentPass,
          new_password: newPass,
        },
        {
          headers: { Authorization: `Bearer ${API_SECRET}` },
        }
      );

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

          profileFile = await compressImage(profileFile, 0.05, 800);
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
    toast.error(
      err.response?.data?.error || err.message || "Something went wrong"
    );
  }
};
