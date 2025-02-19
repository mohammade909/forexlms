// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ConfirmPopup from "../../../components/ConfirmPopup";
// import { FiEdit, FiTrash, FiCopy } from "react-icons/fi";
// import {
//   fetchSubjects,
//   deleteSubject,
//   updateSubject,
//   resetState,
// } from "../../../redux/subjectSlice";
// import { getClasses } from "../../../redux/classSlice";
// import { fetchSectionByClass } from "../../../redux/sectionSlice"; // New action for fetching sections
// import {
//   fetchTeachers,
//   fetchTeacherByUserId,
// } from "../../../redux/teacherSlice";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import SuccessModal from "../SuccessModal";
// import ErrorModal from "../ErrorModal";
// import * as Yup from "yup";
// import {
//   fetchSchedules,
//   updateSchedule,
//   deleteSchedule,
// } from "../../../redux/scheduleSlice";

// const LactureList = () => {
//   const dispatch = useDispatch();

//   // Redux state
//   const { schedules, loading, error, message } = useSelector(
//     (state) => state.schedules
//   );
//   const { classes } = useSelector((state) => state.classes);
//   const { auth } = useSelector((state) => state.auth);
//   const { sections } = useSelector((state) => state.sections);
//   const { teachers, teacher } = useSelector((state) => state.teachers);
//   const { subjects } = useSelector((state) => state.subjects);

//   // Local state
//   const [open, setOpen] = useState(false);
//   const [periodId, setPeriodId] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [scheduleToEdit, setScheduleToEdit] = useState(null);
//   const [openSuccess, setOpenSuccess] = useState(false);
//   const [openError, setOpenError] = useState(false);
//   const [selectedClassId, setSelectedClassId] = useState(null);

//   useEffect(() => {
//     // Fetch subjects and classes
//     dispatch(fetchSchedules());
//     dispatch(getClasses());
//     dispatch(fetchTeacherByUserId(auth.user_id));

//     if (message) {
//       setOpenSuccess(true);
//     }
//     if (error) {
//       setOpenError(true);
//     }
//   }, [dispatch, message, error]);

//   const handleDelete = (id) => {
//     setPeriodId(id);
//     setOpen(true);
//   };

//   const handleEdit = (schedule) => {
//     setScheduleToEdit(schedule);
//     setEditModalOpen(true);
//   };

//   // Validation schema for the update form
//   const validationSchema = Yup.object().shape({
//     class_id: Yup.string().required("Class is required"),
//     section_id: Yup.string().required("Section is required"),
//     subject_id: Yup.string().required("Subject is required"),
//     teacher_id: Yup.string().required("Teacher is required"),
//     start_time: Yup.string().required("Start time is required"),
//     end_time: Yup.string().required("End time is required"),
//   });

//   const handleClassChange = (classId, setFieldValue) => {
//     setSelectedClassId(classId);
//     setFieldValue("class_id", classId);
//     setFieldValue("section_id", ""); // Reset section_id
//     setFieldValue("subject_id", ""); // Reset subject_id
//     dispatch(fetchSectionByClass(classId)); // Fetch sections based on selected class
//   };

//   // Handle section selection to fetch subjects
//   const handleSectionChange = (sectionId, setFieldValue) => {
//     setFieldValue("section_id", sectionId);
//     setFieldValue("subject_id", ""); // Reset subject_id when section changes
//     dispatch(
//       fetchSubjects({ class_id: selectedClassId, section_id: sectionId })
//     ); // Fetch subjects based on selected class and section
//   };

//   console.log(schedules);
  
//   return (
//     <div className="overflow-x-auto">
    
//       <SuccessModal
//         open={openSuccess}
//         setOpen={setOpenSuccess}
//         message={message}
//         reset={resetState}
//       />
//       <ErrorModal
//         open={openError}
//         setOpen={setOpenError}
//         error={error}
//         reset={resetState}
//       />
//       <div className="">
//         {schedules
//           ?.filter((item) => item.teacher_id === teacher?.teacher_id)
//           .map((teacher) => (
//             <div
//               key={teacher.teacher_id}
//               className="bg-white rounded-lg shadow-md p-4 mb-6"
//             >
//               <div className="mb-4">
//                 <h2 className="text-lg font-semibold">
//                   {teacher.teacher_first_name} {teacher.teacher_last_name}
//                 </h2>
//                 <p className="text-sm text-gray-600">
//                   Teacher ID: {teacher.teacher_id}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {teacher.schedules.map((schedule) => (
//                   <div
//                     key={schedule.period_id}
//                     className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-sm flex flex-col justify-between"
//                   >
//                     <h3 className="font-medium mb-1">{schedule.course}</h3>
//                     <p>Class: {schedule.class}</p>

//                     <p>
//                       Time: {schedule.start_time} - {schedule.end_time} -{" "}
//                       {schedule.date}
//                     </p>
//                     <p className="truncate">
//                       URL:{" "}
//                       <a
//                         href={schedule.URL}
//                         className="text-blue-500"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {schedule.URL}
//                       </a>
//                     </p>

