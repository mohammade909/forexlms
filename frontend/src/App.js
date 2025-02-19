import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPrivateRoute from "./utils/AdminPrivateRoutes";
import PrivateRoute from "./utils/PrivateRoutes";
import ScrollToTop from "./components/ScollToTop";
import DashboardLayout from "./admin/layout/DashboardLayout";
import Login from "./pages/Login";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./teacher/pages/Dashboard";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Teachers from "./admin/pages/Teachers";
import TeacherForm from "./admin/components/TeacherForm";
import Students from "./admin/pages/Students";
import Classes from "./admin/pages/Classes";
import StudentForm from "./admin/components/student/StudentForm";
import ClassForm from "./admin/components/classs/ClassForm";
import Sections from "./admin/pages/Sections";
import Subjects from "./admin/pages/Subjects";
import SectionForm from "./admin/components/sections/SectionForm";
import SubjectForm from "./admin/components/subjects/SubjectForm";
import Attendance from "./admin/pages/Attendance";
import AttendanceTeachers from "./admin/pages/AttendanceTeachers";
import Exams from "./admin/pages/Exams";
import ExamForm from "./admin/components/exams/ExamForm";
import Fields from "./admin/pages/Fields";
import FieldsForm from "./admin/components/subjectFields/FieldsForm";
import MarksForm from "./admin/components/marks/MarksForm";
import TeacherLayout from "./teacher/layout/TecaherLayout";

