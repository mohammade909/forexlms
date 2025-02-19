import React, { useState } from 'react';
import { useFormik } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useDispatch } from 'react-redux'; // If using Redux for state management

const SubmitHomeworkForm = () => {
  // Local state for the React Quill value
  const [description, setDescription] = useState('');

  // Formik setup
  const formik = useFormik({
    initialValues: {
      student_id: '',
      teacher_id: '',
      class_id: '',
      title: '',
      due_date: '',
      file_url: '',
    },
    onSubmit: (values) => {
      // Handle form submission
      // Include description from React Quill in the submission
      const formData = { ...values, description };

      // Make your API call here to submit the homework
      console.log('Form submitted', formData);
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Submit Homework</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Student ID */}
        <div className="mb-4">
          <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student ID</label>
          <input
            id="student_id"
            name="student_id"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.student_id}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Teacher ID */}
        <div className="mb-4">
          <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">Teacher ID</label>
          <input
            id="teacher_id"
            name="teacher_id"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.teacher_id}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Class ID */}
        <div className="mb-4">
          <label htmlFor="class_id" className="block text-sm font-medium text-gray-700">Class ID</label>
          <input
            id="class_id"
            name="class_id"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.class_id}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Homework Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Homework Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            id="due_date"
            name="due_date"
            type="datetime-local"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.due_date}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Homework File URL */}
        <div className="mb-4">
          <label htmlFor="file_url" className="block text-sm font-medium text-gray-700">Homework File URL</label>
          <input
            id="file_url"
            name="file_url"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.file_url}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Homework Description (React Quill) */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Homework Description</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="mt-2 border border-gray-300 rounded-md"
            theme="snow"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Submit Homework
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitHomeworkForm;
