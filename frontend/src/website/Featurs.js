import React from "react";

const Featurs = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className="max-w-7xl mx-auto mt-16 mb-10 px-8">
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-4xl font-bold text-center text-gray-900">
            {data?.[2].title}
          </span>
        </div>
        <p className="mt-3 text-base leading-7 text-gray-600  text-center">
          {data?.[2].sub_title}</p>
          <div className="grid md:grid-cols-2 gap-10 mt-10">
          {
             data?.[2].feature.map((data) => (
              <div className="flex gap-4 items-start">
              <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">
             {data.icon}
              </span>
              <div>
                <h3 className="font-semibold text-lg">{data.title}</h3>
                <p className="mt-1 text-gray-500">
                  {" "}
                  {data.desc}
                </p>
              </div>
            </div>
             ))
          }
        </div>
      </div>
    </>
  );
};

export default Featurs;
