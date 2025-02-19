import React from "react";
import List from "../components/course/List";
import {
  FaAngleDown,
  FaArrowsRotate,
  FaXmark,

} from "react-icons/fa6";
import TabMenus from "../BaseFiles/TabMenus";
const tabs =[
  {name:'Courses', href:'/admin/courses'},
  {name:'Add Course', href:'/courses/create'}
]
const Coureses = () => {
  return (
    <div>
    <TabMenus tabs={tabs}/>
      {/* <div className="flex flex-wrap justify-between shadow bg-white py-2 mb-1">
        <h6 className="text-gray-700 text-xl capitalize font-semibold font-sans px-4 tracking-wider w-1/3">
        
        </h6>
        <div className="w-2/3 flex gap-2 justify-end px-4 items-center">
          <div className=" text-xs w-1/2 font-sans tracking-wider">
            
            <input 
            type="text"
              className={`border-0 p-2 w-full tracking-wider placeholder-blueGray-300 px-3 focus:bg-gray-600 text-white bg-gray-600 rounded-sm text-sm shadow focus:outline-none ease-linear transition-all duration-150`}
              // value={selectedMonth}
              // onChange={handleChange}
              placeholder="Search course name..."
            />
            
            
  
          </div>

          <FaAngleDown className="text-yellow-700 cursor-pointer" />
          <FaArrowsRotate
            className={`text-green-700 cursor-pointer ${
              false
                ? "rotate-180 transition-transform duration-1000"
                : "transition-transform"
            }`}
          />
          <FaXmark className="text-red-700 cursor-pointer" />
        </div>
      </div> */}
      <List />
    </div>
  );
};

export default Coureses;
