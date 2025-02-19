import React, { useState, useEffect } from "react";
import { deleteTeacher, fetchTeacherByUserId, fetchTeachers } from "../../redux/teacherSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../components/ConfirmPopup";
import TeacherInfo from "./TeacherInfo";
const TeacherInfoTable = () => {
  const dispatch = useDispatch();
  const {auth} = useSelector((state)=>state.auth)
  const { teachers,teacher, loading, error } = useSelector((state) => state.teachers);
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const [teacherView, setTeacherView] = useState();

  useEffect(() => {
    dispatch(fetchTeachers({ detailed: true }));
    if(auth){
      dispatch(fetchTeacherByUserId(auth.user_id))
    }
  }, [dispatch]);

  const handeView = (teacher) => {
    setInfo(true);
    setTeacherView(teacher);
  };

  return (
    <div className="overflow-x-auto">

      <TeacherInfo open={info} setOpen={setInfo} teacherData={teacherView} />
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white">
        <thead className="text-[12px]">
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Employee Code
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Class In Charge
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Subject Handling
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Phone
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {teachers?.filter((item)=>item?.teacher_id === teacher?.teacher_id).map((teacher) => (
            <tr
              key={teacher.teacher_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {teacher.employee_code}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.first_name} {teacher.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.class_name} - {teacher.section_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.subject_name ? teacher.subject_name : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.phone}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handeView(teacher)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteTeacher}
        message="Are you want to delete teacher?"
        id={teacherId}
      />
    </div>
  );
};

export default TeacherInfoTable;
