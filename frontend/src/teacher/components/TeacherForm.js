import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FileUploadComponent from "./FileUploadComponent";
import { createTeacher, resetState } from "../../redux/teacherSlice";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
const TeacherForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { loading, error, message } = useSelector((state) => state.teachers);
  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    blood_group: Yup.string().required("Blood group is required"),
    phone: Yup.string().required("Phone number is required"),
    qualification: Yup.string().required("Qualification is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    pin_code: Yup.string().required("Pin code is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    employee_code: Yup.string().required("Employee code is required"),
    current_position: Yup.string().required("Current position is required"),
    joining_date: Yup.date().required("Joining date is required"),
  });

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
        message={message}
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
          qualification: "",
          address: "",
          city: "",
          pin_code: "",
          username: "",
          email: "",
          password: "",
          joining_date: "",
          leaving_date: "",
          current_position: "",
          employee_code: "",
          working_hours_per_week: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();

          // Append all fields to FormData
          for (let key in values) {
            if (key === "profile_photo") {
              formData.append(key, values[key]); // Add file directly
            } else {
              formData.append(key, values[key]); // Add other fields
            }
          }

          // Dispatch action with FormData
          dispatch(createTeacher(formData));
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div>
                  <label className="block text-gray-700">Qualification</label>
                  <Field
                    name="qualification"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="qualification"
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
                    name="address"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address"
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
              </div>

              {/* School Details Section - Half Width */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-lg font-semibold">School Details</h2>

                <div>
                  <label className="block text-gray-700">Joining Date</label>
                  <Field
                    name="joining_date"
                    type="date"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="joining_date"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Leaving Date</label>
                  <Field
                    name="leaving_date"
                    type="date"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="leaving_date"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Current Position
                  </label>
                  <Field
                    name="current_position"
                    className="w-full p-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="current_position"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                {/* Employee Code, Current Position, Joining Date, Leaving Date, Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="block text-gray-700">Employee Code</label>
                    <Field
                      name="employee_code"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="employee_code"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Working Hours</label>
                    <Field
                      name="working_hours_per_week"
                      className="w-full p-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="working_hours_per_week"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default TeacherForm;
