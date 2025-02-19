import React from "react";

const HeadingFeature = () => {
  return (
    <div>
      <section className="overflow-hidden bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8  lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className=" flex justify-center items-center dark:bg-white">
                <div className="max-w-xl mx-auto w-full">
                  {/* To achieve the desired progress, you can update the 'stroke-dasharray' property. */}
                  <h4 className="text-3xl md:text-5xl dark:text-black font-bold mb-6">
                    Skills
                  </h4>
                  <div className="mb-7">
                    <div className="flex justify-between py-1">
                      <span className="text-base text-gray-lite font-semibold dark:text-[#000000]">
                        Web Design
                      </span>
                      <span className="text-base font-semibold text-gray-lite pr-5 dark:text-[#000000]">
                        80%
                      </span>
                    </div>
                    <svg
                      className="rc-progress-line"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <path
                        className="rc-progress-line-trail"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#D9D9D9"
                        strokeWidth={1}
                        fillOpacity={0}
                      />
                      <path
                        className="rc-progress-line-path"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#FF6464"
                        strokeWidth={1}
                        fillOpacity={0}
                        style={{
                          strokeDasharray: "79.2px, 100px",
                          strokeDashoffset: 0,
                          transition:
                            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s linear 0s, 0.06s",
                        }}
                      ></path>
                    </svg>
                  </div>
                  <div className="mb-7">
                    <div className="flex justify-between py-1">
                      <span className="text-base text-gray-lite font-semibold dark:text-[#111111]">
                        Mobile App{" "}
                      </span>
                      <span className="text-base font-semibold text-gray-lite pr-5 dark:text-[#111111]">
                        95%
                      </span>
                    </div>
                    <svg
                      className="rc-progress-line"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <path
                        className="rc-progress-line-trail"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#D9D9D9"
                        strokeWidth={1}
                        fillOpacity={0}
                      />
                      <path
                        className="rc-progress-line-path"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#9272D4"
                        strokeWidth={1}
                        fillOpacity={0}
                        style={{
                          strokeDasharray: "94.05px, 100px",
                          strokeDashoffset: 0,
                          transition:
                            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s linear 0s, 0.06s",
                        }}
                      ></path>
                    </svg>
                  </div>
                  <div className="mb-7">
                    <div className="flex justify-between py-1">
                      <span className="text-base text-gray-lite font-semibold dark:text-[#111111]">
                        Illustrator
                      </span>
                      <span className="text-base font-semibold text-gray-lite pr-5 dark:text-[#151515]">
                        65%
                      </span>
                    </div>
                    <svg
                      className="rc-progress-line"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <path
                        className="rc-progress-line-trail"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#D9D9D9"
                        strokeWidth={1}
                        fillOpacity={0}
                      />
                      <path
                        className="rc-progress-line-path"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#5185D4"
                        strokeWidth={1}
                        fillOpacity={0}
                        style={{
                          strokeDasharray: "64.35px, 100px",
                          strokeDashoffset: 0,
                          transition:
                            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s linear 0s, 0.06s",
                        }}
                      ></path>
                    </svg>
                  </div>
                  <div className="mb-7">
                    <div className="flex justify-between py-1">
                      <span className="text-base text-gray-lite font-semibold dark:text-[#171616]">
                        Photoshope
                      </span>
                      <span className="text-base font-semibold text-gray-lite pr-5 dark:text-[#121111]">
                        75%
                      </span>
                    </div>
                    <svg
                      className="rc-progress-line"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <path
                        className="rc-progress-line-trail"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#D9D9D9"
                        strokeWidth={1}
                        fillOpacity={0}
                      />
                      <path
                        className="rc-progress-line-path"
                        d="M 0.5,0.5
   L 99.5,0.5"
                        strokeLinecap="round"
                        stroke="#CA56F2"
                        strokeWidth={1}
                        fillOpacity={0}
                        style={{
                          strokeDasharray: "74.25px, 100px",
                          strokeDashoffset: 0,
                          transition:
                            "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s linear 0s, 0.06s",
                        }}
                      ></path>
                    </svg>
                  </div>
                  <div className="mb-7">
                    <div className="flex justify-between py-1">
                      <p>
                        I am a highly skilled and experienced web developer with
                        a passion for creating user-friendly websites. I have a
                        strong understanding of the latest web technologies,
                        including HTML, CSS, JavaScript, and React. I am also
                        proficient in a variety of design tools, such as
                        Photoshop and Illustrator.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxjb21wdXRlcnxlbnwwfDB8fHwxNjkxODE2NjY3fDA&ixlib=rb-4.0.3&q=80&w=1080"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeadingFeature;
