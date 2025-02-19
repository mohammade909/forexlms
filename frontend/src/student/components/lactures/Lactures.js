import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { fetchClassSchedules } from "../../../redux/scheduleSlice";
import { getEnrollmentsByStudentID } from "../../../redux/enrollmentSlice";

const Lectures = () => {
  const dispatch = useDispatch();
  const {
    enrollments,
    loading: enrollmentsLoading,
    error: enrollmentsError,
  } = useSelector((state) => state.enrollments);
  const {
    schedules,
    loading: schedulesLoading,
    error: schedulesError,
  } = useSelector((state) => state.schedules);
  const { auth } = useSelector((state) => state.auth);
  const userId = auth?.user_id;

  useEffect(() => {
    if (userId) {
      dispatch(getEnrollmentsByStudentID(userId));
    }
  }, [dispatch, userId]);
  
  
  
  useEffect(() => {
    if (enrollments.length > 0 && enrollments[0]?.class_id) {
      dispatch(fetchClassSchedules(enrollments[0]?.class_id));
    }
  }, [dispatch, enrollments]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (enrollmentsLoading || schedulesLoading) return <div>Loading...</div>;
  if (enrollmentsError) return <div>Error: {enrollmentsError}</div>;
  if (schedulesError) return <div>Error: {schedulesError}</div>;

  const renderLectures = (lectures, title) => {
    if (!lectures || lectures.length === 0) {
      return (
        <p className="text-gray-500">{`No ${title.toLowerCase()} available.`}</p>
      );
    }

    return lectures.length > 3 ? (
      <Slider {...settings}>
        {lectures.map((lecture) => (
          <div key={lecture.period_id} className="p-4">
            <div className="bg-white border rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-purple-700">
                {lecture.period_name}
              </h3>
              <p>
                <strong>Course:</strong> {lecture.course_name}
              </p>
              <p>
                <strong>Class:</strong> {lecture.class_name}
              </p>
              <p>
                <strong>Teacher:</strong> {lecture.teacher.first_name}{" "}
                {lecture.teacher.last_name}
              </p>
              {lecture.start_time && lecture.end_time ? (
                <p>
                  <strong>Time:</strong> {lecture.start_time} -{" "}
                  {lecture.end_time}
                </p>
              ) : (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(lecture.date).toLocaleDateString()}
                </p>
              )}
              {lecture.class_url && (
                <a
                  href={lecture.class_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-white bg-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                  Join Class
                </a>
              )}
            </div>
          </div>
        ))}
      </Slider>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((lecture) => (
          <div
            key={lecture.period_id}
            className="bg-white border rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-purple-700">
              {lecture.period_name}
            </h3>
            <p>
              <strong>Course:</strong> {lecture.course_name}
            </p>
            <p>
              <strong>Class:</strong> {lecture.class_name}
            </p>
            <p>
              <strong>Teacher:</strong> {lecture.teacher.first_name}{" "}
              {lecture.teacher.last_name}
            </p>
            {lecture.start_time && lecture.end_time ? (
              <p>
                <strong>Time:</strong> {lecture.start_time} - {lecture.end_time}
              </p>
            ) : (
              <p>
                <strong>Date:</strong>{" "}
                {new Date(lecture.date).toLocaleDateString()}
              </p>
            )}
            {lecture.class_url && (
              <a
                href={lecture.class_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-white bg-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                Join Class
              </a>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Today's Lectures</h2>
      {renderLectures(schedules?.todaysLectures, "Today's Lectures")}

      <h2 className="text-2xl font-bold mt-8 mb-4">Past Lectures</h2>
      {renderLectures(schedules?.pastLectures, "Past Lectures")}
    </div>
  );
};

export default Lectures;
