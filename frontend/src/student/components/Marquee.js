import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserNotifications } from "../../redux/notificationSlice"; // Ensure the path is correct
import { FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'; // Import necessary icons
import { AiOutlineClose } from 'react-icons/ai'; // Import AiOutlineClose icon

const Marquee = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);  // Make sure notifications are in the correct state slice
  const { auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth?.user_id) {
      dispatch(getUserNotifications(auth.user_id)); // Dispatch action to fetch notifications for the user
    }
  }, [dispatch, auth?.user_id]);

  // Sort notifications by `created_at` and get the newest notification
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const newestNotification = sortedNotifications[0]; // Get the newest notification

  return (
    <>
      {newestNotification && (
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-lg font-semibold">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <div className={`inline-block mr-8 ${newestNotification.type === 'info' ? 'bg-[#e4e7f0fa] text-[#0396ff]' : newestNotification.type === 'warning' ? 'bg-[#edf0f9] text-[#ffb103]' : 'bg-[#f1f3fb] text-[#ff0303]'} border border-[#063c96] shadow-md rounded-lg p-3 flex items-center justify-between`}>
                <div className="flex items-center">
                  <span className={`icon ${newestNotification.type === 'info' ? 'text-[#0bd2ff]' : newestNotification.type === 'warning' ? 'text-[#ffb103]' : 'text-[#ff0303]'}`}>
                    {newestNotification.type === 'info' ? <FaInfoCircle /> : newestNotification.type === 'warning' ? <FaExclamationTriangle /> : <FaTimesCircle />}
                  </span>
                  <div className="ml-2">
                    <strong className="font-semibold">{newestNotification.title}</strong>
                    <p>{newestNotification.message}</p>
                    <span className="text-sm text-[#9090a2]">{new Date(newestNotification.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button type="button" className="text-2xl text-[#ff0303] hover:animate-bounce">
                  <AiOutlineClose />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Marquee;
