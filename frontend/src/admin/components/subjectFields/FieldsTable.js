import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { fetchSubjects } from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
import {
  updateSubjectfields,
  deleteSubjectfields,
  fetchSubjectfields,
  resetState,
} from "../../../redux/markFieldSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const FieldsTable = () => {
  const dispatch = useDispatch();

  // Redux state
  const { subjects } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { sections } = useSelector((state) => state.sections);
  const { fields, error, message } = useSelector((state) => state.fields);

  // Local state
  const [open, setOpen] = useState(false);
  const [fieldId, setFieldId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [classId, setClassId] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  useEffect(() => {
    dispatch(getClasses());
    dispatch(fetchSubjectfields());
    if(message){
      setOpenSuccess(true)
    }
    if(error){
      setOpenError(true)
    }
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setFieldId(id);
    setOpen(true);
  };

  const handleEdit = (field) => {
    setFieldToEdit(field);
    setEditModalOpen(true);
  };

  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_id: Yup.string().required("Subject is required"),
    field_name: Yup.string().required("Field name is required"),
    total_marks: Yup.number().required("Total marks are required").positive(),
    field_value: Yup.number().required("Field value is required").positive(),
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
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white">
        <thead className="text-[12px]">
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Class
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Section
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Subject
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Field Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Total Marks
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Field Value
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-[12px]">
          {fields?.map((field) => (
            <tr
              key={field.id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                {field.class_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {field.section_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {field.subject_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {field.field_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {field.total_marks}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {field.field_value}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(field)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(field.id)}
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
        actionFunction={deleteSubjectfields}
        message="Are you sure you want to delete this field?"
        id={fieldId}
      />

      {/* Edit Modal */}
      {editModalOpen && fieldToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Field</h2>
            <Formik
              initialValues={{
                class_id: fieldToEdit.class_id,
                section_id: fieldToEdit.section_id,
                subject_id: fieldToEdit.subject_id,
                field_name: fieldToEdit.field_name,
                total_marks: fieldToEdit.total_marks,
                field_value: fieldToEdit.field_value,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateSubjectfields({
                    fieldData: { ...values },
                    fieldId: fieldToEdit.id,
                  })
                );
                setEditModalOpen(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form className="grid grid-cols-1 gap-4 text-sm">
                  {/* Class and Section in one row */}
                  <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-gray-700">Subject</label>
                    <Field
                      as="select"
                      name="subject_id"
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option
                          key={subject.subject_id}
                          value={subject.subject_id}
                        >
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

                  <div>
                    <label className="block text-gray-700">Total Marks</label>
                    <Field
                      type="number"
                      name="total_marks"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="total_marks"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Field Value</label>
                    <Field
                      type="number"
                      name="field_value"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="field_value"
                      component="div"
                      className="text-red-600"
                    />
                  </div>

                  <div className="flex gap-5">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save Changes
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

export default FieldsTable;
