import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import { getClasses } from "../../../redux/classSlice"; // Adjust the path as needed
import { createAssignment, resetState } from "../../../redux/assignmentSlice"; // Adjust the path as needed
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const AssignmentForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { classes, loading: courseLoading } = useSelector(
    (state) => state.classes
  );
  const { loading, error, message } = useSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(getClasses());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const initialValues = {
    course_id: "",
    class_id: "",
    instructor_id: "",
    title: "",
    description: "",
    excerpt: "",
    due_date: "",
    max_score: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    due_date: Yup.date().required("Due date is required"),
    max_score: Yup.number().positive().required("Max score is required"),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(createAssignment(values))
      .unwrap()
      .then(() => {
        resetForm();
        alert("Assignment created successfully!");
      })
      .catch((err) => {
        alert(`Error creating assignment: ${err}`);
      });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Create Assignment
      </h1>
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="flex flex-col lg:flex-row gap-6">
            {/* Left Side: React Quill */}
            <div className="lg:w-2/3">
            <div className="mb-3" >
                <label
                  htmlFor="excerpt"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Excerpt
                </label>
                <Field
                  type="text"
                  id="excerpt"
                  name="excerpt"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name="excerpt"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <ReactQuill
                id="description"
                name="description"
                onChange={(value) => setFieldValue("description", value)}
                className="h-40 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Right Side: Other Inputs */}
            <div className="lg:w-1/3 space-y-4">
              <div>
                <label
                  htmlFor="class_id"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Class
                </label>
                <Field
                  as="select"
                  id="class_id"
                  name="class_id"
                  onChange={(e) => {
                    const selectedClassId = e.target.value;
                    const selectedClass = classes.find(
                      (clas) => clas.class_id === Number(selectedClassId)
                    );
                    setFieldValue("course_id", selectedClass?.course_id || "");
                    setFieldValue("class_id", selectedClassId);
                    setFieldValue(
                      "instructor_id",
                      selectedClass?.instructor_id || ""
                    );
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="" label="Select Class" />
                  {classes?.map((clas) => (
                    <option key={clas.class_id} value={clas.class_id}>
                      {clas.class_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="class_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="due_date"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Due Date
                </label>
                <Field
                  type="date"
                  id="due_date"
                  name="due_date"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name="due_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="max_score"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Max Score
                </label>
                <Field
                  type="number"
                  id="max_score"
                  name="max_score"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name="max_score"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading
                  ? "Submitting..."
                  : "Create Assignment"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AssignmentForm;
