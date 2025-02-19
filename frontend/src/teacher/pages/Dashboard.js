import Calender from "../../admin/components/Calender";
import Stats from "../../admin/components/Stats";
import CalendarComponent from "../../components/CalenderComponent";
import LactureList from "../components/schedule/LactureList";
import TeacherDetails from "../components/TeacherDetails";
export default function Dashboard() {
  return (
    <div className="mb-10">
      <Stats />
      {/* <TeacherSchedules/> */}
  
      <CalendarComponent />
    </div>
  );
}
