import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addTicketResponse, fetchTicketById } from "../../../redux/ticketSlice";
import { Formik, Field, Form } from "formik"; 

const TicketChat = () => {
  const { ticketId } = useParams();
  const dispatch = useDispatch();

  // Access ticket data from Redux store
  const { ticket, loading, error } = useSelector((state) => state.tickets);

  // Get the user_id from auth state (assuming it's in the auth slice of Redux)
  const { auth } = useSelector((state) => state.auth); // Adjust this if you store auth differently
  const { user_id, name: username } = auth;
  const [responses, setResponses] = useState(ticket?.responses || []);

  // Create a ref for the messages container to control scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [ticketId, dispatch]);

  useEffect(() => {
    if (ticket?.responses) {
      // Create a copy of the responses array and sort it in ascending order by created_at
      const sortedResponses = [...ticket.responses].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setResponses(sortedResponses);
    }
  }, [ticket]);

  useEffect(() => {
    // Scroll to the bottom whenever responses change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]); // This effect runs whenever responses state changes

  // Formik initial values
  const initialValues = {
    message: "", // Start with an empty message field
    from: user_id, // Use the actual logged-in user ID
    to: ticket?.creator?.user_id, // Set the recipient user ID (assuming creator of the ticket)
  };

  const handleSendResponse = (values, { resetForm }) => {
    dispatch(
      addTicketResponse({ ticketId, responseData: values })
    );
    dispatch(fetchTicketById(ticketId));

    resetForm(); // Reset the form after sending the message
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{ticket?.subject}</h1>
        <p className="text-gray-700 mt-2">{ticket?.description}</p>
        <div className="mt-4">
          <span className="text-sm text-gray-500">
            Status: {ticket?.status}
          </span>
          <span className="ml-4 text-sm text-gray-500">
            Priority: {ticket?.priority}
          </span>
        </div>
      </div>

      <div
        className="space-y-4 mb-6 overflow-y-auto max-h-96 no-scrollbar"
        style={{ maxHeight: "400px" }}
      >
        {responses.map((response) => (
          <div
            key={response.response_id}
            className={`p-4 rounded-lg ${
              response.from.user_id === user_id
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
            style={{
              width: "fit-content",
              marginLeft: response.from.user_id === user_id ? "auto" : "0",
            }} // Align based on user
          >
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{response.from.username}</span>
              <span>{new Date(response.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-800">{response.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll reference */}
      </div>

      <Formik initialValues={initialValues} onSubmit={handleSendResponse}>
        {({ values, handleChange }) => (
          <Form className="flex flex-col space-y-4">
            <Field
              as="textarea"
              name="message"
              value={values.message}
              onChange={handleChange}
              className="p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your response here..."
              rows="4"
            />
            <button
              type="submit"
              className="self-end px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TicketChat;
