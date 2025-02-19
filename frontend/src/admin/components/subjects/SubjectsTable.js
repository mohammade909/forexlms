import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  fetchSubjects,
  deleteSubject,
  updateSubject,
  resetState,
} from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
import { fetchTeachers } from "../../../redux/teacherSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const SubjectTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const { subjects, loading, error, message } = useSelector(
    (state) => state.subjects
  );
  const { classes } = useSelector((state) => state.classes);
  const { sections, loading: sectionsLoading } = useSelector((state) => state.sections); // For fetching sections
  const { teachers } = useSelector((state) => state.teachers);

  // Local state
  const [open, setOpen] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    // Fetch subjects and classes
    dispatch(fetchSubjects());
    dispatch(getClasses());
    dispatch(fetchTeachers());
    
    if (classId) {
      dispatch(fetchSectionByClass(classId)); // Fetch sections when classId changes
    }

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error, classId]);

  const handleDelete = (id) => {
    setSubjectId(id);
    setOpen(true);
  };

  const handleEdit = (subject) => {
    setSubjectToEdit(subject);
    setEditModalOpen(true);
  };

  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_name: Yup.string().required("Subject name is required"),
    subject_code: Yup.string().required("Subject code is required"),
    subject_teacher: Yup.string().required("Teacher is required"),
    book_name: Yup.string().required("Book name is required"),
  });

  const handleClassChange = (e, setFieldValue) => {
    const value = e.target.value;
    setClassId(value); // Update local state
    setFieldValue("class_id", value); // Set Formik value
    dispatch(fetchSectionByClass(value)); // Fetch sections based on selected class
  };

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
            <th className="border border-gray-300 px-4 py-2 text-left">Class Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Section Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Subject Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Subject Code</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Teacher</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Book Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {subjects.map((subject) => (
            <tr key={subject.subject_id} className="hover:bg-gray-50 hover:underline hover:cursor-pointer">
              <td className="border border-gray-300 px-4 py-2">{subject.class_name}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.section_name}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject_name}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.subject_code}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.teacher_first_name} {subject.teacher_last_name}</td>
              <td className="border border-gray-300 px-4 py-2">{subject.book_name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button onClick={() => handleEdit(subject)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(subject.subject_id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteSubject}
        message="Are you sure you want to delete this subject?"
        id={subjectId}
      />

      {/* Edit Modal */}
      {editModalOpen && subjectToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Subject</h2>
            <Formik
              initialValues={{
                class_id: subjectToEdit.class_id,
                section_id: subjectToEdit.section_id,
                subject_name: subjectToEdit.subject_name,
                subject_code: subjectToEdit.subject_code,
                subject_teacher: subjectToEdit.subject_teacher,
                book_name: subjectToEdit.book_name,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateSubject({
                    subjectData: { ...values },
                    subjectId: subjectToEdit.subject_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {({ setFieldValue }) => (
                <Form className="grid grid-cols-1 gap-4">
                  {/* Class and Section in one row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">Class</label>
                      <Field
                        as="select"
                        name="class_id"
                        onChange={(e) => handleClassChange(e, setFieldValue)} // Ensure this function fetches sections correctly
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="class_id" component="div" className="text-red-600" />
                    </div>

                    <div>
                      <label className="block text-gray-700">Section</label>
                      <Field
                        as="select"
                        name="section_id"
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select Section</option>
                        {sections.length > 0 ? sections.map((section) => (
                          <option key={section.section_id} value={section.section_id}>
                            {section.section_name}
                          </option>
                        )) : <option value=''>No Section Found!</option>}
                      </Field>
                      <ErrorMessage name="section_id" component="div" className="text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700">Subject Name</label>
                    <Field name="subject_name" className="w-full p-2 border rounded-md" />
                    <ErrorMessage name="subject_name" component="div" className="text-red-600" />
                  </div>

                  <div>
                    <label className="block text-gray-700">Subject Code</label>
                    <Field name="subject_code" className="w-full p-2 border rounded-md" />
                    <ErrorMessage name="subject_code" component="div" className="text-red-600" />
                  </div>

                  <div>
                    <label className="block text-gray-700">Teacher</label>
                    <Field as="select" name="subject_teacher" className="w-full p-2 border rounded-md">
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.teacher_id} value={teacher.teacher_id}>
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="subject_teacher" component="div" className="text-red-600" />
                  </div>

                  <div>
                    <label className="block text-gray-700">Book Name</label>
                    <Field name="book_name" className="w-full p-2 border rounded-md" />
                    <ErrorMessage name="book_name" component="div" className="text-red-600" />
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                      Update Subject
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTable;
