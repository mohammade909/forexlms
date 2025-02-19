import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjects } from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
import { addSubjectfields, resetState } from "../../../redux/markFieldSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const FieldsForm = () => {
  const dispatch = useDispatch();

  // Redux state
  const { subjects } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { sections } = useSelector((state) => state.sections);
  const { error, message } = useSelector((state) => state.fields);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    dispatch(getClasses());
    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_id: Yup.string().required("Subject is required"),
    field_name: Yup.string().required("Field name is required"),
  });

  const handleClassChange = (e, setFieldValue) => {
    const value = e.target.value;
    setClassId(value);
    setFieldValue("class_id", value);
    dispatch(fetchSectionByClass(value));
  };

  const handleSectionChange = (e, setFieldValue) => {
    const value = e.target.value;
    setSectionId(value);
    setFieldValue("section_id", value);
    dispatch(fetchSubjects({ class_id: classId, section_id: sectionId }));
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

      <h2 className="text-lg font-semibold mb-4">Add Field</h2>
      <Formik
        initialValues={{
          class_id: "",
          section_id: "",
          subject_id: "",
          field_name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(addSubjectfields({ ...values }));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Field Details</h2>

              {/* Class and Section in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Class</label>
                  <Field
                    as="select"
                    name="class_id"
                    onChange={(e) => handleClassChange(e, setFieldValue)}
                    className="w-full p-2 border rounded-md"
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
                  <Field
                    as="select"
                    name="section_id"
                    onChange={(e) => handleSectionChange(e, setFieldValue)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Section</option>
                    {sections.length > 0 ? (
                      sections.map((section) => (
                        <option
                          key={section.section_id}
                          value={section.section_id}
                        >
                          {section.section_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No Section Found!</option>
                    )}
                  </Field>
                  <ErrorMessage
                    name="section_id"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-700">Subject</label>
                <Field
                  as="select"
                  name="subject_id"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="subject_id"
                  component="div"
                  className="text-red-600"
                />
              </div>

              {/* Field Name */}
              <div>
                <label className="block text-gray-700">Field Name</label>
                <Field
                  type="text"
                  name="field_name"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="field_name"
                  component="div"
                  className="text-red-600"
                />
              </div>

              {/* Submit Button */}
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
    </div>
  );
};

export default FieldsForm;
