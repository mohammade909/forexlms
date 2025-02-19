import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  resetState,
} from "../../../redux/announcementSlice";
import { FaBullhorn } from "react-icons/fa";
import { LuCalendarDays, LuTrash2, LuPen } from "react-icons/lu";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { formatDistanceToNow } from "date-fns";
import ConfirmPopup from "../../../components/ConfirmPopup";
const AnnouncementList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { announcements, loading, error, message } = useSelector(
    (state) => state.announcements
  );
  const [announcementId, setAnnouncementId] = useState(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  useEffect(() => {
    dispatch(getAnnouncements());
  }, [dispatch]);

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      dispatch(createAnnouncement(newAnnouncement));
      setNewAnnouncement({ title: "", content: "" });
    }
  };

  const handleUpdateAnnouncement = (id, updatedAnnouncement) => {
    dispatch(updateAnnouncement({ id, announcementData: updatedAnnouncement }));
  };

  const handleDeleteAnnouncement = (id) => {
    dispatch(deleteAnnouncement(id));
  };

  const handleUpdate = (announcementId) => {
    // Handle update logic here
   
    console.log(`Update announcement ${announcementId}`);
  };

  const handleDelete = (announcementId) => {
    // Handle delete logic here
    setAnnouncementId(announcementId);
    setShow(true);
    console.log(`Delete announcement ${announcementId}`);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Announcements
      </h1>
      <SuccessModal
        open={open}
        setOpen={setOpen}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <ConfirmPopup
        isOpen={show}
        onClose={() => setShow(false)}
        actionFunction={deleteAnnouncement}
        message="Are you sure you want to delete this Announcemnt?"
        id={announcementId}
      />
      {/* Create Announcement Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Announcement</h2>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="content"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            value={newAnnouncement.content}
            onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                content: e.target.value,
              })
            }
          ></textarea>
        </div>
        <button
          onClick={handleCreateAnnouncement}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {announcements.map((announcement) => (
          <div
            key={announcement.announcement_id}
            className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header with Announcement Icon */}
            <div className="p-4 bg-blue-50  rounded-t-lg border-b border-gray-300 flex items-center space-x-2 text-blue-800">
              <FaBullhorn className="text-blue-800 w-6 h-6" />
              <h3 className="text-lg font-semibold ">{announcement.title}</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-gray-700">{announcement.content}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <LuCalendarDays className="w-6 h-6" />
                <span className="text-sm font-semibold capitalize">
                  {formatDistanceToNow(
                    new Date(announcement.announcement_date),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-300 flex justify-between items-center">
              <button
                onClick={() => handleUpdate(announcement.announcement_id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition duration-200"
              >
                <LuPen />
                <span className="text-sm font-semibold">Update</span>
              </button>
              <button
                onClick={() => handleDelete(announcement.announcement_id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition duration-200"
              >
                <LuTrash2 />
                <span className="text-sm font-semibold">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
