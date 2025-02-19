import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getClasses } from "../../../redux/classSlice"; // Import your action to get classes
import { fetchSubjectsByClass } from "../../../redux/subjectSlice";
import { createExam, resetState } from "../../../redux/examSlice"; // Import your action to create an exam
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

// Validation schema
const validationSchema = Yup.object().shape({
  exam_name: Yup.string().required("Exam name is required"),
  class_id: Yup.string().required("Class ID is required"),
  start_date_time: Yup.string().required("Start date and time are required"),
  end_date_time: Yup.string().required("End date and time are required"),
  subjects: Yup.array()
    .of(Yup.string().required("Subject ID is required"))
    .min(1, "At least one subject is required"),
});

const ExamForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const { classes } = useSelector((state) => state.classes);
  const { subjects } = useSelector((state) => state.subjects); // Assuming subjects are stored in redux
  const { loading, error, message } = useSelector((state) => state.exams); // Adjust based on your state structure

  useEffect(() => {
    dispatch(getClasses()); // Fetch classes on component mount
  }, [dispatch]);

  useEffect(() => {
    if (selectedClassId) {
      dispatch(fetchSubjectsByClass(selectedClassId)); // Fetch subjects when class is selected
    }
  }, [selectedClassId, dispatch]);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const handleClassChange = (e, setFieldValue) => {
    const classId = e.target.value;
    setSelectedClassId(classId); // Update the selected class ID
    setSelectedSubjects([]); // Clear previously selected subjects when changing classes
    setFieldValue("class_id", classId); // Update Formik's value
  };

  const handleSubjectChange = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId)); // Remove if already selected
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]); // Add if not selected
    }
  };

  return (
    <>
      <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
      <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />

      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
        <Formik
          initialValues={{
            exam_name: "",
            class_id: "",
            start_date_time: "",
            end_date_time: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values, selectedSubjects);
            
            // Send selected subjects along with other exam data
            dispatch(createExam({ ...values, subjects: selectedSubjects }));
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-gray-700">Exam Name</label>
                  <Field
                    name="exam_name"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <ErrorMessage
                    name="exam_name"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Class</label>
                  <Field
                    as="select"
                    name="class_id"
                    onChange={(e) => handleClassChange(e, setFieldValue)} // Update subjects when class changes
                    className="w-full p-2 border rounded-md text-sm"
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
                  <label className="block text-gray-700">Start Date</label>
                  <Field
                    type="datetime-local"
                    name="start_date_time"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <ErrorMessage
                    name="start_date_time"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
                <div>
                  <label className="block text-gray-700">End Date</label>
                  <Field
                    type="datetime-local"
                    name="end_date_time"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <ErrorMessage
                    name="end_date_time"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Subjects</label>
                  <div className="flex flex-col space-y-2">
                    {subjects.map((subject) => (
                      <label key={subject.subject_id}>
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject.subject_id)}
                          onChange={() => handleSubjectChange(subject.subject_id)}
                          className="mr-2"
                        />
                        {subject.subject_name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ExamForm;
