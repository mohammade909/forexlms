import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { FaBook, FaCalendarAlt, FaClock, FaUsers, FaLink } from "react-icons/fa";
import {
  fetchSubjects,
  deleteSubject,
  updateSubject,
  resetState,
} from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
import {
  fetchTeachers,
  fetchTeacherByUserId,
} from "../../../redux/teacherSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";
import {
  fetchSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../../redux/scheduleSlice";
import { BookOpenIcon, CalendarDaysIcon, CheckBadgeIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

const List = () => {
  const dispatch = useDispatch();

  // Redux state
  const { schedules, loading, error, message } = useSelector(
    (state) => state.schedules
  );
  const { classes } = useSelector((state) => state.classes);
  const { auth } = useSelector((state) => state.auth);
  const { sections } = useSelector((state) => state.sections);
  const { teachers, teacher } = useSelector((state) => state.teachers);
  const { subjects } = useSelector((state) => state.subjects);

  // Local state
  const [open, setOpen] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(() => {
    // Fetch subjects and classes
    dispatch(fetchSchedules());
    dispatch(getClasses());
    dispatch(fetchTeacherByUserId(auth.user_id));

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  const handleDelete = (id) => {
    setPeriodId(id);
    setOpen(true);
  };

  const handleEdit = (schedule) => {
    setScheduleToEdit(schedule);
    setEditModalOpen(true);
  };

  // Validation schema for the update form
  const validationSchema = Yup.object().shape({
    class_id: Yup.string().required("Class is required"),
    section_id: Yup.string().required("Section is required"),
    subject_id: Yup.string().required("Subject is required"),
    teacher_id: Yup.string().required("Teacher is required"),
    start_time: Yup.string().required("Start time is required"),
    end_time: Yup.string().required("End time is required"),
  });

  const handleClassChange = (classId, setFieldValue) => {
    setSelectedClassId(classId);
    setFieldValue("class_id", classId);
    setFieldValue("section_id", ""); // Reset section_id
    setFieldValue("subject_id", ""); // Reset subject_id
    dispatch(fetchSectionByClass(classId)); // Fetch sections based on selected class
  };

  // Handle section selection to fetch subjects
  const handleSectionChange = (sectionId, setFieldValue) => {
    setFieldValue("section_id", sectionId);
    setFieldValue("subject_id", ""); // Reset subject_id when section changes
    dispatch(
      fetchSubjects({ class_id: selectedClassId, section_id: sectionId })
    ); // Fetch subjects based on selected class and section
  };

  const lactures = schedules?.filter(
    (item) => item.teacher_id === teacher?.teacher_id
  )[0];


  return (
    <div className="overflow-x-auto">
      <SuccessModal
        open={openSuccess}
        setOpen={setOpenSuccess}
        message={message}
        reset={resetState}
      />
      <ErrorModal
        open={openError}
        setOpen={setOpenError}
        error={error}
        reset={resetState}
      />
      
      <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upcoming Lectures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lactures?.schedules.map((schedule) => (
          <div
            key={schedule.period_id}
            className="border border-gray-300 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="bg-gray-100 p-4">
              <h2 className="text-xl font-bold mb-1">{schedule.title}</h2>
              <p className="text-gray-700">{`${schedule.course}-${schedule?.class}`}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <FaCalendarAlt className="text-blue-500" />
                <span>{new Date(schedule.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <FaClock className="text-blue-500" />
                <span>
                  {schedule.start_time} - {schedule.end_time}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <FaUsers className="text-blue-500" />
                <span>{schedule.class}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaLink className="text-blue-500" />
                <a
                  href={schedule.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lecture Link
                </a>
              </div>
            </div>
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <button className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                <FaBook className="inline-block mr-2" />
                Enroll
              </button>
              {/* <span className="text-sm text-gray-600">ID: {schedule.period_id}</span> */}
            </div>
          </div>
        ))}
      </div>
    </div>

      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteSchedule}
        message="Are you sure you want to delete this Schedule?"
        id={periodId}
      />

      {editModalOpen && scheduleToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Sechdule</h2>
            <Formik
              initialValues={{
                period_name: "",
                class_id: "",
                section_id: "",
                subject_id: "",
                teacher_id: "",
                start_time: "",
                end_time: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                dispatch(updateSchedule(values)); // Dispatch createSchedule action
              }}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-8 text-xs">
                  <div className="bg-white p-6 rounded-lg space-y-4">
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
                              className="w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                              name="period_name"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">Class</label>
                            <Field
                              as="select"
                              name="class_id"
                              className="w-full p-2 border rounded-md"
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
                            <label className="block text-gray-700">
                              Section
                            </label>
                            <Field
                              as="select"
                              name="section_id"
                              onChange={(e) =>
                                handleSectionChange(
                                  e.target.value,
                                  setFieldValue
                                )
                              }
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="">Select Section</option>
                              {sections.map((section) => (
                                <option
                                  key={section.section_id}
                                  value={section.section_id}
                                >
                                  {section.section_name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="section_id"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">
                              Subject
                            </label>
                            <Field
                              as="select"
                              name="subject_id"
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="">Select Subject</option>
                              {subjects.map((subject) => (
                                <option
                                  key={subject.subject_id}
                                  value={subject.subject_id}
                                >
                                  {subject.subject_name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="subject_id"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">
                              Teacher
                            </label>
                            <Field
                              as="select"
                              name="teacher_id"
                              className="w-full p-2 border rounded-md"
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
                            <label className="block text-gray-700">
                              Start Time
                            </label>
                            <Field
                              name="start_time"
                              type="time"
                              className="w-full p-2 border rounded-md"
                            />
                            <ErrorMessage
                              name="start_time"
                              component="div"
                              className="text-red-600"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">
                              End Time
                            </label>
                            <Field
                              name="end_time"
                              type="time"
                              className="w-full p-2 border rounded-md"
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
                    <div className="flex gap-5">
                      <button
                        type="submit"
                        className="bg-green-500 w-full text-white px-4 py-2 rounded-md"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditModalOpen(false)}
                        className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
