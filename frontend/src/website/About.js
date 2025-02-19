import React from "react";

const About = () => {
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;1,600&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: "\n  * {\n  font-family: 'Source Sans Pro';\n  }\n",
        }}
      />
      <div className="w-full">
        <div className="relative mx-auto my-10 flex flex-col px-20 sm:max-w-xl md:max-w-screen-xl md:flex-row">
          {/* Left Column */}
          <div className="flex h-full w-full space-x-3 overflow-hidden lg:px-2 justify-center">
            {/* Col 2 */}
            <div className="my-auto mb-4 hidden w-50 flex-col space-y-3 lg:flex">
              <div className="rounded-xl">
                <img
                  className="h-full w-full object-contain"
                  src="./tech3.webp"
                  alt
                />
              </div>
            </div>
            <div className="my-auto flex space-x-3 rounded-xl md:mt-4 md:w-60 md:flex-col md:space-y-3 md:space-x-0 md:px-4">
              <div className="overflow-hidden rounded-xl ">
                <img
                  className="mx-auto h-full w-full object-contain object-bottom"
                  src="./tech2.webp"
                  alt
                />
              </div>
              <div className="overflow-hidden rounded-xl">
                <img
                  className="mx-auto h-full w-full object-contain object-bottom"
                  src="./tech.webp"
                  alt
                />
              </div>
            </div>
          </div>

          {/* /Left Column */}
          {/* Right Column */}
          <div className="my-auto mx-auto mt-20 w-full max-w-xl lg:max-w-screen-xl">
            <div className="mb-16 lg:mb-0 lg:max-w-lg">
              <div className="max-w-xl">
                <div>
                  <p className="bg-teal-accent-400 mb-1 inline-block rounded-full px-1  text-xs font-semibold uppercase tracking-wider text-indigo-900">
                  Advance Your Career
                  </p>
                </div>
                <h2 className="mb-3 max-w-lg text-3xl font-bold tracking-tight text-slate-700 sm:text-3xl sm:leading-snug">
                Advance Your Career with In-Demand 
                  <br />
                  <span className="inline-block font-bold text-orange-600">
                  Tech Skills
                  </span>
                </h2>
                <p className="text-base text-gray-700 md:text-lg">
                We're committed to giving you the essential tech skills you need to succeed in today's competitive job market. Our web design courses are designed to empower you with practical, hands-on experience and knowledge that employers value. Whether you're starting from scratch or improving your skills, our expert-led programs ensure you learn the latest techniques in HTML, CSS, responsive design, and more. 
                </p>
              </div>
              <div className="flex items-center">
                <div className="bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-0">
                    <div className="mt-5">
                    <p className="text-base text-gray-700 md:text-lg">
                    You'll work on real-world projects that prepare you for the challenges of modern web design. Join us at Cybersolvings and start your journey toward a successful career in web design.
                </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Right Column */}
        </div>
      </div>
    </div>
  );
};

export default About;
