import Stats from "../../admin/components/Stats";
import CalendarComponent from "../../components/CalenderComponent";
import Marquee from '../components/Marquee'
import Lactures from "../components/lactures/Lactures";
export default function StudentDashboard() {
  return (
    <div className="mb-10">
      {/* <Stats /> */}
      <Lactures/>
      {/* <TeacherSchedules/> */}
      {/* <TeacherInfoTable/> */}
      <CalendarComponent />
    </div>
  );
}
