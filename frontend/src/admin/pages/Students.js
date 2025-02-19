import { PlusCircleIcon } from "@heroicons/react/24/outline";
import StudentTable from "../components/student/StudentTable";
import { Link } from "react-router-dom";

export default function Students() {
  return (
    <div>
      <div className="bg-white p-1 my-5 w-full flex justify-end ">
        <Link to='/dashboard/student/add' className="flex gap-3 hover:bg-gray-100 p-2"> <PlusCircleIcon className="w-6 h-6"/><span>Add New </span></Link>
      </div>
      <StudentTable />
    </div>
  );
}
