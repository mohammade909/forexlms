import React,{useState, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import ImageUploader from "quill-image-uploader"; // Import image uploader module
import Quill from "quill"; // Import Quill for customization
import { createBlog, resetState } from "../../../redux/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
// Register ImageUploader for Quill
Quill.register("modules/imageUploader", ImageUploader);

const BlogForm = () => {
  const { loading, error, message } = useSelector((state) => state.blogs);
  const { auth } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const initialValues = {
    title: "",
    content: "",
    blog_excerpt: "",
    category: "",
    tags: "",
    author_id: auth.user_id,
    status: "",
    blog_image: null,
    video: null,
  };

  const dispatch = useDispatch();

  const handleSubmit = (values) => {
      
    dispatch(createBlog(values));
  };

  // Quill modules configuration for image upload
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

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  return (
    <div className="pb-20">
      <div className="max-w-full mx-auto p-2 rounded">
        <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
        <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
        <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="flex mb-6">
                {/* Left side: Quill Editor with Title Above */}
                <div className="w-2/3 pr-4">
                  {/* Title Field */}
                  <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <Field
                      name="title"
                      type="text"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Excerpt</label>
                    <Field
                      as="textarea"
                      name="blog_excerpt"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                    />
                    <ErrorMessage
                      name="blog_excerpt"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {/* Quill Editor */}
                  <label className="block text-gray-700">Content</label>
                  <ReactQuill
                    value={values.content}
                    onChange={(value) => setFieldValue("content", value)}
                    modules={modules} // Set Quill modules for image uploading
                    className="bg-white h-[300px]"
                  />
                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  {/* Excerpt Below Quill Editor */}
                
                </div>

                {/* Right side: Other Fields */}
                <div className="w-1/3 pl-4">
                  <div className="mb-4">
                    <label className="block text-gray-700">Category</label>
                    <Field
                      name="category"
                      type="text"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                    />
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Tags</label>
                    <Field
                      name="tags"
                      type="text"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                    />
                    <ErrorMessage
                      name="tags"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                    >
                      <option value="" label="Select status" />
                      <option value="draft" label="Draft" />
                      <option value="published" label="Published" />
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Image</label>
                    <input
                      name="blog_image"
                      type="file"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                      onChange={(event) => {
                        setFieldValue("blog_image", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage
                      name="blog_image"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Video</label>
                    <input
                      name="video"
                      type="file"
                      className="w-full mt-2 p-2 border border-gray-300 rounded bg-white"
                      onChange={(event) => {
                        setFieldValue("video", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage
                      name="video"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded"
                  >
                    {loading ? <Spinner /> : "Submit"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BlogForm;
