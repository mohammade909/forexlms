import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createCertificate } from "../../../redux/certificateSlice"; // Action to issue certificate
import { fetchStudents } from "../../../redux/studentSlice";
import { getcourseByStudent } from "../../../redux/courseSlice"; // Action to fetch courses by student

const IssueCertificateForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { courses } = useSelector((state) => state.courses);

  const [selectedStudent, setSelectedStudent] = useState(""); // Store selected student
  const [selectedCourse, setSelectedCourse] = useState(""); // Store selected course

  // Fetch students on component mount
  useEffect(() => {
    dispatch(fetchStudents({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Fetch courses when student is selected
  useEffect(() => {
    if (selectedStudent) {
      dispatch(getcourseByStudent(selectedStudent)); // Get courses based on selected student
    }
  }, [dispatch, selectedStudent]);

  const validationSchema = Yup.object({
    student_id: Yup.number().required("Student is required"),
    course_id: Yup.number().required("Course is required"),
    certificate_code: Yup.string().required("Certificate code is required"),
    issued_date: Yup.date().required("Issued date is required"),
    pdf_url: Yup.mixed()
      .required("PDF file is required")
      .test("fileType", "Unsupported file type", (value) => {
        return value && ["application/pdf"].includes(value.type); // Only allow PDF files
      }),
  });

  const handleSubmit = (values) => {
    // Assuming the file is uploaded to the server and you receive a URL to save in the database
    dispatch(createCertificate(values));
    onClose(); // Close the modal after submission
  };

  return (
    <div className="rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">
        Issue a New Certificate
      </h2>

      <Formik
        initialValues={{
          student_id: "",
          course_id: "",
          certificate_code: "",
          issued_date: "",
          pdf_url: null, // Set as null initially
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="student_id"
                className="block text-sm font-medium text-gray-700"
              >
                Student
              </label>
              <Field
                as="select"
                name="student_id"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                onChange={(e) => {
                  const studentId = e.target.value;
                  setSelectedStudent(studentId);
                  setFieldValue("student_id", studentId); // Set the student_id in Formik
                }}
              >
                <option value="">Select a student</option>
                {students &&
                  students.map((student) => (
                    <option key={student.user_id} value={student.user_id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
              </Field>
              {errors.student_id && touched.student_id && (
                <div className="text-red-600 text-sm">{errors.student_id}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="course_id"
                className="block text-sm font-medium text-gray-700"
              >
                Course
              </label>
              <Field
                as="select"
                name="course_id"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setFieldValue("course_id", e.target.value); // Set the course_id in Formik
                }}
                disabled={!selectedStudent} // Disable if no student is selected
              >
                <option value="">Select a course</option>
                {courses &&
                  courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
              </Field>
              {errors.course_id && touched.course_id && (
                <div className="text-red-600 text-sm">{errors.course_id}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="certificate_code"
                className="block text-sm font-medium text-gray-700"
              >
                Certificate Code
              </label>
              <Field
                type="text"
                name="certificate_code"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.certificate_code && touched.certificate_code && (
                <div className="text-red-600 text-sm">
                  {errors.certificate_code}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="issued_date"
                className="block text-sm font-medium text-gray-700"
              >
                Issued Date
              </label>
              <Field
                type="date"
                name="issued_date"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.issued_date && touched.issued_date && (
                <div className="text-red-600 text-sm">{errors.issued_date}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="pdf_url"
                className="block text-sm font-medium text-gray-700"
              >
                Certificate PDF
              </label>
              <input
                type="file"
                name="pdf_url"
                accept="application/pdf"
                onChange={(e) =>
                  setFieldValue("pdf_url", e.currentTarget.files[0])
                }
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              {errors.pdf_url && touched.pdf_url && (
                <div className="text-red-600 text-sm">{errors.pdf_url}</div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded"
              >
                Issue Certificate
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IssueCertificateForm;
