const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

const moment = require("moment"); // Ensure moment.js is installed for date handling

exports.getClassSchedules = catchAsyncErrors(async (req, res, next) => {
  const { class_id } = req.params; // Assume `class_id` is passed as a URL parameter

  if (!class_id) {
    return next(new ErrorHandler("Class ID is required", 400));
  }

  const query = `
    SELECT 
      t.teacher_id, 
      t.first_name AS teacher_first_name, 
      t.last_name AS teacher_last_name,
      c.class_id, 
      c.class_name, 
      cr.course_name,  
      p.period_id, 
      p.class_url, 
      p.period_name, 
      p.start_time, 
      p.date,
      p.end_time,
      p.created_at
    FROM 
      periods p
    LEFT JOIN 
      teachers t ON p.teacher_id = t.teacher_id
    LEFT JOIN 
      classes c ON p.class_id = c.class_id
    LEFT JOIN 
      courses cr ON p.course_id = cr.course_id
    WHERE 
      p.class_id = ?
  `;

  db.query(query, [class_id], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching schedules", 500));
    } else if (results.length === 0) {
      return res.status(200).json({
        success: true,
        schedules: {
          todaysLectures:[],
          pastLectures:[],
        },
      });
    } else {
      const todayDate = moment().format("YYYY-MM-DD");

      // Separate schedules into today's and past lectures
      const schedules = results.map((schedule) => ({
        period_id: schedule.period_id,
        class_id: schedule.class_id,
        class_name: schedule.class_name,
        course_name: schedule.course_name,
        period_name: schedule.period_name,
        class_url: schedule.class_url,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        created_at: schedule.created_at,
        teacher: {
          teacher_id: schedule.teacher_id,
          first_name: schedule.teacher_first_name,
          last_name: schedule.teacher_last_name,
        },
      }));

      const todaysLectures = schedules.filter((schedule) =>
        moment(schedule.date).isSame(todayDate, "day")
      );

      const pastLectures = schedules.filter((schedule) =>
        moment(schedule.date).isBefore(todayDate, "day")
      );

      return res.status(200).json({
        success: true,
        schedules: {
          todaysLectures,
          pastLectures,
        },
      });
    }
  });
});

// CREATE a schedule
exports.createSchedule = catchAsyncErrors(async (req, res, next) => {
  const scheduleFields = req.body; // Expecting schedule details in req.body
  console.log(req.body);

  const query = `
    INSERT INTO periods (period_name, teacher_id, class_id, course_id, class_url, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const {
    period_name,
    teacher_id,
    class_id,
    course_id,
    class_url,
    start_time,
    end_time,
  } = scheduleFields;

  db.query(
    query,
    [
      period_name,
      teacher_id,
      class_id,
      course_id,
      class_url,
      start_time,
      end_time,
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        return next(new ErrorHandler("Error creating schedule", 500));
      } else {
        return res.status(201).json({
          success: true,
          message: "Schedule created successfully",
        });
      }
    }
  );
});

// GET all schedules with teacher, class, section, and subject details
exports.getAllSchedules = catchAsyncErrors(async (req, res, next) => {
  const query = `
    SELECT 
      t.teacher_id, 
      t.first_name AS teacher_first_name, 
      t.last_name AS teacher_last_name,
      c.class_name, 
      cr.course_name,  
      p.period_id, 
      p.class_url, 
      p.period_name, 
      p.start_time, 
      p.date,
      p.end_time,
      p.created_at
    FROM 
      periods p
    LEFT JOIN 
      teachers t ON p.teacher_id = t.teacher_id
    LEFT JOIN 
      classes c ON p.class_id = c.class_id
    LEFT JOIN 
      courses cr ON p.course_id = cr.course_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching schedules", 500));
    } else {
      // Format the results to group by teacher
      const schedulesByTeacher = results.reduce((acc, curr) => {
        const teacherId = curr.teacher_id;

        // If the teacher doesn't exist in the accumulator, add them
        if (!acc[teacherId]) {
          acc[teacherId] = {
            teacher_id: teacherId,
            teacher_first_name: curr.teacher_first_name,
            teacher_last_name: curr.teacher_last_name,
            schedules: [],
          };
        }

        // Add the schedule information for the teacher
        acc[teacherId].schedules.push({
          period_id: curr.period_id,
          class: curr.class_name,
          title: curr.period_name,
          date: curr.date,
          course: curr.course_name,
          URL: curr.class_url,
          start_time: curr.start_time,
          date: curr.created_at,
          end_time: curr.end_time,
        });

        return acc;
      }, {});

      // Convert the object to an array
      const schedulesArray = Object.values(schedulesByTeacher);

      return res.status(200).json({
        success: true,
        schedules: schedulesArray,
      });
    }
  });
});

