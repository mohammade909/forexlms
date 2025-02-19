import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEnrollments } from "../../../redux/enrollmentSlice"; // Adjust the path

const Fees = () => {
  const dispatch = useDispatch();
  const { enrollments, error } = useSelector((state) => state.enrollments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);

  useEffect(() => {
    dispatch(getAllEnrollments());
  }, [dispatch]);

  useEffect(() => {
    const filtered = enrollments.filter((enrollment) => {
      const matchesSearch =
        `${enrollment.first_name} ${enrollment.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCourse =
        selectedCourse === "" || enrollment.course_name === selectedCourse;
      return matchesSearch && matchesCourse;
    });

    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm, selectedCourse]);

  // Get unique courses for filtering
  const uniqueCourses = [...new Set(enrollments.map((e) => e.course_name))];

  // Calculate totals
  const totalFeeAmount = filteredEnrollments.reduce(
    (total, enrollment) => total + parseFloat(enrollment.fee_amount || 0),
    0
  );
  const totalPaid = filteredEnrollments.reduce(
    (total, enrollment) => total + parseFloat(enrollment.paid || 0),
    0
  );
  const totalDue = filteredEnrollments.reduce(
    (total, enrollment) => total + parseFloat(enrollment.due || 0),
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Enrollments</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Fee Amount</h3>
          <p className="text-2xl font-bold text-blue-500">${totalFeeAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Paid</h3>
          <p className="text-2xl font-bold text-green-500">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Due</h3>
          <p className="text-2xl font-bold text-red-500">${totalDue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-1/2"
        />
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-1/2"
        >
          <option value="">All Courses</option>
          {uniqueCourses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Enrollments Table */}
      {filteredEnrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 text-xs">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Student</th>
              <th className="border border-gray-300 px-4 py-2">Course</th>
              <th className="border border-gray-300 px-4 py-2">Fee Amount</th>
              <th className="border border-gray-300 px-4 py-2">Paid</th>
              <th className="border border-gray-300 px-4 py-2">Due</th>
              <th className="border border-gray-300 px-4 py-2">
                Enrollment Date
              </th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.map((enrollment, index) => (
              <tr key={enrollment.enrollment_id} className="bg-white">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {enrollment.first_name} {enrollment.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {enrollment.course_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${enrollment.fee_amount}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${enrollment.paid}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${enrollment.due}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(enrollment.enrollment_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {enrollment.enrollment_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Fees;
