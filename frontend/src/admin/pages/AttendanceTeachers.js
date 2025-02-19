import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeachers } from "../../redux/teacherSlice";
import { getClasses } from "../../redux/classSlice";
import { fetchSectionByClass } from "../../redux/sectionSlice";
import { CheckIcon } from "@heroicons/react/24/outline";
import { FaBan } from "react-icons/fa";
import {
  markTeacherAbsent,
  fetchAllTeacherAttendance,
  clearAttendanceState,
} from "../../redux/attandanceSlice";
import SuccessModal from "../components/SuccessModal";
const AttendanceTeachers = () => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teachers);
  const { attendances, success } = useSelector((state) => state.attendances);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTecher, setCurrentTeacher] = useState(null); // Store the selected student
  const [openSuccess, setOpenSuccess] = useState(false); // Store attendance data

  const today = new Date();
  const todayDate = today.getDate();

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getDatesOfMonth = (month, year) => {
    const days = [];
    for (let day = todayDate; day <= daysInMonth(month, year); day++) {
      const date = new Date(year, month - 1, day);
      const weekday = date.toDateString().slice(0, 3);
      days.push({
        date: date.getDate(),
        weekday: weekday,
      });
    }
    return days;
  };

  const [dates, setDates] = useState(getDatesOfMonth(month, year));

  useEffect(() => {
    dispatch(fetchAllTeacherAttendance());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    setDates(getDatesOfMonth(month, year));
    setPage(0);
    if (success) {
      setOpenSuccess(true);
    }
  }, [month, year, success]);

  const currentDates = dates.slice(page * 7, page * 7 + 7);

  const nextPage = () => {
    if ((page + 1) * 7 < dates.length) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleCheckboxChange = (teacher) => {
    setCurrentTeacher(teacher);
    setModalOpen(true);
  };

  const handleAttendanceSubmit = ({ reason }) => {
    const attendanceDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const status = "absent"; // Set status as "absent" since the checkbox was checked

    const attendanceRecord = {
      teacher_id: currentTecher.teacher_id, // Ensure you get student_id from currentTecher
      attendance_date: attendanceDate,
      status,
      reason,
    };

    dispatch(markTeacherAbsent(attendanceRecord));

    // Resetting the state and closing the modal
    setModalOpen(false);
    setCurrentTeacher(null);
  };

  return (
    <div className="attendance-container p-4 text-[12px] font-normal">
      <h1 className="text-lg font-bold mb-4 text-gray-700">
        AttendanceTeachers Management
      </h1>
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message={"AttendanceTeachers updated successfully"}
        reset={clearAttendanceState}
      />
      {/* Month, Year, Class, and Section Selectors */}
      <div className="flex flex-wrap items-center mb-4 gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Select Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Select Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded p-2 text-sm"
            min="1900"
            max="2100"
          />
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mb-4">
        <button
          onClick={prevPage}
          className="bg-gray-200 p-2 rounded text-sm"
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="font-bold text-gray-600 text-sm">
          Showing Days {page * 7 + 1} - {Math.min((page + 1) * 7, dates.length)}
        </span>
        <button
          onClick={nextPage}
          className="bg-gray-200 p-2 rounded text-sm"
          disabled={(page + 1) * 7 >= dates.length}
        >
          Next
        </button>
      </div>

      {/* AttendanceTeachers Table */}
      <div className="overflow-x-auto">
        <table   className="table-auto w-full border-collapse border border-gray-700"
    style={{ tableLayout: "fixed", width: "100%" }}>
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200 text-left">Teachers</th>
              {currentDates.map((date, index) => (
                <th
                  key={index}
                  className={`border p-2 text-center ${
                    date.date === today.getDate() // Check if the day matches today's date
                      ? "border-blue-200 bg-blue-100" // Make the current date column blue
                      : date.weekday === "Sun" // Check if the weekday is Sunday
                      ? "border-red-200 bg-red-100" // Make Sunday columns red
                      : "bg-gray-200"
                  }`}
                >
                  {date.date} {date.date === today.getDate() ? "Today" : ""}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border p-2 bg-white text-left">Day</th>
              {currentDates.map((date, index) => (
                <th
                  key={index}
                  className={`border p-2 text-center ${
                    date.date === today.getDate()
                      ? "border-blue-400 bg-blue-50"
                      : date.weekday === "Sun"
                      ? "border-red-400 bg-red-50"
                      : "bg-white"
                  }`}
                >
                  {date.weekday}
                </th>
              ))}
            </tr>
          </thead>
          {/* <tbody>
            {teachers.map((teacher) => {
              // Find the attendance object that matches the current student
              const studentAttendance = attendances.find(
                (attendance) => attendance.teacher_id === teacher.teacher_id
              );

              return (
                <tr key={teacher.teacher_id}>
                  <td className="border p-2 bg-white text-gray-700 text-sm">
                    {teacher.first_name} {teacher.last_name}
                  </td>
                  {currentDates.map((date, index) => {
                    // Check if attendance date matches the current date in the column
                    const isAttendanceDate =
                      studentAttendance &&
                      new Date(studentAttendance.attendance_date).getDate() ===
                        date.date;

                    return (
                      <td
                        key={index}
                        className={`border p-2 ${
                          date.date === today.getDate()
                            ? "border-blue-400 bg-blue-50"
                            : date.weekday === "Sun"
                            ? "border-red-400 bg-red-50"
                            : "bg-white"
                        }`}
                      >
                        {date.date === today.getDate() ? (
                          <div className="flex justify-around items-center">
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(teacher)}
                              className="form-checkbox h-4 w-4 text-green-600"
                              checked={isAttendanceDate}
                            />
                            {studentAttendance?.status === "absent" ? (
                              <label>
                                {studentAttendance?.reason || "Absent"}
                              </label>
                            ) : (
                              <label>Absent</label>
                            )}
                          </div>
                        ) : date.weekday === "Sun" ? (
                          <FaBan className="h-4 w-4 text-red-600" />
                        ) : isAttendanceDate ? (
                          <label>
                            {studentAttendance?.status === "absent"
                              ? studentAttendance?.reason
                              : "Present"}
                          </label>
                        ) : (
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody> */}
          <tbody>
            {teachers.map((teacher) => {
              // Find all absence records for the current teacher
              const teacherAbsences = attendances.filter(
                (attendance) =>
                  attendance.teacher_id === teacher.teacher_id &&
                  attendance.status === "absent"
              );

              return (
                <tr key={teacher.teacher_id}>
                  <td className="border p-2 bg-white text-gray-700 text-sm">
                    {teacher.first_name} {teacher.last_name}
                    <span className="text-red-500">
                      {" "}
                      ({teacherAbsences.length} absent)
                    </span>
                  </td>
                  {currentDates.map((date, index) => {
                    // Check if attendance date matches the current date in the column
                    const isAttendanceDate = teacherAbsences.some(
                      (absence) =>
                        new Date(absence.attendance_date).getDate() ===
                        date.date
                    );

                    return (
                      <td
                        key={index}
                        className={`border p-2 ${
                          date.date === today.getDate()
                            ? "border-blue-400 bg-blue-50"
                            : date.weekday === "Sun"
                            ? "border-red-400 bg-red-50"
                            : "bg-white"
                        }`}
                      >
                        {date.date === today.getDate() ? (
                          <div className="flex justify-around items-center">
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(teacher)}
                              className="form-checkbox h-4 w-4 text-green-600"
                              checked={isAttendanceDate}
                            />
                            {isAttendanceDate ? (
                              <label>Absent</label>
                            ) : (
                              <CheckIcon className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        ) : date.weekday === "Sun" ? (
                          <FaBan className="h-4 w-4 text-red-600" />
                        ) : isAttendanceDate ? (
                          <label>Absent</label>
                        ) : (
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Reason for Absence</h2>
            <textarea
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter reason..."
              onChange={(e) =>
                setCurrentTeacher((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  handleAttendanceSubmit({
                    reason: currentTecher?.reason || "",
                  });
                }}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Submit
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white rounded px-4 py-2 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTeachers;