// GET schedule by ID
exports.getScheduleById = catchAsyncErrors(async (req, res, next) => {
  const scheduleId = req.params.id;

  const query = `
    SELECT p.period_id, p.period_name, p.start_time, p.end_time, 
           t.first_name AS teacher_first_name, t.last_name AS teacher_last_name,
           c.class_name, s.section_name, sub.subject_name
    FROM periods p
    LEFT JOIN teachers t ON p.teacher_id = t.teacher_id
    LEFT JOIN classes c ON p.class_id = c.class_id
    LEFT JOIN sections s ON p.section_id = s.section_id
    LEFT JOIN subjects sub ON p.subject_id = sub.subject_id
    WHERE p.period_id = ?
  `;

  db.query(query, [scheduleId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching schedule", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("Schedule not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        data: results,
      });
    }
  });
});

// UPDATE a schedule
exports.updateSchedule = catchAsyncErrors(async (req, res, next) => {
  const scheduleId = req.params.id;
  const scheduleFields = req.body;

  const query = `
    UPDATE periods SET ? WHERE period_id = ?
  `;

  db.query(query, [scheduleFields, scheduleId], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error updating schedule", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Schedule not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
      });
    }
  });
});

// DELETE a schedule
exports.deleteSchedule = catchAsyncErrors(async (req, res, next) => {
  const scheduleId = req.params.id;

  const query = `
    DELETE FROM periods WHERE period_id = ?
  `;

  db.query(query, [scheduleId], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error deleting schedule", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Schedule not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Schedule deleted successfully",
        schedule_id: scheduleId,
      });
    }
  });
});

exports.getSchedulesByTeacher = catchAsyncErrors(async (req, res, next) => {
  const teacherId = req.params.teacherId; // Extract the teacher ID from the request parameters

  const query = `
    SELECT 
      t.teacher_id, 
      t.first_name AS teacher_first_name, 
      t.last_name AS teacher_last_name,
      c.class_name, 
      s.section_name, 
      sub.subject_name, 
      p.period_id, 
      p.start_time, 
      p.end_time
    FROM 
      periods p
    LEFT JOIN 
      teachers t ON p.teacher_id = t.teacher_id
    LEFT JOIN 
      classes c ON p.class_id = c.class_id
    LEFT JOIN 
      sections s ON p.section_id = s.section_id
    LEFT JOIN 
      subjects sub ON p.subject_id = sub.subject_id
    WHERE 
      t.teacher_id = ?  -- Filter by teacher ID
  `;

  db.query(query, [teacherId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching schedules", 500));
    } else {
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No schedules found for this teacher",
        });
      }

      // Format the results
      const schedules = results.map((curr) => ({
        period_id: curr.period_id,
        subject: curr.subject_name,
        class: curr.class_name,
        section: curr.section_name,
        start_time: curr.start_time,
        end_time: curr.end_time,
      }));

      return res.status(200).json({
        success: true,
        teacher: {
          teacher_id: results[0].teacher_id,
          teacher_first_name: results[0].teacher_first_name,
          teacher_last_name: results[0].teacher_last_name,
          schedules: schedules,
        },
      });
    }
  });
});
