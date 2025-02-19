import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LuUsers,
  LuBook,
  LuGraduationCap,
  LuDollarSign,
  
} from "react-icons/lu";
import { FaUserPlus, FaBookOpen, FaPlusCircle, FaRegWindowClose } from 'react-icons/fa';


const FeeStats = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/fees/summary"
        );
        setSummaryData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch summary data.");
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  // Calculate Totals
  const totalEnrollments = summaryData.reduce(
    (total, course) => total + (course.enrollment_count || 0),
    0
  );
  const totalFees = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_fee || 0),
    0
  );
  const totalPaid = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_paid || 0),
    0
  );
  const totalDue = summaryData.reduce(
    (total, course) => total + parseFloat(course.total_due || 0),
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Course Statistics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Enrollments
          </h3>
          <p className="text-2xl font-bold text-blue-500">{totalEnrollments}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Fees</h3>
          <p className="text-2xl font-bold text-green-500">
            ${totalFees.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Paid</h3>
          <p className="text-2xl font-bold text-indigo-500">
            ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Due</h3>
          <p className="text-2xl font-bold text-red-500">
            ${totalDue.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white shadow-md rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Enrollments
          </h3>
          <p className="text-2xl font-bold text-blue-500">{totalEnrollments}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={'/dashboard/student/add'}
              className="flex items-center px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-sm hover:bg-blue-200 transition-colors duration-200"
            >
              <FaUserPlus className="h-5 w-5 mr-2" />
              Add Student
            </Link>
            <Link
              to="/dashboard/teacher/add"
              className="flex items-center px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm hover:bg-green-200 transition-colors duration-200"
            >
              <FaUserPlus className="h-5 w-5 mr-2" />
              Add Teacher
            </Link>
            <Link
              to="/dashboard/course/add"
              className="flex items-center px-4 py-3 bg-yellow-100 text-yellow-800 font-semibold rounded-lg shadow-sm hover:bg-yellow-200 transition-colors duration-200"
            >
              <FaBookOpen className="h-5 w-5 mr-2" />
              Create Course
            </Link>
            <Link
              to="/reject"
              className="flex items-center px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-lg shadow-sm hover:bg-red-200 transition-colors duration-200"
            >
              <FaRegWindowClose className="h-5 w-5 mr-2" />
              Reject
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Detailed Course Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryData.map((course) => (
            <div
              key={course.course_id}
              className="border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
              {/* Icon and Course Title */}
              <Link
                to={`/dashboard/course/${course.course_id}`}
                className="flex items-center mb-4"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <LuBook className="w-6 h-6" />
                </div>
                <h4 className="ml-4 text-lg font-semibold">
                  {course.course_name}
                </h4>
              </Link>

              {/* Enrollments */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-sm font-sans font-semibold text-gray-600">
                  <LuUsers className="w-6 h-6" /> Enrollments
                </span>
                <span className="text-gray-800 font-medium">
                  {course.enrollment_count || 0}
                </span>
              </div>

              {/* Fee Amount */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-sm font-sans font-semibold text-gray-600">
                  <LuDollarSign className="w-6 h-6" /> Fee Amount
                </span>
                <span className="text-gray-800 font-medium">
                  ${parseFloat(course.total_fee || 0).toFixed(2)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (parseFloat(course.total_paid || 0) /
                          parseFloat(course.total_fee || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-sans font-semibold text-gray-600 mt-1">
                  <span>
                    Paid: ${parseFloat(course.total_paid || 0).toFixed(2)}
                  </span>
                  <span>
                    Due: ${parseFloat(course.total_due || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center justify-between">
                <span className="flex items-center text-sm text-gray-600">
                  <LuGraduationCap className="w-6 h-6" /> Completion Rate
                </span>
                <span className="text-gray-800 font-medium">
                  {course.completion_rate || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeeStats;
