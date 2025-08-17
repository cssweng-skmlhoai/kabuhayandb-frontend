import { PDFDocument } from "pdf-lib";
import axios from "axios";
import { toast } from "sonner";
import certification_form from "@/assets/CERTIFICATION.pdf";
import { API_SECRET, API_URL } from "./Constants";

// auto-fill pdf form fields
export const fillPdf = async (member, setPdfUrl) => {
  const formPdfBytes = await fetch(certification_form).then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  try {
    const fullname =
      `${member.first_name} ${member.middle_name} ${member.last_name}`.trim();

    form.getTextField("crn").setText(member?.crn.toString() || "");
    form.getTextField("name").setText(fullname || "");
    form.getTextField("age").setText(member.age?.toString() || "");
    form.getTextField("block").setText(member.block_no?.toString() || "");
    form.getTextField("lot").setText(member.lot_no?.toString() || "");
    form.getTextField("requestor").setText("");
    form.getTextField("purpose").setText("");
    form
      .getTextField("day")
      .setText(new Date(Date.now()).getDate().toString() || "");
    form
      .getTextField("month")
      .setText(
        new Date(Date.now()).toLocaleDateString("en-US", { month: "long" }) ||
          ""
      );
    form
      .getTextField("year")
      .setText(new Date(Date.now()).getFullYear().toString().slice(-2) || "");
  } catch (err) {
    console.warn("Some form fields not found:", err);
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  setPdfUrl(url);
};

// fetch member data
export const fetchCertificateData = (id, setPdfUrl) => {
  axios
    .get(`${API_URL}/certifications/member/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      fillPdf(res.data, setPdfUrl);
    })
    .catch((err) =>
      toast.error(err.response?.data?.error || "Something went wrong")
    );
};

// fetch certification requests
export const fetchCertReqs = (setCerts) => {
  axios
    .get(`${API_URL}/certifications`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then((res) => {
      const certificates = res.data;
      const filteredCerts = certificates.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setCerts(filteredCerts);
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something went wrong");
    });
};

// delete certification request record
export const deleteCertRecord = (
  recordId,
  setCerts,
  setDeleteCertReqDialog,
  setCertRecDialog,
  setRecordId
) => {
  axios
    .delete(`${API_URL}/certifications/${recordId}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    })
    .then(() => {
      setCerts((prev) => prev.filter((c) => c.id !== recordId));
      setDeleteCertReqDialog(false);
      setCertRecDialog(false);
      setRecordId(null);
      toast.success("Certificate Request Record Successfully Deleted");
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something Went Wrong");
    });
};

// open certificate record dialog with details
export const openCertRecDialog = (
  cert,
  setCrn,
  setMemberName,
  setDatePrinted,
  setRecordId,
  setCertRecDialog
) => {
  setCrn(cert.crn);
  setMemberName(`${cert.first_name} ${cert.last_name}`);
  setDatePrinted(cert.created_at);
  setRecordId(cert.id);
  setCertRecDialog(true);
};

// create a certification request record
export const createCertRecord = (
  member_id,
  setAddCertDialog,
  navigate,
  selectedMember,
  setSelectedMember
) => {
  axios
    .post(
      `${API_URL}/certifications`,
      { member_id },
      {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      }
    )
    .then(() => {
      setAddCertDialog(false);
      navigate(`/certification/${selectedMember}`);
      setSelectedMember(null);
      toast.success("Successfully Created Certification Request Record");
    })
    .catch((err) => {
      toast.error(err.response?.data?.error || "Something Went Wrong");
    });
};

// open dialog for adding certification request
export const openAddCertDialog = (id, setSelectedMember, setAddCertDialog) => {
  setSelectedMember(id);
  setAddCertDialog(true);
};
