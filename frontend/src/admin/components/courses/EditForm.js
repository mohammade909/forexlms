import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { courseValidationSchema } from "../../formik/course/courseValidation";
import { updatecourse, getcourseById } from "../../actions/course";
import { useDispatch, useSelector } from "react-redux";
import SuccessAlert from "../../BaseFiles/SuccessAlert";
import ErrorAlert from "../../BaseFiles/ErrorAlert";
import { useParams } from "react-router-dom";
import { clearErrors, clearMessage } from "../../redux/courseSlice";
import { useNavigate } from "react-router-dom";
const EditForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, message, course } = useSelector(
    (state) => state.courses
  );

  useEffect(() => {
    dispatch(getcourseById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearErrors());
      }, 3000);
    }
    if (message) {
      setTimeout(() => {
        dispatch(clearMessage());
        navigate('/admin/courses');

      }, 3000);
    }
  }, [error, message, dispatch]);

  // Initialize form values once course data is available
  const initialValues = course
    ? {
        course_name: course.course_name || "",
        course_code: course.course_code || "",
        course_type: course.course_type || "",
        course_duration: course.course_duration || "",
        course_price: course.course_price || "",
        course_image: course.course_image || "",
        course_description: course.course_description || "",
        course_category: course.course_category || "",
        course_level: course.course_level || "",
        course_language: course.course_language || "",
        course_author: course.course_author || "",
        course_status: course.course_status || "",
        course_video_url: course.course_video_url || "",
        course_pdf_url: course.course_pdf_url || "",
      }
    : {
        course_name: "",
        course_code: "",
        course_type: "",
        course_duration: "",
        course_price: "",
        course_description: "",
        course_image:"",
        course_category: "",
        course_level: "",
        course_language: "",
        course_author: "",
        course_status: "",
        course_video_url: "",
        course_pdf_url: "",
      };

  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    dispatch(updatecourse({ course_id: id, updatedData: values }));
    // resetForm();
  };

  return (
    <div className="pb-20">
      <div className="max-w-full mx-auto bg-white p-8  shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
        {message ? <SuccessAlert message={message} /> : error ? <ErrorAlert error={error} />  :
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Reset form when initialValues change
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Course Name</label>
                <Field
                  name="course_name"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Code</label>
                <Field
                  name="course_code"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_code"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Type</label>
                <Field
                  as="select"
                  name="course_type"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                >
                  <option value="" label="Select type" />
                  <option value="online" label="Online" />
                  <option value="offline" label="Offline" />
                </Field>
                <ErrorMessage
                  name="course_type"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Duration</label>
                <Field
                  name="course_duration"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_duration"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Price</label>
                <Field
                  name="course_price"
                  type="number"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Course Description
                </label>
                <Field
                  as="textarea"
                  name="course_description"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Category</label>
                <Field
                  name="course_category"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_category"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Level</label>
                <Field
                  as="select"
                  name="course_level"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                >
                  <option value="" label="Select level" />
                  <option value="beginner" label="Beginner" />
                  <option value="intermediate" label="Intermediate" />
                  <option value="advanced" label="Advanced" />
                </Field>
                <ErrorMessage
                  name="course_level"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Language</label>
                <Field
                  name="course_language"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_language"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Author</label>
                <Field
                  name="course_author"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_author"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Status</label>
                <Field
                  as="select"
                  name="course_status"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                >
                  <option value="" label="Select status" />
                  <option value="draft" label="Draft" />
                  <option value="published" label="Published" />
                  <option value="archived" label="Archived" />
                </Field>
                <ErrorMessage
                  name="course_status"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Image</label>
                <input
                  name="course_image"
                  type="file"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                  onChange={(event) => {
                    setFieldValue("course_image", event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage
                  name="course_image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course Video URL</label>
                <Field
                  name="course_video_url"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_video_url"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course PDF URL</label>
                <Field
                  name="course_pdf_url"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="course_pdf_url"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                {loading ? "Updating...": 'Submit'}
              </button>
            </Form>
          )}
        </Formik>}
      </div>
    </div>
  );
};

export default EditForm;
