import React from "react";
import { Link } from "react-router-dom";

const Category = ({ course }) => {
  console.log(course);
  return (
    <div className="w-full max-w-full mb-8 px-4 flex flex-col">
      <img
        src={`/courses/${course.course_image}`}
        alt="Card img"
        className="object-cover object-center w-full h-48 rounded-t-lg"
      />
      <div className="flex flex-grow">
        <div className="triangle" />
        <div className="flex flex-col px-5 rounded-b-lg py-4 bg-white border border-gray-400 text">
          <div>
            {/* <a
              href="#"
              className="inline-block mb-2  text-blue-600  text-xs font-bold capitalize border border-blue-600 hover:text-blue-600"
            >
              Reliable Schemas
            </a> */}
            <a
              href="#"
              className="block mb-1 text-md font-black leading-tight hover:underline hover:text-blue-600"
            >
              {course?.
course_name}
            </a>
            <p className="mb-2 text-sm text-justify">{course?.
course_description
}</p>
          </div>
          <div>
            <Link
              to={`/courses/view/${course?.course_id}`}
              className="inline-block  mt-1 text-base font-black text-blue-600 capitalize tracking-wide border-b border-transparent hover:border-blue-600 bg-black  text-white px-3 py-1 text-sm rounded-md"
            >Read More...</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
