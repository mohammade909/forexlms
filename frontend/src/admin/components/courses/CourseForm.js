import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import { resetState, createCourse } from "../../../redux/courseSlice";
import { getUsers } from "../../../redux/usersSlice";
import LoadingModal from "../LoadingModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import ImageUploader from "quill-image-uploader"; // Import image uploader module
import Quill from "quill";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image"], // Add image button to toolbar
    ["clean"],
  ],
  imageUploader: {
    upload: async (file) => {
      // Custom image upload logic
      const formData = new FormData();
      formData.append("image", file);

      // Replace with your backend API endpoint for image upload
      const response = await fetch("https://your-api-url/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.url; // Return the image URL from your server
    },
  },
};
const CourseForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { loading, error, message } = useSelector((state) => state.courses);
  const { users } = useSelector((state) => state.users);
  const initialValues = {
    course_name: "",
    course_type: "",
    course_excerpt: "",
    course_duration: "",
    course_price: "",
    course_description: "",
    course_image: null,
    course_category: "",
    course_level: "",
    course_status: "",
    course_video: null,
    course_pdf: null,
    course_video_url: "",
    course_pdf_url: "",
  };

  const handleSubmit = (values) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== null && value !== ""
      )
    );

    // Dispatch the action with the filtered values
    dispatch(createCourse(filteredValues));
  };

  useEffect(() => {
    dispatch(getUsers({ user_type: "Teacher" }));
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const courseValidationSchema = Yup.object().shape({
    course_name: Yup.string()
      .required("Course name is required")
      .max(100, "Course name cannot exceed 100 characters"),

    course_duration: Yup.string()
      .required("Course duration is required")
      .matches(
        /^\d+ (hour|day|week|month|year)s?$/,
        'Course duration must be in the format of number and time unit (e.g., "2 weeks")'
      ),
    course_price: Yup.number()
      .required("Course price is required")
      .min(0, "Course price cannot be negative"),
    course_description: Yup.string().required("Course description is required"),
    course_excerpt: Yup.string().required("Course description is required"),
    course_image: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileSize",
        "Image size is too large",
        (value) => !value || (value && value.size <= 2000000)
      ) // 2MB
      .test(
        "fileFormat",
        "Unsupported format",
        (value) =>
          !value ||
          (value &&
            ["image/jpg", "image/jpeg", "image/png"].includes(value.type))
      ),
    course_category: Yup.string().required("Course category is required"),
    course_level: Yup.string()
      .required("Course level is required")
      .oneOf(
        ["beginner", "intermediate", "advanced"],
        'Course level must be either "beginner", "intermediate", or "advanced"'
      ),

    course_video: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileSize",
        "Video size is too large",
        (value) => !value || (value && value.size <= 50000000)
      ) // 50MB
      .test(
        "fileFormat",
        "Unsupported format",
        (value) =>
          !value || (value && ["video/mp4", "video/mov"].includes(value.type))
      ),
    course_pdf: Yup.mixed()
      .nullable()
      .notRequired()
      .test(
        "fileSize",
        "PDF size is too large",
        (value) => !value || (value && value.size <= 10000000)
      ) // 10MB
      .test(
        "fileFormat",
        "Unsupported format",
        (value) => !value || (value && value.type === "application/pdf")
      ),
    course_video_url: Yup.string()
      .url("Invalid URL format")
      .nullable()
      .notRequired(),
    course_pdf_url: Yup.string()
      .url("Invalid URL format")
      .nullable()
      .notRequired(),
  });
  return (
    <div className="pb-20">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
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
          validationSchema={courseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="flex bg-white p-5 gap-5">
              <div className="md:w-2/3">
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
                  <label className="block text-gray-700">Course Excerpt</label>
                  <Field
                    name="course_excerpt"
                    className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                  />
                  <ErrorMessage
                    name="course_excerpt"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                 
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Course Description
                  </label>
                  <ReactQuill
                    value={values.course_description}
                    onChange={(value) =>
                      setFieldValue("course_description", value)
                    }
                    modules={modules} // Set Quill modules for image uploading
                    className="bg-white h-[300px]"
                  />

                  <ErrorMessage
                    name="course_description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3">
              
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
                  <label className="block text-gray-700">Course Image</label>
                  <input
                    name="course_image"
                    type="file"
                    className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                    onChange={(event) => {
                      setFieldValue(
                        "course_image",
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  <ErrorMessage
                    name="course_image"
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
              
                {/* <div className="mb-4">
                  <label className="block text-gray-700">Course Video</label>
                  <input
                    name="course_video"
                    type="file"
                    className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                    onChange={(event) => {
                      setFieldValue(
                        "course_video",
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  <ErrorMessage
                    name="course_video"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Course PDF</label>
                  <input
                    name="course_pdf"
                    type="file"
                    className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                    onChange={(event) => {
                      setFieldValue("course_pdf", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage
                    name="course_pdf"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Course Video URL
                  </label>
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
                </div> */}
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded"
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

export default CourseForm;
