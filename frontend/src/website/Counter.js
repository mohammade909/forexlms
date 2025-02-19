import React, { useEffect, useRef } from "react";

const Counter = () => {
  const starsCountRef = useRef(null);
  const downloadsCountRef = useRef(null);
  const sponsorsCountRef = useRef(null);
  const clientCountRef = useRef(null);
  const targets = [
    {
      element: starsCountRef,
      count: 4670,
      suffix: "+",
    },
    {
      element: downloadsCountRef,
      count: 80000,
      suffix: "+",
    },
    {
      element: sponsorsCountRef,
      count: 80000,
      suffix: "+",
    },
   
    {
      element: clientCountRef,
      count: 100,
      suffix: "+",
    },
  ];

  // Function to animate count-up effect
  function animateCountUp(target, duration) {
    let currentCount = 0;
    const increment = Math.ceil(target.count / (duration / 10));

    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= target.count) {
        clearInterval(interval);
        currentCount = target.count;
      }
      if (target.element.current) {
        target.element.current.textContent = currentCount + target.suffix;
      }
    }, 10);
  }

  useEffect(() => {
    const maxCount = Math.max(...targets.map((target) => target.count));
    const duration = 2000; // Duration of the animation in milliseconds

    targets.forEach((target) => {
      animateCountUp(target, duration);
    });
  }, [targets]);

  return (
    <div className=" dark:bg-white">
      <div className="pt-2 bg-gray-50 dark:bg-white sm:pt-20">
        <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold leading-9 text-black dark:text-black sm:text-4xl sm:leading-10">
            Trusted by IT Professionals Worldwide
            </h2>
            <p className="mt-3 text-xl leading-7 text-black dark:text-black sm:mt-4">
            Get the practical IT skills and knowledge needed to confidently pursue your dream IT job.
            </p>
          </div>
        </div>
        <div className="pb-12 mt-10  dark:bg-white sm:pb-16">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 " />
            <div className="relative max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <dl className="  rounded-lg shadow-lg sm:grid sm:grid-cols-4">
                  <div className="flex bg-white flex-col p-6 mr-2 text-center  border-gray-100 dark:border-gray-500   border">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-black dark:text-black">
                    Skilled Professionals
                    </dt>
                    <dd
                      className="order-1 text-5xl font-extrabold leading-none text-black dark:text-black"
                      ref={starsCountRef}
                    >
                      5000
                    </dd>
                  </div>
                  <div className="flex bg-white mr-2 flex-col p-6 text-center  border-gray-100 dark:border-gray-700 border">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-black dark:text-black">
                    Daily Learners
                    </dt>
                    <dd
                      className="order-1 text-5xl font-extrabold leading-none text-black dark:text-black"
                      ref={downloadsCountRef}
                    >
                      5000
                    </dd>
                  </div>
                  <div className="bg-white mr-2 flex flex-col p-6 text-center  border-gray-100 dark:border-gray-700 border">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-black dark:text-black">
                    Global Market Impact
                    </dt>
                    <dd
                      className="order-1 text-5xl font-extrabold leading-none text-black dark:text-black"
                      ref={sponsorsCountRef}
                    >
                      5000
                    </dd>
                  </div>
                  <div className="flex bg-white  flex-col p-6 text-center  border-gray-100 dark:border-gray-700 border">
                    <dt className="order-2 mt-2 text-lg font-medium leading-6 text-black dark:text-black">
                    Success Rate
                    </dt>
                    <dd
                      className="order-1 text-5xl font-extrabold leading-none text-black dark:text-black"
                      ref={sponsorsCountRef}
                    >
                      0
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
