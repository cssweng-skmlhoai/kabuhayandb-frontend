import TopNav from "@/components/AdminCompts/TopNav";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import certification_form from "@/assets/CERTIFICATION.pdf";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Link, useParams } from "react-router-dom";
import Sidebar from "@/components/AdminCompts/Sidebar";
import axios from "axios";
import { LiaFileDownloadSolid } from "react-icons/lia";

const Certificate = () => {
  const { id } = useParams();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const fillPdf = async (member) => {
    const formPdfBytes = await fetch(certification_form).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    try {
      const fullname = `${member.first_name} ${member.middle_name} ${member.last_name}`.trim();

      form.getTextField("name").setText(fullname || "");
      form.getTextField("age").setText(member.age.toString() || "");
      form.getTextField("block").setText(member.block_no.toString() || "");
      form.getTextField("lot").setText(member.lot_no.toString() || "");
      form.getTextField("requestor").setText("");
      form.getTextField("purpose").setText("");
      form.getTextField("day").setText(new Date(Date.now()).getDate().toString() || "");
      form.getTextField("month").setText(new Date(Date.now()).toLocaleDateString('en-US', { month: 'long' }) || "");
      form.getTextField("year").setText(new Date(Date.now()).getFullYear().toString().slice(-2) || "");
    } catch (err) {
      console.warn("Some form fields not found:", err);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API_URL}/members/info/${id}`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      }
    }).then((res) => {
      console.log(res.data);
      fillPdf(res.data);
    }).catch(err => console.log(err));
  }, []);

  const handlePrint = () => {
    const iframe = document.getElementById("pdf-frame");
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  };

  return (
    <div>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="py-5 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-[700px] xl:bg-white xl:gap-0 xl:px-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Member Certification</p>
                <p>Issue a Certificate for a Member</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:gap-10 xl:px-10 xl:py-10">
              <div className="flex justify-between">
                <Link
                  to="/searchMemberCert"
                  className="cursor-pointer px-3 rounded-md border border-black flex items-center gap-2 w-30 md:w-40 md:gap-8"
                >
                  <IoIosArrowRoundBack className="size-10" />
                  <p className="font-poppins text-lg">Back</p>
                </Link>

                <button className="text-lg cursor-pointer px-3 py-2 rounded-md border border-black flex items-center gap-2 w-30 md:w-40 md:gap-8" onClick={handlePrint}>
                  <LiaFileDownloadSolid className="size-7" />
                  <p>Print</p>
                </button>
              </div>

              <div>
                {pdfUrl ? (
                  loadError ? (
                    <div className="text-center mt-5">
                      Preview not supported.{" "}
                      <span
                        onClick={() => window.open(pdfUrl, "_blank")}
                        className="text-blue-500 hover:text-blue-800 cursor-pointer"
                      >
                        Open PDF
                      </span>
                    </div>
                  ) : (
                    <iframe
                      id="pdf-frame"
                      src={pdfUrl}
                      width="100%"
                      height="600"
                      title="Filled PDF"
                      onError={() => setLoadError(true)}
                    />
                  )
                ) : (
                  <div className="text-gray-500">Loading PDF…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;