import TeacherStudents from "./teacher/pages/TeacherStudents";
import AddMarksForm from "./teacher/components/marks/AddMarksForm";
import TeacherSubjects from "./teacher/pages/TeacherSubjects";
import Schedules from "./admin/pages/Schedules";
import ScheduleForm from "./admin/components/schedule/ScheduleForm";
import EventForm from "./admin/components/events/EventForm";
import Events from "./admin/pages/Events";
import Notifications from "./admin/pages/Notifications";
import NotificationForm from "./admin/components/notifications/NotificationForm";
import RemarkForm from "./admin/components/remarks/RemarkForm";
import SectionAttendance from "./teacher/pages/SectionAttendance";
import Marks from "./admin/pages/Marks";
import StudentDashboard from "./student/pages/StudentDashboard";
import Layout from "./student/layout/Layout";
import SectionDetails from "./student/components/sections/SectionDetails";
import Courses from "./admin/pages/Courses";
import CourseForm from "./admin/components/courses/CourseForm";
import StudentInfo from "./admin/components/student/StudentInfo";
import EnrollmentList from "./student/pages/Enrolled";
import Reports from "./student/pages/AttendanceReport";
import Certificate from "./student/components/Certificate";
import FeesReport from "./student/components/FeesReport";
import EventsList from "./student/components/events/EventsList";
import NotificationList from "./student/components/NotificationList";
import ClassAndCourse from "./teacher/components/course/ClassAndCourse";
import FeesTable from "./admin/components/fees/FeesTable";
import Enrollments from "./admin/components/enrollments/Enrollments";
import Certificates from "./admin/components/certificates/Certificates";
import CoursePreview from "./admin/components/courses/CourseOverview";
import Inquiries from "./admin/components/inquiries/Inquiries";
import About from "./website/About";
import Aboutus from "./website/Aboutus";
import WebDesgin from "./website/WebDesgin";
import Service from "./website/Service";
import Faq from "./website/Faq";
import Contact from "./website/Contact";
import ItCourse from "./website/ItCourse";
import PrivacyPolicy from "./website/PrivacyAndPolicy";
import TermsAndConditions from "./website/TearmsAndConditions";
import Home from "./website/Home";
import WebLayout from "./website/WebLayout";
import BlogList from "./admin/components/blogs/Blogs";
import BlogForm from "./admin/components/blogs/BlogForm";
import BlogDetails from "./website/BlogDetails";
import Assignments from "./admin/components/assignments/Assignments";
import AssignmentDetails from "./admin/components/assignments/AssignmentDetails";
import AssignmentForm from "./admin/components/assignments/AssignmentForm";
import TeacherProfile from "./teacher/pages/TeacherProfile";
import AssignmentList from "./student/components/assignments/AssignmentList";
import AssignmentOverview from "./student/components/assignments/AssignmentOverview";
import AssignmentPage from "./teacher/components/assignments/AssignmentPage";
import List from "./teacher/components/assignments/List";
import Overview from "./teacher/components/assignments/Overview";
import AssignmentCreate from "./teacher/components/assignments/AssignmentCreate";
import Lactures from "./teacher/pages/Lactures";
import LactureForm from "./teacher/components/schedule/LactureForm";
import AdminProfile from "./admin/pages/AdminProfile";
import TicketsTable from "./admin/components/tickets/TicketsTable";
import TicketChat from "./admin/components/tickets/TicketChat";
import QueryList from "./student/components/query/QueryList";
import QueryChat from "./student/components/query/QueryChat";
import AddQuery from "./student/components/query/AddQuery";
import SubmitHomeworkForm from "./student/components/homework/WorkForm";
import BlogOverview from "./admin/components/blogs/BlogOverview";
import Offers from "./admin/components/offers/Offers";
import CourseOverview from "./admin/components/courses/CourseOverview";
import OfferForm from "./admin/components/offers/OfferForm";
import AnnouncementList from "./admin/components/announcements/Announcemnets";

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Routes>
          <Route element={<AdminPrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/teachers" element={<Teachers />} />
              <Route path="/dashboard/students" element={<Students />} />
              <Route path="/dashboard/classes" element={<Classes />} />
              <Route path="/dashboard/assignments" element={<Assignments />} />
              <Route
                path="/dashboard/assignments/:id"
                element={<AssignmentDetails />}
              />
              <Route
                path="/dashboard/assignments/create"
                element={<AssignmentForm />}
              />
              <Route path="/dashboard/tickets" element={<TicketsTable />} />
              <Route
                path="/dashboard/ticket/:ticketId"
                element={<TicketChat />}
              />

              <Route path="/dashboard/announcements" element={<AnnouncementList />} />
              <Route path="/dashboard/blogs" element={<BlogList />} />
              <Route path="/dashboard/blogs/view/:id" element={<BlogOverview />} />
              <Route path="/dashboard/courses" element={<Courses />} />
              <Route path="/dashboard/inquiries" element={<Inquiries />} />
              <Route path="/dashboard/course/:id" element={<CourseOverview />} />
              <Route path="/dashboard/sections" element={<Sections />} />
              <Route path="/dashboard/subjects" element={<Subjects />} />
              <Route path="/dashboard/offers" element={< Offers/>} />
              <Route path="/dashboard/offers/create" element={< OfferForm/>} />
              <Route path="/dashboard/subjects" element={<Subjects />} />
              <Route
                path="/dashboard/certificates"
                element={<Certificates />}
              />
              <Route path="/dashboard/fields" element={<Fields />} />
              <Route path="/dashboard/exams" element={<Exams />} />
              <Route path="/dashboard/events" element={<Events />} />
              <Route path="/dashboard/fees" element={<FeesTable />} />
              <Route path="/dashboard/marks" element={<Marks />} />
              <Route
                path="/dashboard/notifications"
                element={<Notifications />}
              />
              <Route path="/dashboard/enrollments" element={<Enrollments />} />
              <Route path="/dashboard/schedules" element={<Schedules />} />
              <Route path="/dashboard/teacher/add" element={<TeacherForm />} />
              <Route path="/dashboard/student/add" element={<StudentForm />} />
              <Route
                path="/dashboard/student/:studentId"
                element={<StudentInfo />}
              />

              <Route path="/dashboard/class/add" element={<ClassForm />} />
              <Route path="/dashboard/section/add" element={<SectionForm />} />
              <Route path="/dashboard/subject/add" element={<SubjectForm />} />
              <Route path="/dashboard/exam/add" element={<ExamForm />} />
              <Route path="/dashboard/field/add" element={<FieldsForm />} />
              <Route path="/dashboard/marks/add" element={<MarksForm />} />
              <Route
                path="/dashboard/schedule/add"
                element={<ScheduleForm />}
              />
              <Route path="/dashboard/event/add" element={<EventForm />} />
              <Route
                path="/dashboard/notification/add"
                element={<NotificationForm />}
              />
              <Route path="/dashboard/remark/add" element={<RemarkForm />} />
              <Route path="/dashboard/course/add" element={<CourseForm />} />
              <Route path="/dashboard/blog/add" element={<BlogForm />} />

              <Route
                path="/dashboard/attandance/students"
                element={<Attendance />}
              />
              <Route
                path="/dashboard/attandance/teachers"
                element={<AttendanceTeachers />}
              />
              <Route path="/dashboard/profile" element={<AdminProfile />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute role={"teacher"} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/dashboard/teacher" element={<Dashboard />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/course" element={<ClassAndCourse />} />
              <Route path="/teacher/assignments" element={<AssignmentPage />} />
              <Route path="/teacher/class/:id" element={<List />} />
              <Route path="/teacher/subjects" element={<TeacherSubjects />} />
              <Route
                path="/teacher/attendance"
                element={<SectionAttendance />}
              />
              <Route
                path="/teacher/notifications"
                element={<NotificationList />}
              />
              <Route path="/teacher/lactures" element={<Lactures />} />
              <Route path="/teacher/lacture/create" element={<LactureForm />} />
              <Route path="/teacher/events" element={<EventsList />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
              <Route path="/teacher/assignments/:id" element={<Overview />} />
              <Route
                path="/teacher/assignments/create"
                element={<AssignmentCreate />}
              />
            </Route>
          </Route>
          <Route element={<PrivateRoute role={"student"} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/section-info" element={<SectionDetails />} />
              <Route path="/course" element={<EnrollmentList />} />
              <Route path="/homework" element={<SubmitHomeworkForm />} />
              
              <Route path="/attendance" element={<Reports />} />
              <Route path="/fees" element={<FeesReport />} />
              <Route
                path="/assignments/:courseId"
                element={<AssignmentList />}
              />
              <Route
                path="/assignments/overview/:id"
                element={<AssignmentOverview />}
              />
              <Route path="/queries" element={<QueryList />} />
              <Route path="/queries/:ticketId" element={<QueryChat />} />
              <Route path="/query/create" element={<AddQuery />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/certificate" element={<Certificate />} />
              {/* <Route path="/profile" element={<UserProfile/>}/> */}
              <Route path="/notification-list" element={<NotificationList />} />
            </Route>
          </Route>

          <Route path="/" element={<WebLayout />}>
            <Route path="/courses/view/:id" element={<CoursePreview />} />
            {/* <Route path="/blogs/view/:id" element={<BlogOverview />} /> */}
            {/* <Route path="/blogs/list" element={<BlogList/>} /> */}
            <Route index element={<Home />} />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/WebDesgin" element={<WebDesgin />} />
            <Route path="/Service" element={<Service />} />
            <Route path="/Faq" element={<Faq />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/ItCourse/:name" element={<ItCourse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blogs/view/:id" element={<BlogDetails />} />
            <Route path="/tearms-conditions" element={<TermsAndConditions />} />
            {/* <Route path="*" element={<NotFoun/>} /> */}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
