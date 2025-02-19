import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../../redux/studentSlice";
import { fetchSubjects } from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // Action for fetching sections
import { fetchSubjectfields, resetState } from "../../../redux/markFieldSlice";
import { submitMarks } from "../../../redux/marksSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { getExams } from "../../../redux/examSlice";
import * as Yup from "yup";
import { fetchTeacherByUserId } from "../../../redux/teacherSlice";
const AddMarksForm = () => {
  const dispatch = useDispatch();

  const { teacher } = useSelector((state) => state.teachers);
  const { exams } = useSelector((state) => state.exams);
  const { auth } = useSelector((state) => state.auth);
  const { error, message, fields } = useSelector((state) => state.fields);
  const { students } = useSelector((state) => state.students);

  // Local component state
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [classId, setClassId] = useState(null);

  const [sectionId, setSectionId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null)
  useEffect(() => {
    dispatch(fetchTeacherByUserId(auth.user_id));

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  // Validation schema for the form
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_id: Yup.string().required("Subject is required"),
  });

  // Handle Class Change
  const handleClassChange = (e, setFieldValue) => {
    const selectedClassId = e.target.value;
    setClassId(selectedClassId);
    setFieldValue("class_id", selectedClassId);
    dispatch(getExams({ class_id: selectedClassId }));
    // Find the selected class and update sections accordingly
    const selectedClass = teacher.classes.find(
      (cls) => cls.class_id === parseInt(selectedClassId)
    );
    setSections(selectedClass ? selectedClass.sections : []); // Update sections based on selected class
    setSubjects([]); // Clear subjects when class changes

    if (selectedClassId) {
      // Fetch students based on selected class
      dispatch(fetchStudents({ class_id: selectedClassId }));
    }
  };

  const handleExamChange = (e, setFieldValue) => {
    const value = e.target.value; // Get the stringified exam object
    const selectedExam = JSON.parse(value); 
    setSelectedExam(selectedExam)// Parse it back to an object
    setFieldValue("exam_id", selectedExam.exam_id); // Set the entire exam object in Formik field
    // Log the selected exam object
  };



  // Handle Section Change
  const handleSectionChange = (e, setFieldValue) => {
    const selectedSectionId = e.target.value;
    setSectionId(selectedSectionId);
    setFieldValue("section_id", selectedSectionId);

    // Find the selected section and update subjects accordingly
    const selectedSection = sections.find(
      (section) => section.section_id === parseInt(selectedSectionId)
    );
    setSubjects(selectedSection ? selectedSection.subjects : []); // Update subjects based on selected section

    if (classId && selectedSectionId) {
      // Fetch students based on selected class and section
      dispatch(
        fetchStudents({ class_id: classId, section_id: selectedSectionId })
      );
    }
  };

  // Handle Subject Change
  const handleSubjectChange = (e, setFieldValue) => {
    const selectedSubjectId = e.target.value;
    setSubjectId(selectedSubjectId);
    setFieldValue("subject_id", selectedSubjectId);

    if (classId && sectionId && selectedSubjectId) {
      // Fetch subject fields based on selected class, section, and subject
      dispatch(
        fetchSubjectfields({
          class_id: classId,
          section_id: sectionId,
          subject_id: selectedSubjectId,
        })
      );
    }
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

      <Formik
        initialValues={{
          class_id: "",
          section_id: "",
          subject_id: "",
          exams_id:"",
          data: students.map((student) => ({
            marks: "",
            remarks: "",
            student_id: student.student_id, // Dynamic student ID
          })),
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const preparedData = values.data.map((item, index) => ({
            student_id: students[index].student_id,
            student_name: `${students[index].first_name} ${students[index].middle_name} ${students[index].last_name}`,
            marks: item.marks || "", // If no marks are entered, set it as an empty string
            remarks: item.remarks || "", // If no remarks are entered, set it as an empty string
            // Add section_id for each student
            // Dynamically add fields
            ...fields.reduce((acc, field) => {
              acc[field.field_name] = item[field.field_name] || ""; // Ensure each field has a value
              return acc;
            }, {}),
          }));
          dispatch(submitMarks({ ...values, preparedData }));
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-8 text-sm">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Field Details</h2>

              {/* Class and Section in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700">Class</label>
                  <Field
                    as="select"
                    name="class_id"
                    onChange={(e) => handleClassChange(e, setFieldValue)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Class</option>
                    {teacher?.classes?.map((cls) => (
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
                  <label className="block text-gray-700">--Exam--</label>
                  <Field
                    as="select"
                    name="exam_id"
                    onChange={(e) => handleExamChange(e, setFieldValue)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select exam</option>
                    {exams.map((exam) => (
                      <option key={exam.exam_id} value={JSON.stringify(exam)}>
                        {exam.exam_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="exam_id"
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

                <div>
                  <label className="block text-gray-700">--Subject--</label>
                  <Field
                    as="select"
                    name="subject_id"
                    onChange={(e) => handleSubjectChange(e, setFieldValue)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Subject</option>
                    {subjects?.length > 0 ? (
                      subjects
                        .filter((subject) =>
                          selectedExam.subjects.includes(subject.subject_id)
                        )
                        .map((subject) => (
                          <option
                            key={subject.subject_id}
                            value={subject.subject_id}
                          >
                            {subject.subject_name}
                          </option>
                        ))
                    ) : (
                      <option value="">No subject Found!</option>
                    )}
                  </Field>
                  <ErrorMessage
                    name="subject_id"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* Table for Marks */}
              <table className="min-w-full border border-gray-900 divide-y divide-blue-300">
                <thead className="bg-blue-50/40">
                  <tr>
                    <th className="border px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="border px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Remarks
                    </th>
                    {fields &&
                      fields.map((item) => (
                        <th
                          key={item.field_id}
                          className="border px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          {item.field_name}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-500">
                  {students.map((student, index) => (
                    <tr key={student.student_id} className="hover:bg-gray-100">
                      <td className="border px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Field
                          type="number"
                          name={`data[${index}].student_id`}
                          disabled
                          placeholder={student.student_id}
                          className="w-full bg-white text-gray-900"
                        />
                      </td>
                      <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.first_name} {student.middle_name}{" "}
                        {student.last_name}
                      </td>

                      <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Field
                          type="number"
                          name={`data[${index}].marks`}
                          className="w-full p-2 border rounded-md"
                        />
                      </td>
                      <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Field
                          type="text"
                          name={`data[${index}].remarks`}
                          className="w-full p-2 border rounded-md"
                        />
                      </td>
                      {fields &&
                        fields.map((field, fieldIndex) => (
                          <td key={field.field_id} className="border px-6 py-4">
                            {/* Add corresponding inputs for dynamic fields here */}
                            <Field
                              type="text"
                              name={`data[${index}].${field.field_name}`}
                              className="w-full p-2 border rounded-md"
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
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

export default AddMarksForm;
