import axios from "axios";
import { toast } from "sonner";
import { API_SECRET, API_URL } from "./Constants";

// fetch dues + balances, then apply filter
export const fetchMemberDues = (
  id,
  selectedType,
  setDues,
  setBalances,
  applyFilters
) => {
  axios
    .get(`${API_URL}/dues/member/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      const { dues, balances } = res.data;
      setDues(dues);
      setBalances(balances);
      applyFilters(dues, selectedType);
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// apply filtering and sorting
export const applyFilters = (
  allDues,
  type,
  setFilteredUnpaid,
  setFilteredPaid,
  setUnpaidPage,
  setPaidPage
) => {
  const filtered =
    type === "All" ? allDues : allDues.filter((d) => d.due_type === type);

  const unpaid = filtered
    .filter((d) => d.status === "Unpaid")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const paid = filtered
    .filter((d) => d.status === "Paid")
    .sort((a, b) => new Date(b.date_paid) - new Date(a.date_paid));

  setFilteredUnpaid(unpaid);
  setFilteredPaid(paid);
  setUnpaidPage(1);
  setPaidPage(1);
};

// add a due
export const handleAddDue = (
  e,
  selectedType,
  addDueType,
  dueDate,
  amount,
  status,
  id,
  setAddDueDialog,
  setRefreshKey
) => {
  e.preventDefault();

  let dueType = selectedType;
  if (dueType === "All") {
    dueType = addDueType;
  }

  const payload = {
    due_date: dueDate,
    amount,
    status,
    due_type: dueType,
    member_id: id,
  };

  axios
    .post(`${API_URL}/dues`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then(() => {
      setAddDueDialog(false);
      setRefreshKey((prev) => prev + 1);
      toast.success("Due Successfully Added");
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// update a due
export const handleUpdateDue = (
  e,
  selectedDueId,
  dueDate,
  amount,
  status,
  dueTypeInput,
  householdId,
  receiptNumber,
  setUpdateDueDialog,
  setRefreshKey
) => {
  e.preventDefault();

  const payload = {
    due_date: dueDate,
    amount,
    status,
    due_type: dueTypeInput,
    household_id: householdId,
    receipt_number: receiptNumber,
  };

  axios
    .put(`${API_URL}/dues/${selectedDueId}`, payload, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then(() => {
      setUpdateDueDialog(false);
      setRefreshKey((prev) => prev + 1);
      toast.success("Due Successfully Updated");
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// open update dialog with selected due
export const openUpdateForm = (
  due,
  setReceiptNumber,
  setSelectedDueId,
  setDueDate,
  setAmount,
  setStatus,
  setDueTypeInput,
  setHouseholdId,
  setUpdateDueDialog
) => {
  setReceiptNumber(due.receipt_number);
  setSelectedDueId(due.id);
  setDueDate(due.due_date.slice(0, 10));
  setAmount(due.amount);
  setStatus(due.status);
  setDueTypeInput(due.due_type);
  setHouseholdId(due.household_id);
  setUpdateDueDialog(true);
};

// delete a due
export const handleDeleteDue = (
  selectedDueId,
  setDeleteDueDialog,
  setUpdateDueDialog,
  setSelectedDueId,
  setRefreshKey
) => {
  axios
    .delete(`${API_URL}/dues/${selectedDueId}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then(() => {
      setDeleteDueDialog(false);
      setUpdateDueDialog(false);
      setSelectedDueId(null);
      setRefreshKey((prev) => prev + 1);
      toast.success("Due Successfully Deleted");
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// get type of due value
export function dueTypeBalances(type) {
  const map = {
    "Monthly Amortization": "amortization",
    "Monthly Dues": "monthly",
    Taxes: "taxes",
    Penalties: "penalties",
    Others: "others",
  };
  return map[type] || "";
}

// get outstanding balance
export const getOutstandingBalance = (type, balances) => {
  if (type === "All") {
    return Object.values(balances).reduce(
      (acc, val) => acc + parseFloat(val || 0),
      0
    );
  }
  return parseFloat(balances[dueTypeBalances(type)] || 0);
};

// fetch monthly dues report details
export const fetchDuesReport = (
  setCollectionEff,
  setSummaryDueType,
  setSummaryDueHH,
  setTotalUnpaid
) => {
  axios
    .get(`${API_URL}/dues/report`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      setCollectionEff(res.data.collection_efficiency);
      setSummaryDueType(res.data.summary_due_type);
      setSummaryDueHH(res.data.summary_due_household);
      setTotalUnpaid(res.data.total_unpaid_dues);
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};
