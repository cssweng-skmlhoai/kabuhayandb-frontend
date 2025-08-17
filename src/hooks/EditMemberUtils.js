import axios from "axios";
import { toast } from "sonner";
import { bufferToBase64Image, base64ToFile, compressImage } from "./ImageUtils";
import { API_SECRET, API_URL } from "./Constants";

export const handleAddFamilyMember = (setFamilyMembers) => {
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

export const handleRemoveFamilyMember = (setFamilyMembers, key) => {
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

export const handleFamilyMemberChange = (
  setFamilyMembers,
  key,
  field,
  value
) => {
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

export const fetchMemberInfo = (
  id,
  setAllDetails,
  setMemberData,
  setFamilyData,
  setHouseholdData,
  setFamilyMembers
) => {
  axios
    .get(`${API_URL}/members/info/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      const data = res.data;
      setAllDetails(data);

      const signatureImage = bufferToBase64Image(
        data.confirmity_signature?.data
      );

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

      const transformedFamilyMembers = (data.family_members || []).map((fm) => {
        const { relation, ...rest } = fm;
        return {
          ...rest,
          relation_to_member: relation,
          update: true,
        };
      });
      setFamilyMembers(transformedFamilyMembers);
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

export const handleUpdates = async (
  e,
  id,
  memberData,
  familyData,
  householdData,
  familyMembers,
  navigate
) => {
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

        confirmityFile = await compressImage(confirmityFile, 0.3, 1000);
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
    toast.error(
      err.response?.data?.error || err.message || "Something went wrong"
    );
  }
};

export const confirmRemoveFamilyMember = (
  setMemberToDeleteId,
  setMemberToDeleteName,
  setDeleteDialogOpen,
  key,
  fullName
) => {
  setMemberToDeleteId(key);
  setMemberToDeleteName(fullName);
  setDeleteDialogOpen(true);
};

export const handleDeleteConfirmed = (
  setDeleteDialogOpen,
  setFamilyMembers,
  memberToDeleteId
) => {
  handleRemoveFamilyMember(setFamilyMembers, memberToDeleteId);
  setDeleteDialogOpen(false);
};

export const formatDate = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
};
