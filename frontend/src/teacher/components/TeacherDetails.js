import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherByUserId } from "../../redux/teacherSlice"; // Replace with the actual path to your action
import { fetchEnrollmentsByCourse } from "../../redux/enrollmentSlice";
const TeacherDetails = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.auth); // Get logged-in user details
  const teacher = useSelector((state) => state.teachers.teacher); // Teacher details
  const loading = useSelector((state) => state.teachers.loading);
  const error = useSelector((state) => state.teachers.error);
  const enrollments = useSelector((state) => state.enrollments.enrollments); // Enrollment details

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(fetchTeacherByUserId(auth?.user_id));
    }
  }, [dispatch, auth?.user_id]);

  useEffect(() => {
    if (teacher?.course_id) {
      dispatch(fetchEnrollmentsByCourse(teacher?.course_id));
    }
  }, [dispatch, teacher?.course_id]);

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
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      {/* Class Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Class Details
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-1/4">
            <p className="text-sm font-medium text-gray-500">Class Name:</p>
            <p className="text-lg font-bold text-gray-900">
              {teacher.class_name}
            </p>
          </div>
          <div className="w-3/4">
            <p className="text-sm font-medium text-gray-500">
              Class Starting On:
            </p>
            <p className="text-md text-gray-700">
              {new Date(teacher.class_starting_on).toLocaleDateString()}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Class Ending On:
            </p>
            <p className="text-md text-gray-700">
              {new Date(teacher.class_ending_on).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Course Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Course Details
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-1/4">
            <p className="text-sm font-medium text-gray-500">Course Name:</p>
            <p className="text-lg font-bold text-gray-900">
              {teacher.course_name}
            </p>
          </div>
          <div className="w-3/4">
            <p className="text-sm font-medium text-gray-500">
              Course Description:
            </p>
            <p className="text-md text-gray-700">
              {teacher.course_description}
            </p>
          </div>
          <div className="w-3/4">
            <p className="text-sm font-medium text-gray-500">
              Enrolled Students:
            </p>
            <p className="text-md text-gray-700">
              {enrollments?.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
