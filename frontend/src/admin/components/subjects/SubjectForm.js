import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createSubject, resetState } from "../../../redux/subjectSlice"; // Update this import based on your structure
import { getClasses } from "../../../redux/classSlice"; // Adjust as necessary
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // Adjust as necessary
import { fetchTeachers } from "../../../redux/teacherSlice"; // Adjust as necessary
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const SubjectForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(""); // State to store selected class ID
  const { loading, error, message } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { sections } = useSelector((state) => state.sections);
  const { teachers } = useSelector((state) => state.teachers);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_name: Yup.string().required("Subject name is required"),
    subject_code: Yup.string().required("Subject code is required"),
    subject_teacher: Yup.string().required("Subject teacher is required"),
    book_name: Yup.string().required("Book name is required"),
  });

  useEffect(() => {
    // Fetch classes when the component mounts
    dispatch(getClasses());
    dispatch(fetchTeachers())
    // Show success or error modals based on message or error
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  // Handle class selection to fetch sections
  const handleClassChange = (classId, setFieldValue) => {
    setSelectedClassId(classId); // Update state with selected class ID
    setFieldValue("class_id", classId); // Set class_id in Formik
    setFieldValue("section_id", ""); // Reset section_id
    dispatch(fetchSectionByClass(classId)); // Fetch sections based on selected class
  };

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
          class_id: "",
          section_id: "",
          subject_name: "",
          subject_code: "",
          subject_teacher: "",
          book_name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(createSubject(values));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            {/* Subject Details Section - Full Width */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Subject Details</h2>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-gray-700">Class</label>
                      <Field
                        as="select"
                        name="class_id"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => handleClassChange(e.target.value, setFieldValue)}
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="class_id"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Section</label>
                      <Field as="select" name="section_id" className="w-full p-2 border rounded-md">
                        <option value="">Select Section</option>
                        {sections.map((section) => (
                          <option key={section.section_id} value={section.section_id}>
                            {section.section_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="section_id"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Subject Name</label>
                      <Field
                        name="subject_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="subject_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Subject Code</label>
                      <Field
                        name="subject_code"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="subject_code"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Subject Teacher</label>
                      <Field as="select" name="subject_teacher" className="w-full p-2 border rounded-md">
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.teacher_id} value={teacher.teacher_id}>
                            {teacher.first_name} {teacher.last_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="subject_teacher"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Book Name</label>
                      <Field
                        name="book_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="book_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="mt-10" />
              <div className="flex">
                <button
                  type="submit"
                  className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SubjectForm;
