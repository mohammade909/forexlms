import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsMarks } from "../../../redux/marksSlice";
import { getClasses } from "../../../redux/classSlice";
import { fetchSectionByClass } from "../../../redux/sectionSlice";

const MarksTable = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes);
  const { sections } = useSelector((state) => state.sections);
  const { marks } = useSelector((state) => state.marks);

  // State for selected class and section
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // State for filtered marks
  const [filteredMarks, setFilteredMarks] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getClasses());
    dispatch(fetchStudentsMarks());
  }, [dispatch]);

  // Function to handle class selection
  const handleClassChange = (e) => {
    const classId = parseInt(e.target.value);
    const selectedClass = classes?.find((cls) => cls.class_id === classId);
    setSelectedClass(selectedClass);
    setSelectedSection(null); // Reset section when class changes

    // Fetch sections related to the selected class
    if (classId) {
      dispatch(fetchSectionByClass(classId));
    }
  };

  // Function to handle section selection
  const handleSectionChange = (e) => {
    const sectionId = parseInt(e.target.value);
    const selectedSection = sections?.find(
      (sec) => sec.section_id === sectionId
    );
    setSelectedSection(selectedSection);
  };

  // Filter marks based on selected class and section
  useEffect(() => {
    let filtered = marks;

    if (selectedClass) {
      filtered = filtered?.filter(
        (mark) => mark.class_id === selectedClass.class_id
      );
    }

    if (selectedClass && selectedSection) {
      filtered = filtered?.filter((mark) =>
        mark?.exams?.some((exam) =>
          exam?.subjects?.some(
            (subject) =>
              subject.mark_field.section_id === selectedSection.section_id
          )
        )
      );
    }

    setFilteredMarks(filtered);
  }, [selectedClass, selectedSection, marks]);

  return (
    <div className="container mx-auto p-4">
      {/* Class Filter */}
      <div className="mb-4">
        <label htmlFor="classFilter" className="block mb-2 font-medium">
          Select Class:
        </label>
        <select
          id="classFilter"
          className="border p-2 rounded-md w-full"
          onChange={handleClassChange}
        >
          <option value="">All Classes</option>
          {classes?.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* Section Filter (shown only if a class is selected) */}
      {selectedClass && (
        <div className="mb-4">
          <label htmlFor="sectionFilter" className="block mb-2 font-medium">
            Select Section:
          </label>
          <select
            id="sectionFilter"
            className="border p-2 rounded-md w-full"
            onChange={handleSectionChange}
          >
            <option value="">All Sections</option>
            {sections?.map((sec) => (
              <option key={sec.section_id} value={sec.section_id}>
                {sec.section_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display filtered marks in a table */}
      <div className="p-4">
      {marks?.map((markEntry, index) => {
        const student = markEntry.student;
        return (
          <div key={index} className="mb-6 border border-gray-300 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">
              Student: {student.first_name} {student.middle_name} {student.last_name}
            </h2>
            <div>
              <strong>Student ID:</strong> {student.student_id} <br />
              <strong>Gender:</strong> {student.gender} <br />
              <strong>Date of Birth:</strong> {new Date(student.date_of_birth).toLocaleDateString()} <br />
              <strong>Contact:</strong> {student.phone} <br />
              <strong>Address:</strong> {student.street_address}, {student.city}, {student.pin_code} <br />
            </div>

            <h3 className="mt-4 text-lg font-semibold">Exams:</h3>
            {student.exams.map((exam, examIndex) => (
              <div key={examIndex} className="mt-2">
                <strong>Exam Name:</strong> {exam.exam_name} <br />
                <strong>Start Date:</strong> {new Date(exam.start_date_time).toLocaleString()} <br />
                <strong>End Date:</strong> {new Date(exam.end_date_time).toLocaleString()} <br />
                <strong>Subjects:</strong>
                <ul className="list-disc list-inside ml-4">
                  {exam.subjects.map((subject, subjectIndex) => (
                    <li key={subjectIndex}>
                      <strong>Subject:</strong> {subject.subjectDetails[0].subject_name} <br />
                      <strong>Marks:</strong> {subject.subjectDetails[0].tableRecords.length > 0 ? (
                        subject.subjectDetails[0].tableRecords.map((record) => (
                          <div key={record.record_id}>
                            {`Marks: ${record.marks} (${record.remarks})`}
                          </div>
                        ))
                      ) : (
                        <span>No records found</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default MarksTable;
