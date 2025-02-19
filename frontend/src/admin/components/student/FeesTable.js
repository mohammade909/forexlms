import React from "react";

export default function FeesTable({ fees }) {
  return (
    <div className="overflow-x-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Fees Information</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        {/* Table Head */}
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              #
            </th>
          
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Course Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Total Fee
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Paid
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Due
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Payment Method
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">
              Payment Date
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {fees.map((fee, index) => (
            <tr
              key={fee.fee_id}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
            
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {index+1}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {fee.course_name}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                ${fee.total_fee}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                ${fee.paid}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                ${fee.due}
              </td>
              <td
                className={`border border-gray-300 px-4 py-2 text-sm font-semibold ${
                  fee.status === "paid"
                    ? "text-green-600"
                    : fee.status === "partial"
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {fee.status}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {fee.payment_method}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                {new Date(fee.payment_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
