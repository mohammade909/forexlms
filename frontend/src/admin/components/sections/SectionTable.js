import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  fetchSections,
  deleteSection,
  updateSection,
  resetState
} from "../../../redux/sectionSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchTeachers } from '../../../redux/teacherSlice';
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const SectionTable = () => {
  const dispatch = useDispatch();
  const { sections, loading, error , message} = useSelector((state) => state.sections);
  const { classes } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [SectionToEdit, setSectionToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openError, setOpenError] = useState(false)

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(getClasses());
    dispatch(fetchTeachers());
    if(message){
     setOpenSuccess(true)
    }  // Fetch teachers
    if(error){
     setOpenError(true)
    }  // Fetch teachers
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setSectionId(id);
    setOpen(true);
  };

  const handleEdit = (section) => {
    setSectionToEdit(section);
    setEditModalOpen(true);
  };

  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    section_name: Yup.string().required("Section name is required"),
    section_capacity: Yup.number()
      .required("Section capacity is required")
      .positive("Capacity must be positive"),
    teacher_id: Yup.string().required("Teacher is required"),  // New field
  });

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
              Section name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Incharge
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Section Capacity
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {sections.map((section) => (
            <tr
              key={section.section_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {section.class_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {section.section_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {section.teacher_name} {section.teacher_last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {section.section_capacity}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(section.section_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteSection}
        message="Are you sure do you want to delete this section?"
        id={sectionId}
      />

      {/* Edit Modal */}
      {editModalOpen && SectionToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Section</h2>
            <Formik
              initialValues={{
                section_name: SectionToEdit.section_name,
                section_capacity: SectionToEdit.section_capacity,
                teacher_id: SectionToEdit.teacher_id, // Initial teacher
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateSection({
                    sectionData: { ...values },
                    sectionId: SectionToEdit.section_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Section Name</label>
                    <Field
                      name="section_name"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="section_name"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Section Capacity</label>
                    <Field
                      name="section_capacity"
                      type="number"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="section_capacity"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Teacher</label>
                    <Field
                      as="select"
                      name="teacher_id"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option
                          key={teacher.teacher_id}
                          value={teacher.teacher_id}
                        >
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="teacher_id"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Update Section
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

export default SectionTable;
