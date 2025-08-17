import React from 'react'

const DataTable = ({ columns = [], data = [], onRowClick = null, emptyMessage = "No data available.", className = "", center = false, rowClassName = "", hoverEffect = true, certs = false }) => {
  return (
    <table className={`w-full border-separate text-sm ${className} ${certs ? "border-spacing-y-4" : "border-spacing-y-3"}`}>
      <thead>
        <tr className={center ? "text-center" : "text-left"}>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`px-4 py-2 ${col.className || ""} ${certs ? "font-semibold" : "font-bold"}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-4 text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`bg-gray-200 rounded-md ${hoverEffect ? "hover:bg-gray-300 duration-200 cursor-pointer" : ""} shadow-md ${rowClassName} ${certs && "text-center"}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`${col.tdClassName || ""} ${certs ? "px-4 py-5" : "px-4 py-2"}`}
                >
                  {typeof col.render === "function"
                    ? col.render(row)
                    : row[col.key]}
                </td>
              ))}
              {onRowClick && (
                <td className="text-gray-500 text-2xl font-light pr-2 rounded-r-md">
                  &rsaquo;
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default DataTable