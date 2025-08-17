import React from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, setCurrentPage, totalItems, itemsPerPage = 5, showRange = true, size = "md", className = "", certs = false, dues = false }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfFirst = (currentPage - 1) * itemsPerPage
  const indexOfLast = indexOfFirst + itemsPerPage

  if (totalItems <= itemsPerPage) return null

  const sizeStyles = {
    sm: "size-6 text-sm",
    md: "px-2 py-1 text-sm",
    lg: "size-8 text-lg",
  }

  const buttonClass = `border border-gray-400 rounded hover:bg-gray-300 duration-200 ${sizeStyles[size]}`

  return (
    <div className={`flex justify-between items-center ${className} ${certs ? "w-full mt-0" : "mt-5"}`}>
      {showRange && (
        <p className="text-sm text-gray-600">
          {totalItems === 0
            ? "0 results"
            : `${indexOfFirst + 1}-${Math.min(indexOfLast, totalItems)} of ${totalItems}`}
        </p>
      )}
      <div className={`flex items-center ${dues ? "gap-7" : "gap-3"}`}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`${buttonClass} ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronLeft />
        </button>
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default Pagination