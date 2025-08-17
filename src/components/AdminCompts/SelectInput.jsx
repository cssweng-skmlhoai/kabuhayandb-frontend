import React from 'react'

const SelectInput = ({ label, value, onChange, options = [], disabled, placeholder = "Options", placeholderTop = "32px" }) => {
  return (
    <div className="flex flex-col relative mb-3">
      <label>{label}</label>
      <select
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required
        className={`p-2 text-sm rounded-sm w-full ${disabled ? "bg-customgray2" : "bg-gray-200"}`}
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {!value && (
        <span className={`absolute left-3 top-[${placeholderTop}] text-sm opacity-50 pointer-events-none z-0`}>
          {placeholder}
        </span>
      )}
    </div>
  )
}

export default SelectInput