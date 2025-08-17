import React from 'react'

const TextInput = ({ label, value, onChange, disabled, ...rest }) => {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        className={`mb-3 p-2 text-sm rounded-sm ${disabled ? "bg-customgray2" : "bg-gray-200"}`}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
    </div>
  )
}

export default TextInput