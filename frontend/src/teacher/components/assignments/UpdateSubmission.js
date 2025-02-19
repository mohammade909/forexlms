import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdateSubmision = ({ isOpen, onClose, onSubmit }) => {

  const initialValues = {
    submission_id: "",
    grade: "",
    feedback: "",
    status: "",
  };

  const validationSchema = Yup.object({
    grade: Yup.number().min(0).max(100, "Grade must be between 0 and 100"),
    feedback: Yup.string().max(500, "Feedback can't exceed 500 characters"),
    status: Yup.string().required("Status is required"),
  });

  const handleFormSubmit = (values) => {
    onSubmit({ ...values });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Submit Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 gap-4">
              

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium">
                    Grade
                  </label>
                  <Field
                    type="number"
                    id="grade"
                    name="grade"
                    className="mt-1 p-2 block w-full border rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="grade"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium"
                  >
                    Feedback
                  </label>
                  <Field
                    as="textarea"
                    id="feedback"
                    name="feedback"
                    className="mt-1 p-2 block w-full border rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="feedback"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium">
                    Status
                  </label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="mt-1 p-2 block w-full border rounded-md focus:ring focus:ring-blue-300"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="graded">Graded</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateSubmision;
