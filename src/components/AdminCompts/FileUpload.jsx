import React from 'react'

const FileUpload = ({ label, file, onChange, disabled }) => {
  const fileUrl = file && typeof file === "string" ? file : file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col">
      <label>{label}</label>
      {fileUrl ? (
        <img src={fileUrl} alt="Signature" className="w-full max-w-xs border border-gray-300 rounded mb-3" />
      ) : (
        <p className={`text-sm italic text-gray-500 mb-3 pl-2 py-2 rounded-md ${disabled ? "bg-customgray2" : "bg-gray-200"}`}>No signature uploaded.</p>
      )}
      <input type="file" accept="image/*" onChange={onChange} className="hidden" id="signature-upload" disabled={disabled} />
      {!disabled && (
        <label htmlFor="signature-upload"
          className="w-1/2 py-2 rounded-md text-sm bg-blue-button text-white border border-black hover:bg-black duration-200 text-center cursor-pointer mb-3"
        >
          Upload Signature
        </label>
      )}
    </div>
  )
}

export default FileUpload