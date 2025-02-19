import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createSection, resetState } from "../../../redux/sectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { getClasses } from "../../../redux/classSlice";
import { fetchTeachers } from "../../../redux/teacherSlice";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const SectionForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);

  const { loading, error, message } = useSelector((state) => state.sections);
  const { classes } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(getClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    section_name: Yup.string().required("Section name is required"),
    section_capacity: Yup.number()
      .required("Section capacity is required")
      .positive("Capacity must be positive"),
    class_id: Yup.string().required("Class is required"),
    teacher_id: Yup.string().required("Teacher is required"),
  });

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

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
          section_name: "",
          section_capacity: "",
          class_id: "",
          teacher_id: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(createSection(values));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Section Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Section Name */}
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

                {/* Section Capacity */}
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

                {/* Class Dropdown */}
                <div>
                  <label className="block text-gray-700">Class</label>
                  <Field
                    as="select"
                    name="class_id"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="" label="Select class" />
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

                {/* Teacher Dropdown */}
                <div>
                  <label className="block text-gray-700">Teacher</label>
                  <Field
                    as="select"
                    name="teacher_id"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="" label="Select teacher" />
                    {teachers.map((teacher) => (
                      <option key={teacher.teacher_id} value={teacher.teacher_id}>
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
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
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

export default SectionForm;
