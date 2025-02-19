import React, { useState, useEffect } from 'react';
import { LuMoreVertical } from 'react-icons/lu';
import axios from 'axios'
import { formatDistanceToNow, parseISO } from 'date-fns';
const RecentUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/students/new', {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        });
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchData();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatCreatedAt = (date) => {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  };


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Users ({pagination?.total})</h2>
        <button className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-medium capitalize">{user.username}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">
                Joined {formatCreatedAt(user.created_at)}
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <LuMoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none disabled:opacity-50"
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none disabled:opacity-50"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecentUsers;