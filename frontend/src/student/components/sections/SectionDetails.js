import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionById } from "../../../redux/sectionSlice";
import { fetchStudentByUserId } from "../../../redux/studentSlice";

const SectionDetails = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { student } = useSelector((state) => state.students);
  const { section } = useSelector((state) => state.sections);
  useEffect(() => {
    //  dispatch(fetchSectionById(section.section_id))
    dispatch(fetchStudentByUserId(auth?.user_id));
  }, []);
  useEffect(() => {
    if (student) {
      dispatch(fetchSectionById(student.school_details?.section.section_id));
    }
  }, [student]);
  return (
    <div className="container mx-auto p-6">
      {/* Section Information */}
      <div className="bg-white shadow-lg rounded-lg mb-8 p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Section Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Section ID</p>
            <p className="text-lg font-medium text-gray-800">
              {section?.section.section_id}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Section Name</p>
            <p className="text-lg font-medium text-gray-800">
              {section?.section.section_name}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">
              Section Capacity
            </p>
            <p className="text-lg font-medium text-gray-800">
              {section?.section.section_capacity}
            </p>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <div className="bg-white shadow-lg rounded-lg mb-8 p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Class Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Class ID</p>
            <p className="text-lg font-medium text-gray-800">
              {section?._class.class_id}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Class Name</p>
            <p className="text-lg font-medium text-gray-800">
              {section?._class?.class_name}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">
              Class Start Date
            </p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(section?._class?.class_starting_on).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">
              Class End Date
            </p>
            <p className="text-lg font-medium text-gray-800">
              {new Date(section?._class?.class_ending_on).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* In-Charge Teacher Information */}
      <div className="bg-white shadow-lg rounded-lg mb-8 p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          In-Charge Teacher
        </h2>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Teacher Name</p>
            <p className="text-lg font-medium text-gray-800">{`${section?.incharge_teacher?.first_name} ${section?.incharge_teacher?.middle_name} ${section?.incharge_teacher?.last_name}`}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Phone</p>
            <p className="text-lg font-medium text-gray-800">
              {section?.incharge_teacher.phone}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">Qualification</p>
            <p className="text-lg font-medium text-gray-800">
              {section?.incharge_teacher.qualification}
            </p>
          </div>
        </div>
      </div>

      {/* Subjects Information */}
      <div className="bg-white shadow-lg rounded-lg mb-8 p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Subjects Information
        </h2>
        {section?.subjects?.map((subject, index) => (
          <div
            key={subject.subject_id}
            className="border-b border-gray-200 py-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-600">
                {subject.subject_name}
              </h3>
              <span className="text-sm text-gray-500">
                {subject.subject_code}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Book:</strong> {subject.book_name}
            </p>

            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-semibold text-gray-600">
                Subject Teacher
              </h4>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">{`${subject.subject_teacher.first_name} ${subject.subject_teacher.middle_name} ${subject.subject_teacher.last_name}`}</p>
                <p className="text-sm text-gray-600">
                  Phone: {subject.subject_teacher.phone}
                </p>
                <p className="text-sm text-gray-600">
                  Qualification: {subject.subject_teacher.qualification}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionDetails;
