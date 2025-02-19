import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  getExams,
  deleteExam,
  updateExam,
  resetState,
} from "../../../redux/examSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSubjectsByClass } from "../../../redux/subjectSlice"; // Import the action to fetch subjects
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const ExamsTable = () => {
  const dispatch = useDispatch();
  const { exams, loading, error, message } = useSelector(
    (state) => state.exams
  );
  const { classes } = useSelector((state) => state.classes);
  const { subjects } = useSelector((state) => state.subjects); // Get subjects from Redux
  const [open, setOpen] = useState(false);
  const [examId, setExamId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]); // Store selected subjects
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    dispatch(getExams());
    dispatch(getClasses()); // Fetch classes on component load

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setExamId(id);
    setOpen(true);
  };

  const handleEdit = (exam) => {
    setExamToEdit(exam);
    setEditModalOpen(true);
    // Fetch subjects by the class_id of the selected exam
    dispatch(fetchSubjectsByClass(exam.class_id));
    setSelectedSubjects(exam.subject_ids || []); // Set selected subjects if available
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    dispatch(fetchSubjectsByClass(classId)); // Fetch subjects for the selected class
  };

  const handleSubjectChange = (subjectId) => {
    // Add or remove subject from selectedSubjects arrayl
    
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId)); // Remove if already selected
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]); // Add if not selected
    }
  };

  // Validation schema for editing the exam
  const validationSchema = Yup.object().shape({
    exam_name: Yup.string().required("Exam name is required"),
    start_date_time: Yup.date().required("Start date is required"),
    end_date_time: Yup.date().required("End date is required"),
    class_id: Yup.string().required("Class is required"),
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
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Exam name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Subjects Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Start date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              End date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr
              key={exam.exam_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {exam.exam_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {exam.class_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {exam.subjects || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(exam.start_date_time).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(exam.end_date_time).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(exam)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exam.exam_id)}
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
        actionFunction={deleteExam}
        message="Are you sure do you want to delete this exam?"
        id={examId}
      />

      {/* Edit Modal */}
      {editModalOpen && examToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Exam</h2>
            <Formik
              initialValues={{
                exam_name: examToEdit.exam_name,
                class_id: examToEdit.class_id,
                start_date_time: examToEdit.start_date_time.slice(0, 16),
                end_date_time: examToEdit.end_date_time.slice(0, 16),
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {

                // Send selected subjects along with other exam data
                dispatch(
                  updateExam({
                    examData: { ...values, subjects: selectedSubjects },
                    examId: examToEdit.exam_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {() => (
                <Form className="space-y-4">
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
                      onChange={(e) => {
                        handleClassChange(e); // Update subjects when class changes
                      }}
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
                    <label className="block text-gray-700">Subjects</label>
                    <div className="flex flex-col space-y-2">
                      {subjects.map((subject) => (
                        <label key={subject.subject_id}>
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(
                              subject.subject_id
                            )}
                            onChange={() =>
                              handleSubjectChange(subject.subject_id)
                            }
                            className="mr-2"
                          />
                          {subject.subject_name}
                        </label>
                      ))}
                    </div>
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
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

export default ExamsTable;
