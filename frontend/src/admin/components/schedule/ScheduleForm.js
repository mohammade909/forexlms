import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { createSchedule, resetState } from "../../../redux/scheduleSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchTeachers } from "../../../redux/teacherSlice";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";

const ScheduleForm = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");

  const { loading, error, message } = useSelector((state) => state.schedules);
  const { classes } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);

  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    period_name: Yup.string().required("Period name is required"),
    class_url: Yup.string()
      .url("Invalid URL format")
      .required("Class URL is required"),
    class_id: Yup.string().required("Class is required"),
    teacher_id: Yup.string().required("Teacher is required"),
    start_time: Yup.string().required("Start time is required"),
    end_time: Yup.string().required("End time is required"),
  });

  useEffect(() => {
    // Fetch classes, teachers, and subjects when the component mounts
    dispatch(getClasses());
    dispatch(fetchTeachers());

    // Show success or error modals based on message or error
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }

    // Reset state on component unmount
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, message, error]);

  // Handle class selection to fetch sections
  const handleClassChange = (classId, setFieldValue) => {
    console.log(typeof classId);
    
    setSelectedClassId(classId);
    setFieldValue("class_id", classId);
  
    // Find the selected class and set the course_id
    const selectedClass = classes.find((cls) => cls.class_id === Number(classId));
    
    
    if (selectedClass) {
      setFieldValue("course_id", selectedClass.course_id); // Assuming classes have a course_id field
    }
  };
  

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
          period_name: "",
          class_url: "",
          class_id: "",
          course_id: "",
          teacher_id: "",
          start_time: "",
          end_time: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {       
          dispatch(createSchedule(values)); // Dispatch createSchedule action
        }}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-8 text-xs">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-lg font-semibold">Schedule Details</h2>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <label className="block text-gray-700">
                        Name of Period
                      </label>
                      <Field
                        type="text"
                        name="period_name"
                        className="w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="period_name"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">URL</label>
                      <Field
                        type="url"
                        name="class_url"
                        className="w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="class_url"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Class</label>
                      <Field
                        as="select"
                        name="class_id"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          handleClassChange(e.target.value, setFieldValue)
                        }
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls.class_id} value={cls.class_id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="class_id"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Teacher</label>
                      <Field
                        as="select"
                        name="teacher_id"
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option
                            key={teacher.teacher_id}
                            value={teacher.teacher_id}
                          >
                            {teacher.first_name} {teacher.last_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="teacher_id"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Start Time</label>
                      <Field
                        name="start_time"
                        type="time"
                        className="w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="start_time"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">End Time</label>
                      <Field
                        name="end_time"
                        type="time"
                        className="w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="end_time"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="mt-10" />
              <div className="flex">
                <button
                  type="submit"
                  className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ScheduleForm;
