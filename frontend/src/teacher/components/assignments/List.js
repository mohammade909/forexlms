import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignments,
  deleteAssignment,
} from "../../../redux/assignmentSlice"; // Adjust path as needed
import { Link, useParams } from "react-router-dom";
import ConfirmPopup from "../../../components/ConfirmPopup";
const List = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { assignments, pagination, loading } = useSelector(
    (state) => state.assignments
  );

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Fetch assignments when component mounts or dependencies change
  useEffect(() => {
    dispatch(fetchAssignments({ page, startDate, endDate, classId: id }));
  }, [dispatch, page, startDate, endDate, id]);

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      setPage(newPage);
    }
  };

  // Filter assignments locally based on the search input
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = (id) => {
    setOpenConfirm(true);
    setSelectedAssignment(id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
        />
        <Link
          to="/teacher/assignments/create"
          className="inline-flex items-center bg-gray-800 px-4 py-2 border border-gray-300 rounded-md text-sm leading-5 font-medium text-white hover:text-gray-300 hover:bg-gray-600 hover:border-gray-400 focus:outline-none focus:border-blue-300"
        >
          Create New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Due Date</th>
              <th className="px-4 py-2 border">Course Name</th>
              <th className="px-4 py-2 border">Max Score</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <tr
                  key={assignment.assignment_id}
                  className="bg-white hover:bg-gray-100"
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{assignment.title}</td>
                  <td className="px-4 py-2 border" >{assignment.excerpt}</td>
                  <td className="px-4 py-2 border">
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{assignment.course_name}</td>
                  <td className="px-4 py-2 border">{assignment.max_score}</td>
                  <td className="py-2 border flex justify-between">
                    <Link
                      className="text-blue-300 underline"
                      to={`/teacher/assignments/${assignment.assignment_id}`}
                    >
                      View
                    </Link>
                    <button
                      className="text-red-300 underline"
                      onClick={() => handleDelete(assignment.assignment_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {pagination?.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination?.totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      <ConfirmPopup
        isOpen={openConfirm}
        onClose={() => setOpenConfirm(false)}
        actionFunction={deleteAssignment}
        message="Are you sure you want to delete this Assignment?"
        id={selectedAssignment}
      />
    </div>
  );
};

export default List;
