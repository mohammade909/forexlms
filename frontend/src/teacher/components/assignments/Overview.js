import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignmentDetails,
  fetchSubmissionByAssignment,
  updateSubmission,
} from "../../../redux/assignmentSlice";
import { fetchStudents } from "../../../redux/studentSlice"; // Adjust the path as needed
import { Link, useParams } from "react-router-dom";
import { MdOutlineWatchLater } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { LuBook, LuUsers } from "react-icons/lu";
import UpdateSubmision from "./UpdateSubmission";
const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // "en-CA" gives the format YYYY-MM-DD
};

const Overview = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get assignment ID from the URL
  const { assignment, submissions, loading, error } = useSelector(
    (state) => state.assignments
  );
  const { students } = useSelector((state) => state.students);
  const [isModalOpen, setModalOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const handleOpenModal = (id) => {
    setModalOpen(true);
    setSubmissionId(id);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleFormSubmit = (data) => {
    console.log("Submitted Data:", data);
    data.submission_id = submissionId;
    dispatch(updateSubmission(data));
    setModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchAssignmentDetails(id));
    dispatch(fetchSubmissionByAssignment(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(
      fetchStudents({ page: 1, limit: 20, class_id: assignment.class_id })
    );
  }, [dispatch]);

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

  const { assignment_title, first_name, last_name } = assignment;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
        <UpdateSubmision
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
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

      {/* Submissions Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Submissions</h2>

      {/* Calculate Submission Stats */}
      <div className="mb-4">
        <div className="text-lg font-medium">
          Total Students: {students?.length || 0}
        </div>
        <div className="flex space-x-4 text-gray-700">
          <span>
            <strong>Submitted:</strong>{" "}
            {
              submissions.filter(
                (sub) => sub.status === "submitted" || sub.status === "graded"
              ).length
            }
          </span>
          <span>
            <strong>Not Submitted:</strong>{" "}
            {students?.length -
              submissions.filter(
                (sub) => sub.status === "submitted" || sub.status === "graded"
              ).length}
          </span>
        </div>
      </div>

      {/* Student Submissions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students?.map((student) => {
          const studentSubmission = submissions.find(
            (submission) => submission.student_id === student.student_id
          );
          const studentGrade = submissions.find(
            (submission) =>
              submission.student_id === student.student_id &&
              submission.status === "graded"
          );

          return (
            <div
              key={student.student_id}
              className="border bg-white rounded-md overflow-hidden shadow-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`h-10 uppercase w-10 rounded-full ${getRandomColor()} flex items-center justify-center text-white text-lg`}
                >
                  {student.first_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold capitalize">
                    <Link to={`/dashboard/student/${student.student_id}`}>
                      {student.first_name} {student.last_name}
                    </Link>
                  </h3>
                  {studentSubmission?.status === "submitted" && (
                    <div>
                      <div className="text-sm text-blue-600 underline mb-2">
                        <a
                          href={studentSubmission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Submission
                        </a>
                      </div>
                      <button
                        onClick={() =>
                          handleOpenModal(studentSubmission.submission_id)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Upload Grade
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>
                      <MdOutlineWatchLater className="w-5 h-5" />
                    </span>
                    <span>
                      {studentSubmission
                        ? formatDate(studentSubmission.submitted_at)
                        : "Not Submitted"}
                    </span>
                  </div>
                </div>
              </div>

              {studentSubmission?.status === "graded" && (
                <div className="mt-4 bg-gray-100 p-4 rounded-md">
                  <div className="text-sm text-gray-700">
                    <strong>Grade:</strong> {studentSubmission.grade}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Feedback:</strong> {studentSubmission.feedback}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <span>
                      <MdOutlineWatchLater className="w-5 h-5 inline-block mr-1" />
                    </span>
                    <span>
                      Graded on: {formatDate(studentSubmission.updated_at)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <div
                  className={`w-full text-center rounded-full text-xs font-semibold tracking-wider capitalize ${
                    studentSubmission
                      ? studentSubmission.status === "submitted"
                        ? "bg-green-500 text-white"
                        : studentSubmission.status === "late"
                        ? "bg-red-500 text-white"
                        : studentSubmission.status === "pending"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-300 text-black" // default if status is unknown
                      : "bg-gray-300 text-black" // if no submission
                  }`}
                >
                  {studentSubmission
                    ? studentSubmission.status
                    : "Not Submitted"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
