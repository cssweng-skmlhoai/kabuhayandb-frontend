import React from 'react'

const ReportTable = ({ columns = [], data = [], className = "" }) => {
  return (
    <table className={`w-full border border-black border-separate rounded-md text-center ${className}`}>
      <thead className="bg-customgray2">
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              className={`border-black px-4 py-2 ${index !== columns.length - 1 ? "border-r" : ""} border-b ${col.className || ""}`}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={row.id || row.household_id || row.due_type || rowIdx}>
            {columns.map((col, colIdx) => {
              const isLastRow = rowIdx === data.length - 1;
              const isLastCol = colIdx === columns.length - 1;

              const borderRight = isLastCol ? "" : "border-r";
              const borderBottom = isLastRow ? "" : "border-b";

              return (
                <td
                  key={colIdx}
                  className={`border-black px-4 py-2 bg-white ${borderRight} ${borderBottom} ${col.tdClassName || ""}`}
                >
                  {typeof col.render === "function" ? col.render(row) : row[col.key]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ReportTable