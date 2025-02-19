import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import FileUploadComponent from "../FileUploadComponent";
import { createStudent, resetState } from "../../../redux/studentSlice";
import { fetchCourses } from "../../../redux/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
const StudentForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [classId, setClassId] = useState();
  const [dueAmount, setDueAmount] = useState();
  const [openError, setOpenError] = useState(false);
  const { loading, error, message } = useSelector((state) => state.students);
  const { courses } = useSelector((state) => state.courses);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    blood_group: Yup.string().required("Blood group is required"),
    phone: Yup.string().required("Phone number is required"),
    street_address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    pin_code: Yup.string().required("Pin code is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);
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
      <SuccessModal
        open={open}
        setOpen={setOpen}
        message='Student has successfully Created'
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      <Formik
        initialValues={{
          profile_photo: "",
          gender: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          date_of_birth: "",
          blood_group: "",
          phone: "",
          street_address: "",
          city: "",
          pin_code: "",
          username: "",
          email: "",
          password: "",
          course_id: "",
          paid: "",
          due:"",
          fee_amount: "",

          // parent information
          parent_profile_photo: "",
          parent_gender: "",
          parent_first_name: "",
          parent_middle_name: "",
          parent_last_name: "",
          parent_date_of_birth: "",
          parent_blood_group: "",
          parent_phone: "",
          parent_username: "",
          parent_email: "",
          parent_password: "",
          education: "",
          profession: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          values.fee_amount = Number(courseDetails.course_price);
          const formData = new FormData();
          console.log(values);
          
          // Append all fields to FormData
          for (let key in values) {
            if (key === "profile_photo") {
              formData.append(key, values[key]); // Add file directly
            } else {
              formData.append(key, values[key]); // Add other fields
            }
          }

          // Dispatch action with FormData
          dispatch(createStudent(formData));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            {/* Personal Details Section - Full Width */}
            <div className=" bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="flex items-center">
                <div className="w-full md:w-1/3 ">
                  <FileUploadComponent setFieldValue={setFieldValue} />
                </div>
                <div className="w-full md:w-2/3 ">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Gender</label>

                    {/* Male Radio Button */}
                    <label className="inline-flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value="Male"
                        className="mr-2"
                      />
                      Male
                    </label>

                    {/* Female Radio Button */}
                    <label className="inline-flex items-center ml-4">
                      <Field
                        type="radio"
                        name="gender"
                        value="Female"
                        className="mr-2"
                      />
                      Female
                    </label>

                    {/* Other Radio Button */}
                    <label className="inline-flex items-center ml-4">
                      <Field
                        type="radio"
                        name="gender"
                        value="Other"
                        className="mr-2"
                      />
                      Other
                    </label>

                    {/* Error message */}
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-600 mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* First Name, Last Name, Middle Name */}

                    <div>
                      <label className="block text-gray-700">First Name</label>
                      <Field
                        name="first_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Middle Name</label>
                      <Field
                        name="middle_name"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Last Name</label>
                      <Field
                        name="last_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Photo */}

              {/* Blood Group, Phone, Qualification */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700">Date of Birth</label>
                  <Field
                    name="date_of_birth"
                    type="date"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="date_of_birth"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Blood Group</label>
                  <Field
                    name="blood_group"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="blood_group"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Phone</label>
                  <Field
                    name="phone"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <hr className="mt-10" />
              {/* Address, City, Pin Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700">Address</label>
                  <Field
                    name="street_address"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="street_address"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">City</label>
                  <Field name="city" className="w-full p-2 border rounded-md" />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Pin Code</label>
                  <Field
                    name="pin_code"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="pin_code"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>

            <div className=" bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Parent Details</h2>
              <div className="flex items-center">
                <div className="w-full md:w-1/3 ">
                  <FileUploadComponent setFieldValue={setFieldValue} />
                </div>
                <div className="w-full md:w-2/3 ">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Gender</label>

                    {/* Male Radio Button */}
                    <label className="inline-flex items-center">
                      <Field
                        type="radio"
                        name="parent_gender"
                        value="Male"
                        className="mr-2"
                      />
                      Male
                    </label>

                    {/* Female Radio Button */}
                    <label className="inline-flex items-center ml-4">
                      <Field
                        type="radio"
                        name="parent_gender"
                        value="Female"
                        className="mr-2"
                      />
                      Female
                    </label>

                    {/* Other Radio Button */}
                    <label className="inline-flex items-center ml-4">
                      <Field
                        type="radio"
                        name="parent_gender"
                        value="Other"
                        className="mr-2"
                      />
                      Other
                    </label>

                    {/* Error message */}
                    <ErrorMessage
                      name="parent_gender"
                      component="div"
                      className="text-red-600 mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* First Name, Last Name, Middle Name */}

                    <div>
                      <label className="block text-gray-700">First Name</label>
                      <Field
                        name="parent_first_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="parent_first_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Middle Name</label>
                      <Field
                        name="parent_middle_name"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700">Last Name</label>
                      <Field
                        name="parent_last_name"
                        className="w-full p-2 border rounded-md"
                      />
                      <ErrorMessage
                        name="parent_last_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Profile Photo */}

              {/* Blood Group, Phone, Qualification */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700">username</label>
                  <Field
                    name="parent_username"
                    type="text"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_username"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Password</label>
                  <Field
                    name="parent_password"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_password"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Confirm Password
                  </label>
                  <Field
                    name="parent_password"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_password"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Blood Group</label>
                  <Field
                    name="parent_blood_group"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_blood_group"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Email</label>
                  <Field
                    name="parent_email"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_email"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <Field
                    name="parent_phone"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="parent_phone"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Education</label>
                  <Field
                    name="education"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="education"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Profession</label>
                  <Field
                    name="profession" 
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="profession"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <hr className="mt-10" />
            </div>

            {/* Account Information Section - Half Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">Account Information</h2>
                <div>
                  <label className="block text-gray-700">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Username, Email, Password */}
                <div>
                  <label className="block text-gray-700">Username</label>
                  <Field
                    name="username"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Confirm Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">Enrollment Details</h2>
                <div className="mb-4">
                  <label className="block text-gray-700">Select Course</label>
                  <Field
                    as="select" // Render the Field as a select tag
                    name="course_id"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      const selectedCourseId = e.target.value;
                      setFieldValue("course_id", selectedCourseId); // Update Formik state
                      const selectedCourse = courses.find(
                        (course) =>
                          course.course_id === parseInt(selectedCourseId, 10)
                      );
                      setCourseDetails(selectedCourse); // Update local courseDetails state
                    }}
                  >
                    <option value="" label="Select a course">
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))}
                  </Field>
                </div>

                {courseDetails && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Course Details:</h3>
                    <p>
                      <strong>Name:</strong> {courseDetails.course_name}
                    </p>
                    {/* <p>
                      <strong>Description:</strong>{" "}
                      {courseDetails.course_description}
                    </p> */}
                    <p>
                      <strong>Price:</strong> {courseDetails.course_price}
                    </p>
                    {dueAmount && (
                      <p>
                        <strong>Due:</strong> {dueAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                {/* Username, Email, Password */}
                <div>
                  <label className="block text-gray-700">Fee Deposit</label>
                  <Field
                    name="paid"
                    type="number"
                    onChange={(e) => {
                      const amount = e.target.value;
                      setFieldValue("paid", amount);
                      const due =
                        Number(courseDetails?.course_price) - Number(amount);
                      setFieldValue("due", due);
                      setDueAmount(due);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className={`relative flex items-center justify-center px-6 py-2 rounded-md text-white font-semibold transition-all 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed opacity-75"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
          </Form>
        )}
      </Formik>
    </>
  );
};

const Spinner = () => (
  <svg
    className="w-5 h-5 text-white animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

export default StudentForm;
