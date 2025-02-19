// store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import usersReducer from "./usersSlice";
import teachersReducer from "./teacherSlice";
import studentsReducer from "./studentSlice";
import classesReducer from "./classSlice";
import sectionsReducer from "./sectionSlice";
import subjectReducer from "./subjectSlice";
import attandanceReducer from "./attandanceSlice";
import examReducer from "./examSlice";
import fieldReducer from './markFieldSlice'
import schedulesReducer from "./scheduleSlice"
import eventReducer from "./eventSlice"
import notificationReducer from "./notificationSlice"
import remarksReducer from "./remarksSlice"
import marksReducer from "./marksSlice"
import coureseReducer  from './courseSlice'
import enrollmentsReducer from './enrollmentSlice'
import feeReducer from './feeSlice'
import certificateReducer from './certificateSlice'
import reviewReducer from './reviewSlice'
import inquiryReducer from './inquirySlice'
import blogReducer from './blogSlice'
import assignmentReducer from './assignmentSlice'
import ticketsReducer from "./ticketSlice";
import offersReducer from "./offersSlice";
import homeworkReducer from "./homeworkSlice";
import announcementReducer from "./announcementSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  teachers:teachersReducer,
  students:studentsReducer,
  classes:classesReducer,
  sections:sectionsReducer,
  subjects: subjectReducer,  // Add any other reducers here.
  attendances: attandanceReducer,  // Add any other reducers here.
  exams: examReducer, 
  fields:fieldReducer,
  schedules:schedulesReducer,
  events:eventReducer,
  notifications:notificationReducer,
  remarks:remarksReducer, // Add any other reducers here.
  marks:marksReducer,
  courses:coureseReducer,
  enrollments:enrollmentsReducer,
  fees:feeReducer, // Add any other reducers here.
  certificates:certificateReducer, // Add any other reducers here.
  reviews:reviewReducer, // Add any other reducers here.
  inquiries:inquiryReducer,
  blogs:blogReducer,
  assignments:assignmentReducer,
  tickets: ticketsReducer, // Add any other reducers here.
  offers: offersReducer,
  homeworks:homeworkReducer,
  announcements:announcementReducer // Add any other reducers here.
// Add any other reducers here.
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: [],
  debug: true,
  timeout: 0,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
