import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInquiries } from "../../../redux/inquirySlice";

const Inquiries = () => {
  const dispatch = useDispatch();
  const { inquiries, loading, error } = useSelector((state) => state.inquiries);

  useEffect(() => {
    dispatch(getAllInquiries());
  }, [dispatch]);

  if (loading) return <div className="text-center text-xl p-4">Loading...</div>;
  if (error) return <div className="text-center text-xl p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Course Inquiries</h1>
      
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto text-xs">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-2 px-4 text-left">Student Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Course Name</th>
              <th className="py-2 px-4 text-left">Course Price</th>
              {/* <th className="py-2 px-4 text-left">Course Description</th> */}
              <th className="py-2 px-4 text-left">Inquiry Message</th>
              <th className="py-2 px-4 text-left">Request Date</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.inquiry_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-700">{inquiry.student_name}</td>
                  <td className="py-2 px-4 text-gray-700">{inquiry.student_email}</td>
                  <td className="py-2 px-4 text-gray-700">{inquiry.student_phone}</td>
                  <td className="py-2 px-4 text-gray-700">{inquiry.course_name}</td>
                  <td className="py-2 px-4 text-gray-700">${inquiry.course_price}</td>
                  {/* <td className="py-2 px-4 text-gray-700">{inquiry.course_description}</td> */}
                  <td className="py-2 px-4 text-gray-700">{inquiry.inquiry_message}</td>
                  <td className="py-2 px-4 text-gray-700">{new Date(inquiry.inquiry_date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-center">
                    <button className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm rounded-md">Edit</button>
                    <button className="ml-2 text-red-500 hover:text-red-700 px-2 py-1 text-sm rounded-md">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">No inquiries available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inquiries;
