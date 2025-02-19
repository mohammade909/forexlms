import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeesByStudentId } from "../../redux/feeSlice";

const FeesReport = () => {
  const dispatch = useDispatch();
  const { fees, loading, error } = useSelector((state) => state.fees);
  const { auth } = useSelector((state) => state.auth);
  const userId = auth?.user_id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchFeesByStudentId(userId));
    }
  }, [userId, dispatch]);

  if (loading) return <p>Loading fees data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-600 p-6">Fees Report</h2>
      <table className="table-auto w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Course Name</th>
            <th className="px-4 py-2 border">Total Fee</th>
            <th className="px-4 py-2 border">Paid</th>
            <th className="px-4 py-2 border">Due</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Payment Date</th>
            <th className="px-4 py-2 border">Payment Method</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr key={fee.fee_id} className="text-center hover:bg-gray-50">
              <td className="px-4 py-2 border">{index+1}</td>
              <td className="px-4 py-2 border">{fee.course_name}</td>
              <td className="px-4 py-2 border">${fee.total_fee}</td>
              <td className="px-4 py-2 border">${fee.paid}</td>
              <td className="px-4 py-2 border">${fee.due}</td>
              <td className="px-4 py-2 border capitalize">{fee.status}</td>
              <td className="px-4 py-2 border">
                {new Date(fee.payment_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">{fee.payment_method}</td>
              <td className="px-4 py-2 border">
                {fee.due > 0 ? <button className="bg-blue-500 px-2 py-1 rounded text-white">Pay fee</button>:''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesReport;
