import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubjectsByTeacher,
  resetState,
} from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
import { fetchTeacherByUserId } from "../../../redux/teacherSlice";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const SubjectTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const { subjects, loading, error, message } = useSelector(
    (state) => state.subjects
  );
  const { auth } = useSelector((state) => state.auth);
  const { teacher } = useSelector((state) => state.teachers);
// For fetching sections

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    // Fetch teacher info and classes once
    dispatch(getClasses());
    dispatch(fetchTeacherByUserId(auth?.user_id));
  }, [dispatch, auth?.user_id]);

  useEffect(() => {
    if (teacher?.teacher_id) {
      dispatch(fetchSubjectsByTeacher(teacher.teacher_id));
    }
  }, [dispatch, teacher]);

  useEffect(() => {
    if (classId) {
      dispatch(fetchSectionByClass(classId)); // Fetch sections when classId changes
    }
  }, [dispatch, classId]);

  useEffect(() => {
    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);



  return (
    <div className="overflow-x-auto">
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white">
        <thead className="text-[12px]">
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Class Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Section Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
            Handling Subject
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Subject Code
            </th>
          
            <th className="border border-gray-300 px-4 py-2 text-left">
              Book Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {subjects.map((subject) => (
            <tr
              key={subject.subject_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {subject.class_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.section_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subject_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subject.subject_code}
              </td>
             
              <td className="border border-gray-300 px-4 py-2">
                {subject.book_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  // onClick={() => handleEdit(subject)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
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

export default SubjectTable;
