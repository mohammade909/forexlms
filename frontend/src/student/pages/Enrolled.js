import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnrollmentsByStudentID } from "../../redux/enrollmentSlice";

const EnrollmentList = () => {
  const dispatch = useDispatch();
  const { enrollments, loading, error } = useSelector(
    (state) => state.enrollments
  );
  const { auth } = useSelector((state) => state.auth);
  const userId = auth?.user_id;
  
  useEffect(() => {
    if (userId) {
      dispatch(getEnrollmentsByStudentID(userId));
    }
  }, [userId, dispatch]);

  if (loading) return <p>Loading enrollments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        My Enrollments
      </h1>
      <div className="space-y-6 max-w-5xl mx-auto">
  {enrollments.map((enrollment) => (
    <div
      key={enrollment.enrollment_id}
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600">
          {enrollment.course_name}
        </h2>
        <p className="text-gray-700 text-sm italic mb-4">
          {enrollment.course_description}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-indigo-500 font-medium">
                {enrollment.status}
              </span>
            </p>
            <p>
              <strong>Enrollment Date:</strong>{" "}
              {new Date(enrollment.enrollment_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Grade:</strong>{" "}
              {enrollment.grade ? enrollment.grade : "Not graded yet"}
            </p>
            <p>
              <strong>Class Name:</strong>{" "}
              <span className="text-indigo-500">
                {enrollment.class_name}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Class Starts:</strong>{" "}
              {new Date(enrollment.class_starting_on).toLocaleString()}
            </p>
            <p>
              <strong>Class Ends:</strong>{" "}
              {new Date(enrollment.class_ending_on).toLocaleString()}
            </p>
            <p>
              <strong>Instructor:</strong>{" "}
              {enrollment.instructor_first_name}{" "}
              {enrollment.instructor_last_name}
            </p>
            <p>
              <strong>Instructor Phone:</strong>{" "}
              <a
                href={`tel:${enrollment.instructor_phone}`}
                className="text-indigo-500 underline"
              >
                {enrollment.instructor_phone}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            <strong>Created:</strong>{" "}
            {new Date(enrollment.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            <strong>Updated:</strong>{" "}
            {new Date(enrollment.updated_at).toLocaleDateString()}
          </p>
        </div>

        {/* View Assignments Link */}
        <div className="mt-4">
          <a
            href={`/assignments/${enrollment.course_id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Assignments for {enrollment.course_name}
          </a>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default EnrollmentList;
