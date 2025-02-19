import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaAngleDown, FaArrowsRotate, FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Spinner";
import { getUserById } from "../../redux/usersSlice";
import { fetchStudentAttendanceByUser } from "../../redux/attandanceSlice";

const Reports = () => {
  const { role } = useParams();
  const [rotate, setRotate] = useState(false);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);

  const { attendances } = useSelector((state) => state.attendances);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    dispatch(getUserById(auth?.user_id));
    dispatch(fetchStudentAttendanceByUser(auth?.user_id));
  }, [dispatch, reload]);

  const handleChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const convertToMySQLDateFormat = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDates = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const dates = [];

    // Fill the array with null values for the days before the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }

    return dates;
  };

  const dates = generateCalendarDates(selectedMonth, currentDate.getFullYear());

  return (
    <>
      <section className="py-1 w-full m-auto">
        <div className="flex flex-wrap justify-between shadow bg-white py-2 mb-1">
          <h6 className="text-gray-700 text-xl capitalize font-semibold font-sans px-4 tracking-wider w-1/3">
           Total Absets: {attendances.length}
          </h6>
          <div className="w-2/3 flex gap-2 justify-end px-4 items-center">
            <div className="text-xs w-1/2 font-sans tracking-wider">
              Month{" "}
              <select
                className="border-0 p-2 w-1/2 placeholder-blueGray-300 focus:bg-white text-gray-600 bg-gray-200 rounded-sm text-sm shadow focus:outline-none ease-linear transition-all duration-150"
                value={selectedMonth}
                onChange={handleChange}
              >
                {[...Array(12).keys()].map((index) => (
                  <option key={index} value={index}>
                    {new Date(0, index).toLocaleString("default", {
                      month: "short",
                    })}
                  </option>
                ))}
              </select>
              - Year: {new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div
          className={`flex justify-center ${
            false ? "h-[560px] items-center" : "h-full"
          }`}
        >
          {false ? (
            <Loader />
          ) : (
            <div className="py-3 w-full">
              <div className=" border-b-2 w-full"></div>
              <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 dark:text-gray-400">
                <div className="p-1 bg-red-50 text-red-900">Sun</div>
                <div className="p-1">Mon</div>
                <div className="p-1">Tue</div>
                <div className="p-1">Wed</div>
                <div className="p-1">Thu</div>
                <div className="p-1">Fri</div>
                <div className="p-1">Sat</div>

                {dates.map((date, index) => {
                  const dateString = date
                    ? convertToMySQLDateFormat(date)
                    : null;
                  const isSunday = date ? date.getDay() === 0 : false;
                  const d = new Date("2024-08-04");
                  let day = d.getDate();
                  const attendanceRecord = dateString
                    ? attendances?.find(
                        (record) =>
                          new Date(record.attendance_date)
                            .toISOString()
                            .split("T")[0] === dateString
                      )
                    : null;
                  console.log(dateString);

                  const isPresent = attendanceRecord?.status === "present";
                  const isAbsent = attendanceRecord?.status === "absent";
                  const reason = attendanceRecord?.reason;

                  return (
                    <div
                      key={index}
                      className={`p-2 border border-gray-300 rounded-lg min-w-[100px] h-[100px] ${
                        isSunday
                          ? "bg-red-50 text-red-900"
                          : isPresent
                          ? "bg-green-50 text-green-900"
                          : isAbsent
                          ? "bg-blue-50 text-blue-900"
                          : "bg-white"
                      }`}
                    >
                      {date && (
                        <div className="text-sm font-medium">
                          {date.getDate()}
                        </div>
                      )}
                      {isAbsent && reason && (
                        <div className="text-xs mt-2">Reason: {reason}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Reports;
