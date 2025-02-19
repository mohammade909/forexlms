import Calender from "../components/Calender";
import Stats from "../components/Stats";
import CalendarComponent from "../../components/CalenderComponent";
import Matrix from "../../components/Matrix";
import FeeStats from "../components/FeeStats";
import UserList from "../../components/NewUserList";
export default function AdminDashboard() {
  return (
    <div className="mb-10">
      <FeeStats />
      <div className="flex gap-5">
        <div className="w-[60%] p-5  ">
          <UserList />
        </div>
        <div className="w-[40%]">
          <CalendarComponent />
        </div>
      </div>
      {/* <TeacherSchedules/> */}
      {/* <TeacherInfoTable/> */}
      {/* <CalendarComponent /> */}
    </div>
  );
}
