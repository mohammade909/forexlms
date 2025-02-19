const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");

// CREATE Section
exports.createSection = catchAsyncErrors(async (req, res, next) => {
  const sectionFields = req.body;

  const query = "INSERT INTO sections SET ?";

  db.query(query, sectionFields, (err, result) => {
    if (err) {
        console.log(err);
        
      return next(new ErrorHandler("Error creating section", 500));
    } else {
      return res.status(201).json({
        success: true,
        message: "Section created successfully",
        section_id: result.insertId,
      });
    }
  });
});

// GET All Sections
exports.getSections = catchAsyncErrors(async (req, res, next) => {
  const query = `
    SELECT s.section_id, s.section_name, s.section_capacity, s.class_id, s.teacher_id, 
           s.created_at, s.updated_at,
           c.class_name, t.first_name AS teacher_name,t.last_name AS teacher_last_name
    FROM sections s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
  `; 

  db.query(query, (err, results) => {
    if (err) {
        console.log(err);
        
      return next(new ErrorHandler("Error fetching sections", 500));
    } else {
      return res.status(200).json({
        success: true,
        sections: results,
      });
    }
  });
});

exports.getSectionsByClassId = catchAsyncErrors(async (req, res, next) => {
  const classId = req.params.class_id;

  const query = `
    SELECT section_id, section_name, section_capacity, class_id, teacher_id, created_at, updated_at
    FROM sections
    WHERE class_id = ?
  `;

  db.query(query, [classId], (err, results) => {
    if (err) {
      console.log(err);
      
      return next(new ErrorHandler("Error fetching sections", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("No sections found for this class", 404));
    } else {
      return res.status(200).json({
        success: true,
        sections: results,
      });
    }
  });
});

// GET Section by ID
exports.getSectionById = catchAsyncErrors(async (req, res, next) => {
  const sectionId = req.params.id;

  const query = `
    SELECT s.section_id, s.section_name, s.section_capacity, s.class_id, s.teacher_id, 
           s.created_at, s.updated_at,
           c.class_name, t.teacher_name, t.teacher_email, t.teacher_phone
    FROM sections s
    LEFT JOIN classes c ON s.class_id = c.class_id
    LEFT JOIN teachers t ON s.teacher_id = t.teacher_id
    WHERE s.section_id = ?
  `;

  db.query(query, [sectionId], (err, results) => {
    if (err) {
      return next(new ErrorHandler("Error fetching section", 500));
    } else if (results.length === 0) {
      return next(new ErrorHandler("Section not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        data: results,
      });
    }
  });
});

// UPDATE Section
exports.updateSection = catchAsyncErrors(async (req, res, next) => {
  const sectionId = req.params.id;
  const sectionFields = req.body;

  const query = "UPDATE sections SET ? WHERE section_id = ?";

  db.query(query, [sectionFields, sectionId], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error updating section", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Section not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Section updated successfully",
      });
    }
  });
});

// DELETE Section
exports.deleteSection = catchAsyncErrors(async (req, res, next) => {
  const sectionId = req.params.id;

  const query = "DELETE FROM sections WHERE section_id = ?";

  db.query(query, [sectionId], (err, result) => {
    if (err) {
      return next(new ErrorHandler("Error deleting section", 500));
    } else if (result.affectedRows === 0) {
      return next(new ErrorHandler("Section not found", 404));
    } else {
      return res.status(200).json({
        success: true,
        message: "Section deleted successfully",
        id: sectionId
      });
    }
  });
});


// Get Section, Class, and Subject Details by Section ID
exports.getSectionDetails = catchAsyncErrors(async (req, res, next) => {
    const { section_id } = req.params;
   console.log(section_id);
   
    // Query to get class and section teacher details
    const sectionQuery = `
        SELECT s.section_id, s.section_name, s.section_capacity, 
               c.class_id, c.class_name, c.class_starting_on, c.class_ending_on,
               t.teacher_id, t.first_name, t.middle_name, t.last_name, t.phone, t.profile_photo, t.qualification
        FROM sections s
        JOIN classes c ON s.class_id = c.class_id
        JOIN teachers t ON s.teacher_id = t.teacher_id
        WHERE s.section_id = ?;
    `;

    // Query to get subjects and their respective teachers' details
    const subjectQuery = `
        SELECT sub.subject_id, sub.subject_name, sub.subject_code, sub.book_name, 
               sub_t.teacher_id, sub_t.first_name AS subject_teacher_first_name, sub_t.middle_name AS subject_teacher_middle_name, sub_t.last_name AS subject_teacher_last_name, 
               sub_t.phone AS subject_teacher_phone, sub_t.profile_photo AS subject_teacher_photo, sub_t.qualification AS subject_teacher_qualification
        FROM subjects sub
        JOIN teachers sub_t ON sub.subject_teacher = sub_t.teacher_id
        WHERE sub.section_id = ?;
    `;

    // Execute section query
    db.query(sectionQuery, [section_id], (sectionErr, sectionResult) => {
        if (sectionErr) {
            return res.status(500).json({
                success: false,
                message: 'Error fetching section and class details',
                error: sectionErr
            });
        }

        if (sectionResult.length === 0) {
            return res.status(200).json({
                success: true,
                sections: []
            });
        }

        const sectionDetails = sectionResult[0];

        // Execute subject query
        db.query(subjectQuery, [section_id], (subjectErr, subjectResult) => {
            if (subjectErr) {
                return res.status(500).json({
                    success: false,
                    message: 'Error fetching subjects and their respective teacher details',
                    error: subjectErr
                });
            }

            // Return response with section, class, teacher, and subject details
            res.status(200).json({
                success: true,
                section: {
                    section: {
                        section_id: sectionDetails.section_id,
                        section_name: sectionDetails.section_name,
                        section_capacity: sectionDetails.section_capacity
                    },
                    _class: {
                        class_id: sectionDetails.class_id,
                        class_name: sectionDetails.class_name,
                        class_starting_on: sectionDetails.class_starting_on,
                        class_ending_on: sectionDetails.class_ending_on
                    },
                    incharge_teacher: {
                        teacher_id: sectionDetails.teacher_id,
                        first_name: sectionDetails.first_name,
                        middle_name: sectionDetails.middle_name,
                        last_name: sectionDetails.last_name,
                        phone: sectionDetails.phone,
                        profile_photo: sectionDetails.profile_photo,
                        qualification: sectionDetails.qualification
                    },
                    subjects: subjectResult.map(subject => ({
                        subject_id: subject.subject_id,
                        subject_name: subject.subject_name,
                        subject_code: subject.subject_code,
                        book_name: subject.book_name,
                        subject_teacher: {
                            teacher_id: subject.teacher_id,
                            first_name: subject.subject_teacher_first_name,
                            middle_name: subject.subject_teacher_middle_name,
                            last_name: subject.subject_teacher_last_name,
                            phone: subject.subject_teacher_phone,
                            profile_photo: subject.subject_teacher_photo,
                            qualification: subject.subject_teacher_qualification
                        }
                    }))
                }
            });
        });
    });
});
