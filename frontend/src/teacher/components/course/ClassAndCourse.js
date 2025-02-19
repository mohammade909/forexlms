import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClasses } from "../../../redux/classSlice"; // Assuming actions are set in Redux
import { fetchTeacherByUserId } from "../../../redux/teacherSlice";

const ClassCardGrid = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);

  const { classes, loading, error } = useSelector((state) => state.classes);
  const { teacher } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(getClasses());
    dispatch(fetchTeacherByUserId(auth.user_id));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {classes?.filter((item) => item.instructor_id === teacher?.teacher_id)
        .map((classItem) => (
          <div
            key={classItem.class_id}
            className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {classItem.class_name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-semibold">Instructor:</span>{" "}
                {classItem.instructor_first_name
                  ? `${classItem.instructor_first_name} ${classItem.instructor_last_name}`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Course:</span>{" "}
                {classItem.course_name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Enrolled:</span>{" "}
                {classItem.enrolled_count}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Starts:</span>{" "}
                {new Date(classItem.class_starting_on).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold">Ends:</span>{" "}
                {new Date(classItem.class_ending_on).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ClassCardGrid;
