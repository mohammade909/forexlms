import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { createOffer, resetState } from "../../../redux/offersSlice";
import LoadingModal from "../LoadingModal";
const OfferForm = () => {
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.offers); // Adjust based on your state structure

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  // Initial form values
  const initialValues = {
    title: "",
    description: "",
    image_url: "",
    regular_price: "",
    offer_price: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(createOffer(values));
    resetForm();
    // Add your submission logic here
  };

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Create Offer
      </h2>
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
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-gray-600 mb-1">
                Title
              </label>
              <Field
                id="title"
                name="title"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-gray-600 mb-1">
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image_url" className="block text-gray-600 mb-1">
                Image
              </label>
              <input
                id="image_url"
                type="file"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(event) => {
                  setFieldValue("image_url", event.target.files[0]);
                }}
              />
              <ErrorMessage
                name="image_url"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Regular Price */}
            <div>
              <label
                htmlFor="regular_price"
                className="block text-gray-600 mb-1"
              >
                Regular Price
              </label>
              <Field
                id="regular_price"
                name="regular_price"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter regular price"
              />
              <ErrorMessage
                name="regular_price"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Offer Price */}
            <div>
              <label htmlFor="offer_price" className="block text-gray-600 mb-1">
                Offer Price
              </label>
              <Field
                id="offer_price"
                name="offer_price"
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter offer price"
              />
              <ErrorMessage
                name="offer_price"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OfferForm;
