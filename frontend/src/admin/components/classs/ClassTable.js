import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  getClasses,
  deleteClass,
  updateClass,
  resetState,
} from "../../../redux/classSlice"; // Assuming actions are set in Redux
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { fetchTeachers } from "../../../redux/teacherSlice";
const ClassTable = () => {
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.teachers);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { classes, loading, error, message } = useSelector(
    (state) => state.classes
  ); // Assuming classes are managed in redux state
  const [open, setOpen] = useState(false); // For confirmation popup
  const [classId, setClassId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal
  const [classToEdit, setClassToEdit] = useState(null); // To store class details for editing

  useEffect(() => {
    dispatch(getClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleDelete = (id) => {
    setClassId(id);
    setOpen(true);
  };

  const handleEdit = (classItem) => {
    setClassToEdit(classItem);
    setEditModalOpen(true);
  };

  useEffect(() => {
    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    class_name: Yup.string().required("Class name is required"),
    class_starting_on: Yup.date().required("Starting date is required"),
    class_ending_on: Yup.date().required("Ending date is required"),
  });

  return (
    <div className="overflow-x-auto">
      {/* Class Table */}
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message="Class Updated Successfully"
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
              Instructor
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Course Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Enrolled
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Starting On
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ending On
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {classes.map((classItem) => (
            <tr
              key={classItem.class_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {classItem.class_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classItem.instructor_first_name
                  ? `${classItem.instructor_first_name} ${classItem.instructor_last_name}`
                  : "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classItem.course_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classItem.enrolled_count}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(classItem.class_starting_on).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(classItem.class_ending_on).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  // onClick={() => handleView(classItem)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(classItem)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(classItem.class_id)}
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
        actionFunction={deleteClass}
        message="Are you sure you want to delete this class?"
        id={classId}
      />

      {/* Edit Modal */}
      {editModalOpen && classToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Class</h2>
            <Formik
              initialValues={{
                class_name: classToEdit.class_name,
                class_starting_on: classToEdit.class_starting_on.split("T")[0],
                class_ending_on: classToEdit.class_ending_on.split("T")[0],
                instructor_id: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateClass({
                    classData: { ...values },
                    classId: classToEdit.class_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Class Name</label>
                    <Field
                      name="class_name"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="class_name"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Teacher</label>
                    <Field
                      as="select"
                      name="instructor_id"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="" label="Select teacher" />
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
                      name="instructor_id"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  {/* <div className="mb-4">
                    <label className="block text-gray-700">Select Course</label>
                    <Field
                      as="select" // Render the Field as a select tag
                      name="course_id"
                      className="w-full p-2 border rounded-md"
                      onChange={(e) => {
                        const selectedCourseId = e.target.value;
                        setFieldValue("course_id", selectedCourseId); // Update Formik state
                        // Update local courseDetails state
                      }}
                    >
                      <option value="" label="Select a course">
                        Select a course
                      </option>
                      {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </option>
                      ))}
                    </Field>
                  </div> */}
               
                  <div>
                    <label className="block text-gray-700">Starting On</label>
                    <Field
                      name="class_starting_on"
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="class_starting_on"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Ending On</label>
                    <Field
                      name="class_ending_on"
                      type="date"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="class_ending_on"
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
                      Update Class
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

export default ClassTable;