//                     <div className="flex justify-between items-center mt-2">
//                       <button
//                         onClick={() => handleEdit(schedule)}
//                         className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
//                         title="Edit"
//                       >
//                         <FiEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(schedule.period_id)}
//                         className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
//                         title="Delete"
//                       >
//                         <FiTrash />
//                       </button>
//                       <button
//                         onClick={() =>
//                           navigator.clipboard.writeText(schedule.URL)
//                         }
//                         className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
//                         title="Copy Link"
//                       >
//                         <FiCopy />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//       </div>

//       <ConfirmPopup
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         actionFunction={deleteSchedule}
//         message="Are you sure you want to delete this Schedule?"
//         id={periodId}
//       />

     
//       {editModalOpen && scheduleToEdit && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
//             <h2 className="text-lg font-semibold mb-4">Edit Sechdule</h2>
//             <Formik
//               initialValues={{
//                 period_name: "",
//                 class_id: "",
//                 section_id: "",
//                 subject_id: "",
//                 teacher_id: "",
//                 start_time: "",
//                 end_time: "",
//               }}
//               validationSchema={validationSchema}
//               onSubmit={(values) => {
//                 dispatch(updateSchedule(values)); // Dispatch createSchedule action
//               }}
//             >
//               {({ setFieldValue }) => (
//                 <Form className="space-y-8 text-xs">
//                   <div className="bg-white p-6 rounded-lg space-y-4">
//                     <h2 className="text-lg font-semibold">Schedule Details</h2>
//                     <div className="flex items-center">
//                       <div className="w-full">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//                           <div>
//                             <label className="block text-gray-700">
//                               Name of Period
//                             </label>
//                             <Field
//                               type="text"
//                               name="period_name"
//                               className="w-full p-2 border rounded-md"
//                             />
//                             <ErrorMessage
//                               name="period_name"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">Class</label>
//                             <Field
//                               as="select"
//                               name="class_id"
//                               className="w-full p-2 border rounded-md"
//                               onChange={(e) =>
//                                 handleClassChange(e.target.value, setFieldValue)
//                               }
//                             >
//                               <option value="">Select Class</option>
//                               {classes.map((cls) => (
//                                 <option key={cls.class_id} value={cls.class_id}>
//                                   {cls.class_name}
//                                 </option>
//                               ))}
//                             </Field>
//                             <ErrorMessage
//                               name="class_id"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">
//                               Section
//                             </label>
//                             <Field
//                               as="select"
//                               name="section_id"
//                               onChange={(e) =>
//                                 handleSectionChange(
//                                   e.target.value,
//                                   setFieldValue
//                                 )
//                               }
//                               className="w-full p-2 border rounded-md"
//                             >
//                               <option value="">Select Section</option>
//                               {sections.map((section) => (
//                                 <option
//                                   key={section.section_id}
//                                   value={section.section_id}
//                                 >
//                                   {section.section_name}
//                                 </option>
//                               ))}
//                             </Field>
//                             <ErrorMessage
//                               name="section_id"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">
//                               Subject
//                             </label>
//                             <Field
//                               as="select"
//                               name="subject_id"
//                               className="w-full p-2 border rounded-md"
//                             >
//                               <option value="">Select Subject</option>
//                               {subjects.map((subject) => (
//                                 <option
//                                   key={subject.subject_id}
//                                   value={subject.subject_id}
//                                 >
//                                   {subject.subject_name}
//                                 </option>
//                               ))}
//                             </Field>
//                             <ErrorMessage
//                               name="subject_id"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">
//                               Teacher
//                             </label>
//                             <Field
//                               as="select"
//                               name="teacher_id"
//                               className="w-full p-2 border rounded-md"
//                             >
//                               <option value="">Select Teacher</option>
//                               {teachers.map((teacher) => (
//                                 <option
//                                   key={teacher.teacher_id}
//                                   value={teacher.teacher_id}
//                                 >
//                                   {teacher.first_name} {teacher.last_name}
//                                 </option>
//                               ))}
//                             </Field>
//                             <ErrorMessage
//                               name="teacher_id"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">
//                               Start Time
//                             </label>
//                             <Field
//                               name="start_time"
//                               type="time"
//                               className="w-full p-2 border rounded-md"
//                             />
//                             <ErrorMessage
//                               name="start_time"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-gray-700">
//                               End Time
//                             </label>
//                             <Field
//                               name="end_time"
//                               type="time"
//                               className="w-full p-2 border rounded-md"
//                             />
//                             <ErrorMessage
//                               name="end_time"
//                               component="div"
//                               className="text-red-600"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <hr className="mt-10" />
//                     <div className="flex gap-5">
//                       <button
//                         type="submit"
//                         className="bg-green-500 w-full text-white px-4 py-2 rounded-md"
//                       >
//                         Save Changes
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setEditModalOpen(false)}
//                         className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LactureList;


