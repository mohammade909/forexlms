import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignmentDetails,
  createSubmission,
  fetchAssignmentSubmissions,
  resetState,
} from "../../../redux/assignmentSlice"; // Adjust the path as needed
import { useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { fetchStudentByUserId } from "../../../redux/studentSlice";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { LuBook, LuUsers } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
const AssignmentOverview = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { auth } = useSelector((state) => state.auth); // Get assignment ID from the URL
  const { assignment, submissions, loading, error, message } = useSelector(
    (state) => state.assignments
  );
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { student } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchAssignmentDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchStudentByUserId(auth?.user_id));
  }, [dispatch, auth]);
  useEffect(() => {
    dispatch(
      fetchAssignmentSubmissions({
        assignmentId: assignment?.assignment_id,
        studentId: student?.student_id,
      })
    );
  }, [dispatch, assignment, student]);

  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("file_url", values.file);
    formData.append("assignment_id", assignment?.assignment_id);
    formData.append("student_id",student?.student_id);
    dispatch(createSubmission(formData));
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-blue-500">
          Loading assignment details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-500">Assignment not found.</div>
      </div>
    );
  }
  const isGraded = submissions.some(
    (submission) => submission.status === "graded"
  );
  const { assignment_title, first_name, last_name } = assignment;
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-md">
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
   
  <div className="overflow-hidden rounded-md shadow-lg bg-white">
        {/* Assignment Header */}
      
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <div className="text-2xl font-bold">{assignment_title}</div>
        </div>

        {/* Assignment Details */}
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <p
                className="text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: assignment.assignment_description,
                }}
              ></p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  <CiCalendarDate className="w-6 h-6" />
                </span>
                <span>
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <span>
                    <LuBook className="h-6 w-6" />
                  </span>
                  <span>{assignment.course_name}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <span>
                    <LuUsers className="w-6 h-6" />
                  </span>
                  <span>{assignment.class_name}</span>
                </div>
              </div>
            </div>

            {/* Teacher Details */}
            <div className="flex flex-col items-center justify-center space-y-2 bg-gray-50 p-4 rounded-lg">
              <img
                className="h-20 w-20 rounded-full"
                src={""}
                alt={first_name}
              />
              <h3 className="font-semibold">
                {first_name} {last_name}
              </h3>
              <p className="text-sm text-gray-500">Teacher</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Submissions
        </h2>
        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.submission_id}
                className="p-4 bg-gray-100 rounded-md shadow-md"
              >
                <p className="text-sm text-gray-700">
                  <strong>Submitted At:</strong>{" "}
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>File:</strong>{" "}
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline"
                  >
                    View Submission
                  </a>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Grade:</strong>{" "}
                  {submission.grade !== null ? submission.grade : "Not Graded"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Feedback:</strong>{" "}
                  {submission.feedback || "No Feedback"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {submission.status}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(submission.updated_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No submissions found for this assignment.
          </p>
        )}
      </div>

      {/* Submit Assignment Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-2 rounded-md text-white ${
            isGraded
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-800"
          }`}
          disabled={isGraded}
        >
          {isGraded ? "Submission Graded" : "Submit Assignment"}
        </button>
      </div>

      {/* Modal for Assignment Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full">
            <Formik initialValues={{ file: null }} onSubmit={handleSubmit}>
              {({ setFieldValue }) => (
                <Form>
                  <div className="space-y-4">
                    {/* File Input Field */}
                    <input
                      type="file"
                      name="file"
                      onChange={(event) =>
                        setFieldValue("file", event.currentTarget.files[0])
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800"
                      >
                        Submit
                      </button>
                    </div>
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

export default AssignmentOverview;
