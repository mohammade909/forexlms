import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createInquiry } from "../redux/inquirySlice";
import { fetchCourses } from "../redux/courseSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const WebDesign = ({ data }) => {
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.inquiries);
  const { courses } = useSelector((state) => state.courses);

  // Validation Schema for Formik
  const InquirySchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    course: Yup.string().required("Course selection is required"),
    message: Yup.string().required("Message is required"),
  });

  useEffect(() => {
    dispatch(fetchCourses());
  }, []);
  // Submit handler for Formik
  const handleSubmit = (values, { resetForm }) => {
    dispatch(createInquiry(values));
    resetForm();
  };

  return (
    <section className="text-gray-600 body-font bg-slate-800 ">
      <div className="px-12 flex md:py-10 md:flex-row flex-col items-center">
        <div className="mt-5 md:mt-0 lg:pr-4 md:pr-15 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center sm:w-full w-full lg:w-4/6  md:w-6/12">
          <p className="text-sm font-semibold text-[#e19426] mb-3">
            {data?.[0].small_text}
          </p>
          <h1 className="text-2xl font-extrabold mb-3 dark:text-gray-100 sm:text-3xl md:text-4xl">
            {data?.[0].name}
          </h1>
          <ul className="sm:flex lg:flex block gap-4 mb-2">
            <li className="flex items-center justify-start">
              <span className="text-[#e19426]">
                Duration:{" "}
                <strong className="font-semibold">
                  {data?.[0].duration_One}
                </strong>
              </span>
            </li>
            <li className="flex items-center mt-0">
              <span className="text-[#e19426]">
                Mode: <strong className="font-semibold">Offline</strong>
              </span>
            </li>
            <li className="flex items-center mt-0">
              <span className="text-[#e19426]">
                Eligibility:{" "}
                <strong className="font-semibold">After 10th Class</strong>
              </span>
            </li>
          </ul>
          <p className="mb-5 md:pl-0 pl-2 pr-2 text-justify">
            {data?.[0].description}
          </p>
          <img src={data?.[0].image} className="mb-5" alt={data?.[0].alt} />
          <div className="flex justify-center">
            <Link
              to="#"
              className="inline-flex text-white bg-[#d58a1e] border-0 py-2 px-6 focus:outline-none hover:bg-emerald-600 rounded text-lg"
            >
              {data?.[0].join_btn}
            </Link>
          </div>
        </div>
        <div className="md:w-6/12 mb-5 md:mb-0 lg:w-1/2 sm:w-full w-full">
          <div className="flex flex-col justify-center sm:px-6 lg:px-8">
            <div className="">
              <div className="bg-white py-8 px-4 shadow-lg border sm:rounded-lg sm:px-10">
                <p className="py-2 mb-5 text-lg font-semibold text-white text-center bg-[#e19426]">
                  Quick Enquiry
                </p>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    course: "",
                    message: "",
                  }}
                  validationSchema={InquirySchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="sm:flex lg:flex block mb-3">
                        <div className="pr-2">
                          <label
                            htmlFor="firstName"
                            className="text-justify block text-sm font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="text-justify block text-sm font-medium text-gray-700"
                          >
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="sm:flex lg:flex block mt-0">
                        <div className="pr-2">
                          <label
                            htmlFor="email"
                            className="text-justify block text-sm font-medium text-gray-700"
                          >
                            Email Address
                          </label>
                          <Field
                            type="email"
                            name="email"
                            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="text-justify block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <Field
                            type="text"
                            name="phone"
                            className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="course"
                          className="text-justify block text-sm font-medium text-gray-700"
                        >
                          Course
                        </label>
                        <Field
                          as="select"
                          name="course"
                          className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Select a Course</option>
                          {courses?.map((course) => {
                            return (
                              <option
                                key={course.course_id}
                                value={course.course_id}
                              >
                                {course.course_name}
                              </option>
                            );
                          })}
                        </Field>
                        <ErrorMessage
                          name="course"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="message"
                          className="text-justify block text-sm font-medium text-gray-700"
                        >
                          Your Message
                        </label>
                        <Field
                          as="textarea"
                          name="message"
                          rows="4"
                          className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Send Request"}
                      </button>
                    </Form>
                  )}
                </Formik>
                {loading && (
                  <p className="mt-3 text-sm text-gray-500">Loading...</p>
                )}
                {message && (
                  <p className="mt-3 text-sm text-green-500">{message}</p>
                )}
                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebDesign;
