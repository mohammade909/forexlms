import React, { useState, useEffect } from "react";
import { deleteTeacher, fetchTeachers } from "../../redux/teacherSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../components/ConfirmPopup";
import TeacherInfo from "./TeacherInfo";

const TeacherTable = () => {
  const dispatch = useDispatch();
  const { teachers, loading, error } = useSelector((state) => state.teachers);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [teacher, setTeacher] = useState();

  const handleDelete = (id) => {
    setTeacherId(id);
    setOpen(true);
  };

  const handleView = (teacher) => {
    setInfo(true);
    setTeacher(teacher);
  };

  useEffect(() => {
    dispatch(fetchTeachers({ detailed: true }));
  }, [dispatch]);

  return (
    <div className="overflow-x-auto">
      <TeacherInfo open={info} setOpen={setInfo} teacherData={teacher} />
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white">
        <thead className="text-[12px]">
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Employee Code</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Class In Charge</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Course Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {teachers?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center px-4 py-2 text-gray-500">
                No teachers available.
              </td>
            </tr>
          ) : (
            teachers?.filter((item)=>item?.user?.user_type !=='Admin').map((teacher) => (
              <tr
                key={teacher.teacher_id}
                className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.employee_code || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.first_name} {teacher.middle_name || ""} {teacher.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher?.classes?.length > 0
                    ? teacher.classes.map((cls) => cls.class_name).join(", ")
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.classes.length > 0
                    ? teacher.classes.map((cls) => cls.course.course_name).join(", ")
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.phone || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleView(teacher)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.teacher_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteTeacher}
        message="Are you sure you want to delete this teacher?"
        id={teacherId}
      />
    </div>
  );
};

export default TeacherTable;
