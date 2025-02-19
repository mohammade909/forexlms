import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import StudentInfo from "./StudentInfo";
import { fetchStudents, deleteStudent } from "../../../redux/studentSlice";
import { fetchTeacherByUserId } from "../../../redux/teacherSlice";
import { getInstructorClasses } from "../../../redux/classSlice";
import { Link } from "react-router-dom";
const StudentTable = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { teacher } = useSelector((state) => state.teachers); // Teacher data from redux
  const { students, loading, error } = useSelector((state) => state.students); // Students data from redux
  const [info, setInfo] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState();
  const {
    classes,
    loading: classLoading,
    error: classError,
  } = useSelector((state) => state.classes);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    if (auth) {
      dispatch(fetchTeacherByUserId(auth.user_id)); 
    }
  }, [dispatch, auth]);

  useEffect(() => {
    if (teacher) {
      dispatch(getInstructorClasses(teacher.instructor_id));
    }
  }, [dispatch, teacher]);

  const handleViewStudent = (studentData) => {
    setInfo(true);
    setStudent(studentData);
  };

  useEffect(() => {
    if (selectedClass) {
      dispatch(
        fetchStudents({
          class_id: selectedClass,
          page: 1,
          limit: 20,
        })
      );
    }
  }, [selectedClass, dispatch]);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-wrap items-center mb-4 gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-600">Select Class:</label>
          <StudentInfo open={info} setOpen={setInfo} studentData={student}/>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="">-- Select Class --</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Student Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white">
        <thead className="text-[12px]">
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Roll Number
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Full Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Address
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Parent
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Phone
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
             Fee Amount
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Paid Amount
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Due Amount
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {students.map((student) => (
            <tr
              key={student.student_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {student.student_id}
              </td>{" "}
              {/* Assuming Roll Number is student_id */}
              <td className="border border-gray-300 px-4 py-2">
                {student.first_name} {student.middle_name} {student.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.street_address
                  ? student.street_address + student.city
                  : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.parent.first_name} {student.parent.middle_name}{" "}
                {student.parent.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.phone ? student.phone : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.fee ? student?.fee?.fee_amount : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.fee ? student?.fee?.paid: "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.fee ? student?.fee?.due: "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={()=>handleViewStudent(student)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
