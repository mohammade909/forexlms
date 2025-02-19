const experss = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Routes starts here
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const attandanceRoutes = require("./routes/attandanceRoutes");
const examRoutes = require("./routes/examRoutes");
const marksRoutes = require("./routes/marksRoutes");
const subjectMarksFieldRoutes = require("./routes/subjectsMarksFieldRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const notificationsRoutes = require('./routes/notificationRoutes')
const eventRoutes = require('./routes/eventRoutes')
const remarksRoutes = require('./routes/remarksRoutes')
const coursesRoutes = require('./routes/courseRoutes')
const enrollmentRoutes = require('./routes/enrollmentRoutes')
const feeRoutes = require('./routes/feeRoutes')
const certificateRoutes = require('./routes/certificateRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const inquiryRoutes = require('./routes/inquiryRoutes')
const blogRoutes = require('./routes/blogRoutes')

const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const offerRoutes = require("./routes/offerRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

// Middleware starts here
dotenv.config();
const app = experss();
app.use(experss.json());
app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

// API Endpoints starts at http://localhost:8000

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/attendance", attandanceRoutes);
app.use("/api/v1/exam", examRoutes);
app.use("/api/v1/marks", marksRoutes);
app.use("/api/v1/field", subjectMarksFieldRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/remarks", remarksRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/inquiries", inquiryRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/assignments", assignmentRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/courses", coursesRoutes);
app.use("/api/v1/homework", homeworkRoutes);
app.use("/api/v1/offers", offerRoutes );
app.use("/api/v1/announcements", announcementRoutes );
// app.use("/api/v1/permissions", accessRoutes);
// app.use("/api/v1/enrollments", enrollmentsRoutes);
// app.use("/api/v1/fee", feeRoutes);

// Middle wares
app.use(errorMiddleware);

module.exports = app;
