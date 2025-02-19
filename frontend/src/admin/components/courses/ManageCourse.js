import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCourses } from "../../actions/course";
import * as Yup from "yup";
import { BASEURL } from "../../baseurl";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ManageCourse = () => {
  const dispatch = useDispatch();
  const { courses, status } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const CourseSchema = Yup.object().shape({
    course_id: Yup.string().required("Course is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${BASEURL}/api/v1/courses/assign`, {
        ...values, instructor_id:user.user_id // This includes both course_id and user_id
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Course</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {user.first_name} {user.last_name}
          </p>
          <p>
            <strong>User Type:</strong> {user.user_type}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          <p>
            <strong>Qualifications:</strong> {user.qualifications}
          </p>
        </div>
        <Formik
          initialValues={{ course_id: "", user_id: user.user_id }}
          validationSchema={CourseSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Field
                  as="select"
                  name="course_id"
                  className="px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Course</option>
                  {status === "loading" ? (
                    <option>Loading courses...</option>
                  ) : courses.length > 0 ? (
                    courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_name}
                      </option>
                    ))
                  ) : (
                    <option>No courses available</option>
                  )}
                </Field>
                
                {/* Hidden field for user_id */}
                <Field
                  name="user_id"
                  type="hidden"
                  className="hidden"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                  disabled={isSubmitting}
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

export default ManageCourse;
