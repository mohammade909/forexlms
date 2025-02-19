import React from "react";

const Defin = ({ data }) => {
  console.log(data);
  return (
    <>
      <div className="bg-white dark:bg-gray-800 h-auto py-6">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-4  gap-8 sm:mb-8 md:mb-12">
            <div className="relative flex justify-center">
              <span className="px-3 text-4xl font-bold leading-6 ">
                {data?.[3].title}
              </span>
            </div>

            {/* </div>  */}
            {/* <a href="#" className="inline-block rounded-lg border bg-white dark:bg-gray-700 dark:border-none px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-200 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base">
        More
      </a>  */}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
            {/* image - start */}
            {data?.[3].Course_img.map((item, index) => (
              <a
                key={index}
                href="#"
                className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
              >
                <img
                  src={item.img}
                  loading="lazy"
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                <span className=" inline-block text-sm text-white md:text-sm bg-black px-5 py-1 rounded-t-md">
                  {item.title}
                </span>
              </a>
            ))}
            {/* <a href="#" className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
        <img src="html1.jpg" loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
        </div>
        <span className=" inline-block text-sm text-white md:text-sm bg-black px-5 py-1 rounded-t-md">HTML</span>
      </a> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Defin;
