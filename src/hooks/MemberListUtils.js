import axios from "axios";
import { toast } from "sonner";
import { bufferToBase64Image } from "./ImageUtils";
import { API_URL, API_SECRET } from "./Constants";

// fetch all members once landed on page
export const fetchMembers = (setMembers) => {
  axios
    .get(`${API_URL}/members/home`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      if (!res.data) {
        setMembers([]);
      } else {
        const members = res.data.map((member) => ({
          ...member,
          pfp: bufferToBase64Image(member.pfp?.data),
        }));
        setMembers(members);
      }
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// search for a member
export const searchUser = (searched, setMembers, setCurrentPage) => {
  axios
    .get(`${API_URL}/members/home?name=${searched}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      if (!res.data) {
        setMembers([]);
      } else {
        const results = Array.isArray(res.data) ? res.data : [res.data];
        setMembers(results);
        setCurrentPage(1);
      }
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// delete a member
export const handleDelete = (
  id,
  setMembers,
  setDialogOpen,
  memberId,
  logout,
  navigate
) => {
  axios
    .delete(`${API_URL}/members/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then(() => {
      setMembers((prev) => prev.filter((m) => m.member_id !== id));
      setDialogOpen(false);
      toast.success("Member Successfully Deleted");
      if (id === memberId) {
        logout();
        navigate("/login");
      }
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};
