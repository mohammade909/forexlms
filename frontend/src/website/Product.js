import React from "react";

const Product = () => {
  return (
    <>
      <div className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <span className="bg-white px-3 text-4xl leading-normal font-bold text-gray-900">
                Helping Business Globally
              </span>
              <p className="hidden text-gray-500 dark:text-gray-300 md:block pt-2 text-center">
                Transform your digital presence and reach customers worldwide
                through expert web design.
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-gray-200/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  Skilled Professionals
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  879
                </dd>
              </div>
              <div className="flex flex-col bg-gray-200/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  Daily Learners
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  1056
                </dd>
              </div>
              <div className="flex flex-col bg-gray-200/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  Global Market Impact
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  10k
                </dd>
              </div>
              <div className="flex flex-col bg-gray-200/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600">
                  Success Rate
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  98%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
