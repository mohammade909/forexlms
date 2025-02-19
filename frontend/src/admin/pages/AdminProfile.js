import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeacherByUserId } from "../../redux/teacherSlice";

function AdminProfile() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { teacher, loading, error } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(fetchTeacherByUserId(auth.user_id));
  }, [dispatch, auth.user_id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;
  }

  if (!teacher) {
    return <div className="text-center py-8">No teacher data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0">
            {teacher.profile_photo ? (
              <img
                src={teacher.profile_photo}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              {teacher.first_name} {teacher.last_name}
            </h1>
            <p className="text-gray-500">{teacher.email}</p>
            <span className="px-3 py-1 bg-gray-200 text-sm rounded-full">
              {teacher.user_type}
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-lg">Personal Information</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-medium">Gender:</span> {teacher.gender}
              </li>
              <li>
                <span className="font-medium">Date of Birth:</span>{" "}
                {new Date(teacher.date_of_birth).toLocaleDateString()}
              </li>
              <li>
                <span className="font-medium">Phone:</span> {teacher.phone}
              </li>
              <li>
                <span className="font-medium">Address:</span> {teacher.address}
              </li>
              <li>
                <span className="font-medium">Blood Group:</span>{" "}
                {teacher.blood_group}
              </li>
            </ul>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="font-semibold text-lg">Professional Information</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li>
                <span className="font-medium">Qualification:</span>{" "}
                {teacher.qualification}
              </li>
              <li>
                <span className="font-medium">Hire Date:</span>{" "}
                {new Date(teacher.hire_date).toLocaleDateString()}
              </li>
              <li>
                <span className="font-medium">Username:</span>{" "}
                {teacher.username}
              </li>
              <li>
                <span className="font-medium">Email:</span> {teacher.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Current Class (optional) */}
        <div>
          <h2 className="font-semibold text-lg">Current Class</h2>
          <div className="mt-2 bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium">{teacher.class_name}</h3>
            <p className="text-xs text-gray-500">
              {new Date(teacher.class_starting_on).toLocaleDateString()} -{" "}
              {new Date(teacher.class_ending_on).toLocaleDateString()}
            </p>
            <p className="mt-2 text-sm">{teacher.course_name}</p>
            <p className="text-xs text-gray-500">
              {teacher.course_description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
