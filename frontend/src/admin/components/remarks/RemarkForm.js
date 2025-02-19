import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "../../../redux/studentSlice";
import { createRemark, resetState } from "../../../redux/remarksSlice"; // Adjust the import path as necessary
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

// Validation schema
const validationSchema = Yup.object().shape({
  // student_id: Yup.string().required("Student ID is required"),
  remark: Yup.string().required("Remark is required"),
});

const RemarkForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { students } = useSelector((state) => state.students); // Adjust based on your state structure
  const { loading, message, error } = useSelector((state) => state.remarks); // Adjust based on your state structure

  useEffect(() => {
    dispatch(fetchStudents({ page: 1, limit: 10 })); // Fetch students on component mount
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  const handleStudentSelect = (student, setFieldValue) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.first_name} ${student.last_name}`); // Set the search bar to the selected student's name
    setFieldValue('student_id', student.student_id); // Set student_id in Formik's values
  };

  const filteredStudents = students?.filter(
    (student) =>
      student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-4">Add Remark</h1>
        <Formik
          initialValues={{
            student_id: "", // Initially empty
            remark: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            dispatch(createRemark(values)); // Dispatch remark creation
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4 text-sm">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700">
                    Search Student by Name
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="Enter student first name or last name"
                  />
                  {searchTerm && (
                    <ul className="bg-white border rounded-md mt-1 max-h-40 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <li
                            key={student.student_id}
                            onClick={() => handleStudentSelect(student, setFieldValue)}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                          >
                            {student.first_name} {student.last_name}
                          </li>
                        ))
                      ) : (
                        <li className="p-2 text-gray-500">No students found</li>
                      )}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700">Remark</label>
                  <Field
                    name="remark"
                    as="textarea"
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <ErrorMessage
                    name="remark"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className=" hidden grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                <div>
                  <label className="block text-gray-700">Selected Student ID</label>
                  <Field
                    name="student_id"
                    className="w-full p-2 border rounded-md text-sm"
                    readOnly
                  />
                  <ErrorMessage
                    name="student_id"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default RemarkForm;
