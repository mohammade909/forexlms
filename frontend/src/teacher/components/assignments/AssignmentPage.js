import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherByUserId } from "../../../redux/teacherSlice"; // Replace with the actual path to your action
import { getcourseByInstructor } from "../../../redux/courseSlice";
import { FaBook, FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";

const AssignmentPage = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.auth); // Get logged-in user details
  const teacher = useSelector((state) => state.teachers.teacher); // Teacher details
  const loading = useSelector((state) => state.teachers.loading);
  const error = useSelector((state) => state.teachers.error);
  const courses = useSelector((state) => state.courses.courses); // Enrollment details

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchTeacherByUserId(auth?.user_id));
    }
  }, [dispatch, auth?.user_id]);

  useEffect(() => {
    if (teacher?.teacher_id) {
      dispatch(getcourseByInstructor(teacher?.user_id));
    }
  }, [dispatch, teacher?.teacher_id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!teacher) {
    return <div className="text-center mt-10">No teacher data found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Teacher Information */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">
          Welcome, {teacher.first_name} {teacher.last_name}{" "}
          <span className="text-sm text-gray-600">{`(${teacher.email})`}</span>
        </h1>
        <p className="text-gray-700">Here are your Assignments Details:</p>
      </div>

      {/* Courses */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-6"
            >
              {/* Course Details */}
              <div className="flex items-center mb-4">
                <div className="text-indigo-600 text-4xl mr-4">
                  <FaBook />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {course.course_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {course.course_description}
                  </p>
                </div>
              </div>

              {/* Classes */}
              {course.classes.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Classes
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {course.classes.map((cls) => (
                      <Link
                        key={cls.class_id}
                        to={`/teacher/class/${cls.class_id}`}
                        className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="text-teal-500 text-2xl mr-3">
                            <FaChalkboardTeacher />
                          </div>
                          <div>
                            <h4 className="text-md font-semibold text-gray-700">
                              {cls.class_name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Start:{" "}
                              {new Date(
                                cls.class_starting_on
                              ).toLocaleDateString()}
                              {" | "}End:{" "}
                              {new Date(
                                cls.class_ending_on
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No classes available.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No courses available.</p>
      )}
    </div>
  );
};

export default AssignmentPage;
