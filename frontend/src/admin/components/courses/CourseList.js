import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  deleteCourse,
  resetState,
} from "../../../redux/courseSlice";
import { Link } from "react-router-dom";
import ConfirmPopup from "../../../components/ConfirmPopup";
const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error, message } = useSelector(
    (state) => state.courses
  );
  const [open, setOpen] = useState(false);
  // State to manage the currently opened dropdown
  const [openDropdown, setOpenDropdown] = useState(null);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  const toggleDropdown = (courseId) => {
    setOpenDropdown((prev) => (prev === courseId ? null : courseId));
  };
  const handleDelete = (id) => {
    setCourseId(id);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={`/courses/${course.course_image}`}
              alt={course.course_name}
              onError={(e) => {
                e.target.src = '/default_course.jpg';
                e.target.alt = 'Default course Image'; // Update the alt text for accessibility
              }}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800">
              {course.course_name}
            </h2>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {" "}
              {course.course_excerpt}
            </p>
            <p className="text-blue-600 mt-4 font-bold text-lg">
              ${course.course_price}
            </p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500">
                By: {course.course_author}
              </span>
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(course.course_id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md focus:outline-none"
                >
                  Actions
                </button>
                {openDropdown === course.course_id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md">
                    <Link
                      to={`/dashboard/course/${course.course_id}`}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      View
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(course?.course_id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <ConfirmPopup
          isOpen={open}
          onClose={() => setOpen(false)}
          actionFunction={deleteCourse}
          message="Are you sure you want to delete this course?"
          id={courseId}
        />
      </div>
    </div>
  );
};

export default CourseList;
