import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createClass, resetState } from "../../../redux/classSlice";
import { fetchCourses } from "../../../redux/courseSlice";
import { fetchTeachers } from "../../../redux/teacherSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
const ClassForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState();
  const [openError, setOpenError] = useState(false);
  const { teachers } = useSelector((state) => state.teachers);
  const { loading, error, message } = useSelector((state) => state.classes);
  const { courses } = useSelector((state) => state.courses);
  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    class_name: Yup.string().required("Class name is required"),
    class_starting_on: Yup.date().required("Class Starting is required"),
    class_ending_on: Yup.date().required("Class Ending is required"),
  });

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  return (
    <>
      <SuccessModal
        open={open}
        setOpen={setOpen}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <Formik
        initialValues={{
          class_name: "",

          class_starting_on: "",

          class_ending_on: "",
          course_id: "",
          instructor_id: "",

          // parent information
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(createClass(values));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            {" "}
            {/* Apply text-xs to reduce font size to 12px */}
            {/* Personal Details Section - Full Width */}
            <div className=" bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Class Details</h2>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* First Name, Last Name, Middle Name */}

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
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Select Course
                      </label>
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
                          <option
                            key={course.course_id}
                            value={course.course_id}
                          >
                            {course.course_name}
                          </option>
                        ))}
                      </Field>
                    </div>
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
                  </div>
                </div>
              </div>
              {/* Profile Photo */}

              <hr className="mt-10" />
              <div className="flex">
                <button
                  type="submit"
                  className="bg-blue-500  text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
            {/* Submit Button */}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ClassForm;
