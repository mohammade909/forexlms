import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPopup from "../../../components/ConfirmPopup";
import { fetchSubjects } from "../../../redux/subjectSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice";
import {
  fetchTeachers,
  fetchTeacherByUserId,
} from "../../../redux/teacherSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SuccessModal from "../SuccessModal";
import ErrorModal from "../ErrorModal";
import * as Yup from "yup";
import {
  fetchSchedulesByTeacher,
  updateSchedule,
  deleteSchedule,
  resetState,
} from "../../../redux/scheduleSlice";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const TeacherSchedules = () => {
  const dispatch = useDispatch();

  // Redux state
  const { schedule, loading, error, message } = useSelector(
    (state) => state.schedules
  );
  const { auth } = useSelector((state) => state.auth);
  const { classes } = useSelector((state) => state.classes);
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
    if (auth) {
      dispatch(fetchTeacherByUserId(auth.user_id));
    }

    dispatch(getClasses());
    dispatch(fetchTeachers());

    if (message) {
      setOpenSuccess(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [dispatch, message, error]);

  useEffect(() => {
    if (teacher) {
      dispatch(fetchSchedulesByTeacher(teacher.teacher_id));
    }
  }, [teacher]);

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

  const handleSectionChange = (sectionId, setFieldValue) => {
    setFieldValue("section_id", sectionId);
    setFieldValue("subject_id", ""); // Reset subject_id when section changes
    dispatch(
      fetchSubjects({ class_id: selectedClassId, section_id: sectionId })
    ); // Fetch subjects based on selected class and section
  };

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
      <div className="border my-10">
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">
            {schedule?.teacher_first_name} {schedule?.teacher_last_name}
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
            {schedule?.schedules.map((schedule) => (
              <div
                key={schedule.period_id}
                className="border border-gray-200 rounded-lg px-3  bg-gray-50"
              >
                <h3 className="text-lg font-semibold">{schedule.subject}</h3>
                <p className="text-sm text-gray-600">Class: {schedule.class}</p>
                <p className="text-sm text-gray-600">
                  Section: {schedule.section}
                </p>
                <p className="text-sm text-gray-600">
                  Time: {schedule.start_time} - {schedule.end_time}
                </p>
                <div className="flex justify-between mt-4">
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteSchedule}
        message="Are you sure you want to delete this Schedule?"
        id={periodId}
      />

      {/* Edit Modal */}
      {editModalOpen && scheduleToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Schedule</h2>
            <Formik
              initialValues={{
                period_name: scheduleToEdit.period_name || "", // Prepopulate existing values
                class_id: scheduleToEdit.class_id || "",
                section_id: scheduleToEdit.section_id || "",
                subject_id: scheduleToEdit.subject_id || "",
                teacher_id: scheduleToEdit.teacher_id || "",
                start_time: scheduleToEdit.start_time || "",
                end_time: scheduleToEdit.end_time || "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                // Ensure to pass the period_id to update the correct schedule
                dispatch(
                  updateSchedule({
                    ...values,
                    period_id: scheduleToEdit.period_id,
                  })
                );
                setEditModalOpen(false); // Close modal after submission
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
                              className="w-full p-2 border rounded-md"
                              onChange={(e) =>
                                handleSectionChange(
                                  e.target.value,
                                  setFieldValue
                                )
                              }
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
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block text-gray-700">
                          Start Time
                        </label>
                        <Field
                          type="time"
                          name="start_time"
                          className="w-full p-2 border rounded-md"
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
                          type="time"
                          name="end_time"
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

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)} // Close modal on cancel
                      className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Update
                    </button>
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

export default TeacherSchedules;
