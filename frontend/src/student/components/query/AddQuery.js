import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTicket, resetState } from "../../../redux/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import LoadingModal from "../../../admin/components/LoadingModal";

const AddQuery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { loading, error, message } = useSelector((state) => state.tickets);
  const {auth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const initialValues = {
    subject: "",
    description: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
  });

  const onSubmit = (values) => {
    values.user_id = auth?.user_id
    dispatch(createTicket(values));
    console.log(values);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Query</h2>
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
      <LoadingModal isLoading={loading} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className="space-y-6">
            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Field
                name="subject"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                
              </Field>
              <ErrorMessage
                name="subject"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)} // Navigate back
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Create Ticket
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddQuery;
