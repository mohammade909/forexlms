import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import {
  fetchEvents,
  deleteEvent,
  updateEvent,
  resetState,
} from "../../../redux/eventSlice"; // Redux actions for events
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";

const EventsTable = () => {
  const dispatch = useDispatch();
  const { events, loading, error, message } = useSelector(
    (state) => state.events
  );
  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents()); // Fetch events on component load

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setEventId(id);
    setOpen(true);
  };

  const handleEdit = (event) => {
    setEventToEdit(event);
    setEditModalOpen(true);
  };

  // Validation schema for editing the event
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Event title is required"),
    description: Yup.string().required("Description is required"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required"),
    location: Yup.string().required("Location is required"),
  });

  return (
    <div className="overflow-x-auto">
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-400 bg-white text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Start Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">End Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.event_id}
              className="hover:bg-gray-50 hover:underline hover:cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{event.title}</td>
              <td className="border border-gray-300 px-4 py-2">{event.description}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(event.start_date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(event.end_date).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{event.location}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.event_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteEvent}
        message="Are you sure you want to delete this event?"
        id={eventId}
      />

      {/* Edit Modal */}
      {editModalOpen && eventToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>
            <Formik
              initialValues={{
                title: eventToEdit.title,
                description: eventToEdit.description,
                start_date: eventToEdit.start_date.slice(0, 16),
                end_date: eventToEdit.end_date.slice(0, 16),
                location: eventToEdit.location,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(
                  updateEvent({
                    eventData: values,
                    eventId: eventToEdit.event_id,
                  })
                );
                setEditModalOpen(false); // Close modal after update
              }}
            >
              {() => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Title</label>
                    <Field
                      name="title"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Start Date</label>
                    <Field
                      type="datetime-local"
                      name="start_date"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="start_date"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">End Date</label>
                    <Field
                      type="datetime-local"
                      name="end_date"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="end_date"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Location</label>
                    <Field
                      name="location"
                      className="w-full p-2 border rounded-md text-sm"
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTable;
