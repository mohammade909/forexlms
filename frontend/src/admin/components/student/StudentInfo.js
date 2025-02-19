import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchStudentAttendance } from "../../../redux/attandanceSlice";
import { fetchRemarksByStudentId } from "../../../redux/remarksSlice";
import { fetchStudentById } from "../../../redux/studentSlice";
import { getEnrollmentsByStudentID } from "../../../redux/enrollmentSlice";
import { fetchFeesByStudentId } from "../../../redux/feeSlice";
import { useParams } from "react-router-dom";

import FeesTable from "./FeesTable";
export default function StudentInfo() {
  const { studentId } = useParams();
  const dispatch = useDispatch();
  const studentData = useSelector((state) => state.students.student);
  const { enrollments } = useSelector((state) => state.enrollments);
  const { fees } = useSelector((state) => state.fees);

  const studentAttendance = useSelector(
    (state) => state.attendances.attendances
  );
  const studentRemarks = useSelector((state) => state.remarks.remarks);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
      dispatch(fetchStudentAttendance(studentId));
      dispatch(fetchRemarksByStudentId(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    if (studentData?.user) {
      dispatch(getEnrollmentsByStudentID(studentData?.user.user_id));
      dispatch(fetchFeesByStudentId(studentData?.user.user_id));
    }
  }, [dispatch, studentData?.user]);

  const totalAbsences = studentAttendance?.filter(
    (record) => record.status === "absent"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <div className="absolute right-0 top-0 p-4">
          <button
            type="button"
            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* Student Information */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Student Information
        </h2>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <img
              src={studentData?.profile_photo || "/placeholder.png"}
              alt={`${studentData?.first_name} ${studentData?.last_name}`}
              className="h-32 w-32 rounded-md border border-gray-300"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-700">Personal Information</p>
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {studentData?.first_name} {studentData?.middle_name}{" "}
              {studentData?.last_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {studentData?.user?.email}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {studentData?.gender}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{" "}
              {new Date(studentData?.date_of_birth).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span>{" "}
              {studentData?.blood_group}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {studentData?.phone}
            </p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Parents Section */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700">Parents Information</p>
          <ul className="space-y-4">
            {studentData?.parents?.map((parent) => (
              <li key={parent.parent_id}>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {parent.first_name} {parent.middle_name} {parent.last_name}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {parent.phone}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {parent.email}
                </p>
                <p>
                  <span className="font-semibold">Profession:</span>{" "}
                  {parent.profession}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-4" />

        {/* Remarks Section */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700">Remarks</p>
          {studentRemarks?.length ? (
            <ul className="list-disc ml-5 space-y-1">
              {studentRemarks.map((remark) => (
                <li key={remark.remark_id}>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(remark.created_at).toLocaleDateString()}
                  </p>
                  <p>{remark.remark}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No remarks available.</p>
          )}
        </div>

        <hr className="my-4" />

        {/* Attendance Section */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700">Attendance Details</p>
          <p>
            <span className="font-semibold">Total Absences:</span>{" "}
            {totalAbsences || 0}
          </p>
          <ul className="list-disc ml-5">
            {studentAttendance
              ?.filter((record) => record.status === "absent")
              .map((record) => (
                <li key={record.attendance_id}>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(record.attendance_date).toLocaleDateString()}
                  {record.reason && (
                    <>
                      {" "}
                      - <span className="font-semibold">Reason:</span>{" "}
                      {record.reason}
                    </>
                  )}
                </li>
              ))}
          </ul>
        </div>

        <hr className="my-4" />

        {/* Enrollments Section */}
        <div className="mb-6">
          <p className="font-semibold text-gray-700">Enrollments</p>
          <ul className="space-y-4">
            {enrollments?.map((enrollment) => (
              <li key={enrollment.enrollment_id}>
                <p>
                  <span className="font-semibold">Course Name:</span>{" "}
                  {enrollment.course_name}
                </p>
                <p>
                  <span className="font-semibold">Instructor:</span>{" "}
                  {enrollment.instructor_first_name}{" "}
                  {enrollment.instructor_last_name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {enrollment.status}
                </p>
                <p>
                  <span className="font-semibold">Enrollment Date:</span>{" "}
                  {new Date(enrollment.enrollment_date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Class Starting on :</span>{" "}
                  {new Date(enrollment.class_starting_on).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Class Ending on:</span>{" "}
                  {new Date(enrollment.class_ending_on).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-4" />
        <FeesTable fees={fees} />
        <hr className="my-4" />

   
      </div>
    </div>
  );
}
