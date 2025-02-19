import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createEvent, resetState } from "../../../redux/eventSlice"; // Import your action to create an event
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.string().required("Start date is required"),
  end_date: Yup.string().required("End date is required"),
  location: Yup.string().required("Location is required"),
});

const EventForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  
  const { loading, error, message } = useSelector((state) => state.events); // Adjust based on your state structure

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  return (
    <>
      <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
      <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />

      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-4">Create Event</h1>
        <Formik
          initialValues={{
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            location: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            // Dispatch createEvent action with form values
            dispatch(createEvent(values));
          }}
        >
          {() => (
            <Form className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              </div>
              <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
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
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default EventForm;
