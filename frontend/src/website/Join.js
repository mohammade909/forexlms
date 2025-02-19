import React from "react";

const Join = () => {
  return (
    <>
      <div className="bg-black">
        <div className="mx-auto max-w-7xl py-5 px-22 sm:py-5 ">
          <div className="relative isolate overflow-hidden bg-black px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className=" max-w-sm text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Take Your IT Skills
                <br />
                to the Next Level
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
              IT skills are in high demand and can help you get a better job or start your own business. We offer a variety of IT courses to help you learn the skills you need to succeed. Get started today!
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <a
                  href="#"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Join Now
                </a>
              </div>
            </div>
            <div className="relative mt-4 h-auto lg:mt-4">
              <img
                className="w-[600px] h-[65%] mt-20 absolute left-0 top-50 max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="./edu.gif"
                alt="App screenshot"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Join;
