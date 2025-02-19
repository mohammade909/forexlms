import React from 'react'
import { Link } from 'react-router-dom'
const Web = ({data}) => {
  console.log(data)
  return (
    <>
     <div className="relative bg-gray-900">
      <div className="relative h-80 overflow-hidden bg-indigo-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
        <img
          alt={data?.[1].alt}
          src={data?.[1].main_image}
          className="h-full w-full object-cover"
        />
        <svg
          viewBox="0 0 926 676"
          aria-hidden="true"
          className="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]"
        >
          <path
            d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
            fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
            fillOpacity=".4"
          />
          <defs>
            <linearGradient
              id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
              x1="926.392"
              x2="-109.635"
              y1=".176"
              y2="321.024"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#776FFF" />
              <stop offset={1} stopColor="#FF4694" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative mx-auto max-w-7xl py-12  lg:px-8 ">
        <div className="lg-pl-16 sm-pl-0 px-8  md:ml-auto md:w-2/3  lg:w-1/2 ">
          <h2 className="text-base font-semibold leading-7 text-[#e19426]">{data?.[1].small_text_one}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{data?.[1].title}</p>
          <p className="mt-6 text-base leading-7 text-gray-300 text-justify">
          {data?.[1].desc}</p>
          <div className="mt-8">
            <Link
              to="/Contact"
              className="inline-flex rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {data?.[1].visit_btn}
             
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Web
