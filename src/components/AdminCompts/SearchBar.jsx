import React from 'react'
import { Button } from "@/components/ui/button"

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search Member Name",
  variant = "default",
  inputClassName = "",
  buttonClassName = "",
  memList = false
}) => {
  const isCompact = variant === "compact"

  return (
    <div className={`flex gap-3 ${isCompact ? "items-center w-2/5" : ""} ${memList ? "w-2/5" : "w-full"}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`rounded-md w-full ${isCompact ? "px-3 py-1.5 border border-black bg-white" : "p-3 border border-gray-300 bg-customgray2"} ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        className={`font-normal text-md bg-blue-button ${isCompact ? "w-1/4 rounded-sm text-white" : "px-5 py-6 md:px-10"} ${buttonClassName} ${memList ? "text-sm" : ""}`}
        onClick={onSearch}
      >
        {isCompact ? <p className="text-md font-normal">Search</p> : "Search"}
      </Button>
    </div>
  )
}

export default SearchBar