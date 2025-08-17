import axios from "axios";
import { toast } from "sonner";
import { compressImage } from "./ImageUtils";
import { API_URL, API_SECRET } from "./Constants";

// timer effect for credentials dialog
export const handleCredentialsDialogEffect = (
  credentialsDialog,
  setSecondsLeft,
  setShowCloseButton
) => {
  let timer;
  if (credentialsDialog) {
    setSecondsLeft(5);
    setShowCloseButton(false);

    timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCloseButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timer);
};

// add a new empty family member
export const handleAddFamilyMember = (setFamilyMembers) => {
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

// remove a family member
export const handleRemoveFamilyMember = (setFamilyMembers, index) => {
  setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
};

// change family member fields (with auto-age calculation)
export const handleFamilyMemberChange = (
  setFamilyMembers,
  familyMembers,
  index,
  field,
  value
) => {
  const updated = [...familyMembers];

  if (field === "birth_date") {
    const age = calculateAge(value);
    updated[index] = { ...updated[index], birth_date: value, age };
  } else {
    updated[index][field] = value;
  }

  setFamilyMembers(updated);
};

// add new member
export const handleSubmit = async ({
  e,
  memberData,
  familyData,
  householdData,
  familyMembers,
  setCredentialsDialog,
  setNewCredentials,
}) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    if (memberData.confirmity_signature instanceof File) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(memberData.confirmity_signature.type)) {
        toast.error("Only JPG, JPEG, or PNG files are allowed.");
        return;
      }

      if (memberData.confirmity_signature.size > 10 * 1024 * 1024) {
        toast.error("Signature image must be under 10MB.");
        return;
      }

      const compressedSignature = await compressImage(
        memberData.confirmity_signature,
        0.3,
        1000
      );
      formData.append("confirmity_signature", compressedSignature);
    }

    const { age: _age, ...cleanedMemberData } = memberData;
    const cleanedFamilyMembers = familyMembers.map(
      ({ age: _age, ...rest }) => rest
    );

    formData.append("members", JSON.stringify(cleanedMemberData));
    formData.append("families", JSON.stringify(familyData));
    formData.append("households", JSON.stringify(householdData));
    formData.append("family_members", JSON.stringify(cleanedFamilyMembers));

    const res = await axios.post(`${API_URL}/members/info`, formData, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setCredentialsDialog(true);
    setNewCredentials(res.data.credentials);
  } catch (err) {
    toast.error(
      err.response?.data?.error || err.message || "Something went wrong"
    );
  }
};

// ask for delete confirmation
export const confirmRemoveFamilyMember = (
  setMemberToDeleteId,
  setMemberToDeleteName,
  setDeleteDialogOpen,
  index,
  fullName
) => {
  setMemberToDeleteId(index);
  setMemberToDeleteName(fullName);
  setDeleteDialogOpen(true);
};

// confirm delete action
export const handleDeleteConfirmed = (
  setFamilyMembers,
  memberToDeleteId,
  setDeleteDialogOpen
) => {
  handleRemoveFamilyMember(setFamilyMembers, memberToDeleteId);
  setDeleteDialogOpen(false);
};

// age calculation
export function calculateAge(birthdateStr) {
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
