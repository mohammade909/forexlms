import React, { useState } from "react";
import { SiGooglemarketingplatform } from "react-icons/si";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
const userNavigation = [
  { name: "Your profile", href: "#", type: "nav" },
  { name: "Sign out", href: "#", type: "button" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MegaNavbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const { auth } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showMegaMenu1, setShowMegaMenu1] = useState(false);
  const [showMegaMenu2, setShowMegaMenu2] = useState(false);
  const [showMegaMenu3, setShowMegaMenu3] = useState(false);

  return (
    <header>
      <div className="z-50 ">
        <div className="container mx-auto">
          <div className="relative z-50">
            <div className=" p-4 lg:pt-0">
              <div className="flex justify-between  items-center">
                <div className=" ">
                  <Link
                    to="/"
                    className="flex cursor-pointer items-center whitespace-nowrap text-2xl font-black"
                  >
                    <img src="/cyber.png" className="w-[200px]" alt="" />
                  </Link>

                  <button
                    onClick={() => setOpen(!open)}
                    id="navbarToggler"
                    className={`  ${
                      open && "navbarTogglerActive"
                    } absolute right-4 top-1/2  block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                  >
                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-gray-900"></span>
                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-gray-900"></span>
                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color bg-gray-900"></span>
                  </button>
                </div>
                <nav
                  id="navbarCollapse"
                  className={`alignment-setup absolute right-4 top-full w-full max-w-[600px] rounded-lg bg-white px-6 py-2 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none dark:bg-dark-2 lg:dark:bg-transparent ${
                    !open && "hidden"
                  }`}
                >
                  <ul className="block lg:flex justify-end text-gray-900">
                    <li>
                      <Link
                        to="/"
                        className="flex hover:bg-gray-800 hover:text-white px-3 py-2  w-full items-center justify-between gap-2 rounded-md text-base font-medium  lg:ml-6 lg:inline-flex lg:w-auto lg:justify-center text-gray-800-6"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blogs/list"
                        className="flex hover:bg-gray-800 hover:text-white px-3 py-2  w-full items-center justify-between gap-2 rounded-md text-base font-medium  lg:ml-6 lg:inline-flex lg:w-auto lg:justify-center text-gray-800-6"
                      >
                        Blogs
                      </Link>
                    </li>

                    <li className="relative">
                      <button
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                        className="flex hover:bg-gray-800 hover:text-white px-3 py-2  w-full items-center justify-between gap-2 rounded-md text-base font-medium  lg:ml-6 lg:inline-flex lg:w-auto lg:justify-center text-gray-800-6"
                      >
                        IT Courses
                        <span
                          className={`${
                            showMegaMenu ? "-scale-y-100" : ""
                          } duration-200`}
                        ></span>
                      </button>
                      <div
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                        className={`w-full lg:absolute lg:right-[-460px] lg:top-full   lg:w-[900px] lg:rounded-xl lg:shadow-lg ${
                          showMegaMenu ? "block" : "hidden"
                        }`}
                      >
                        <div className="rounded-lg mt-2 bg-white mr-8 p-2 lg:p-4 dark:bg-dark border">
                          <div className="lg:flex justify-between z-50 ">
                            <div>
                              {/* <div>
                                <div className=" text-center">
                                  <h4 className="mb-1 text-base font-medium text-gray-800">
                                  Web Designing
                                  </h4>
                                  <div className="h-[2px] mt-2 bg-gray-800 px-4"></div>
                                </div>
                              </div> */}
                              <div>
                                <Link
                                  to="/ItCourse/FullStack"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200"
                                >
                                  <div className="text-primary ">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      FullStack Development
                                    </h3>
                                  </div>
                                </Link>

                                <Link
                                  to="/ItCourse/WebDesgin"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Web Designing
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/UiUx"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      UI/UX Designing
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/DigitalMarketing"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Digital Marketing
                                    </h3>
                                  </div>
                                </Link>
                              </div>
                            </div>

                            <div>
                            
                              <div>
                                <Link
                                  to="/ItCourse/DataScience"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Data Science
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/MachineLearning"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Machine Learning
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/DeepLearning"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Deep Learning
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/MobileApplication"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      App Development
                                    </h3>
                                  </div>
                                </Link>
                              </div>
                            </div>

                            <div>
                              <div>
                                <div>
                              
                                </div>
                              </div>
                              <div>
                                <Link
                                  to="/ItCourse/Graphic"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Graphic Designing
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/ArtificialIntelligence"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      AI
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/Python"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Python
                                    </h3>
                                  </div>
                                </Link>
                                <Link
                                  to="/ItCourse/EthicalHacker"
                                  className="group hover:bg-gray-800 text-gray-800 items-center hover:text-white flex  gap-4 rounded-lg  px-4 py-2 duration-200 "
                                >
                                  <div className="text-primary">
                                    <SiGooglemarketingplatform />
                                  </div>
                                  <div className="">
                                    <h3 className="mb-1 text-base font-semibold  duration-200">
                                      Certified Ethical Hacker Certification
                                    </h3>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* <li className="relative">
                      <Link to="/Certificates">
                        <button
                          onMouseEnter={() => setShowMegaMenu1(true)}
                          onMouseLeave={() => setShowMegaMenu1(false)}
                          className="flex hover:bg-gray-800 hover:text-white px-3 py-2  w-full items-center justify-between gap-2 rounded-md text-base font-medium  lg:ml-6 lg:inline-flex lg:w-auto lg:justify-center text-gray-800-6"
                        >
                          Certificate
                          <span
                            className={`${
                              showMegaMenu1 ? "-scale-y-100" : ""
                            } duration-200`}
                          ></span>
                        </button>
                      </Link>
                     
                    </li> */}

                    <li>
                      <Link
                        to="/about"
                        className="flex text-base font-medium hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md lg:ml-6 lg:inline-flex dark:text-gray-800-6"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/service"
                        className="flex text-base font-medium hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md lg:ml-6 lg:inline-flex dark:text-gray-800-6"
                      >
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Contact"
                        className="flex hover:bg-gray-800 hover:text-white px-2 py-2 rounded-md text-base font-medium lg:ml-6 lg:inline-flex dark:text-gray-800-6"
                      >
                        Contact
                      </Link>
                    </li>
                    <div className="pt-2 pl-2">
                    {auth ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="bg-black hover:bg-[#f4a636] text-white font-bold py-2 px-3 rounded-md">
                    Profile
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`/dashboard/${auth.user_type}`}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleLogout()}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link
                  to="/login"
                  className="bg-black hover:bg-[#f4a636] text-white font-bold py-2 px-3 rounded-md"
                >
                  Get Started
                </Link>
              )}
                    </div>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
