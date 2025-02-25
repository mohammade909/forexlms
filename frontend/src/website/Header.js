import React from "react";
import {
  FaInstagramSquare,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

const Header = () => {
  return (
    // <div>

    //   <header>
    //     {/* Navbar */}
    //     <nav className="flex-no-wrap relative flex w-full items-center justify-between bg-[#FBFBFB] py-2 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4">
    //       <div className="flex w-full flex-wrap items-center justify-between px-3">
    //         {/* Hamburger button for mobile view */}
    //         <button
    //           className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
    //           type="button"
    //           data-twe-collapse-init
    //           data-twe-target="#navbarSupportedContent1"
    //           aria-controls="navbarSupportedContent1"
    //           aria-expanded="false"
    //           aria-label="Toggle navigation"
    //         >
    //           {/* Hamburger icon */}
    //           <span className="[&>svg]:w-7">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //               fill="currentColor"
    //               className="h-7 w-7"
    //             >
    //               <path
    //                 fillRule="evenodd"
    //                 d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
    //                 clipRule="evenodd"
    //               />
    //             </svg>
    //           </span>
    //         </button>
    //         {/* Collapsible navigation container */}
    //         <div
    //           className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
    //           id="navbarSupportedContent1"
    //           data-twe-collapse-item
    //         >
    //           {/* Logo */}
    //           <a
    //             className="mb-4 me-5 ms-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
    //             href="#"
    //           >
    //             <img
    //               src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
    //               style={{ height: 15 }}
    //               alt="TE Logo"
    //               loading="lazy"
    //             />
    //           </a>
    //           {/* Left navigation links */}
    //           <ul
    //             className="list-style-none me-auto flex flex-col ps-0 lg:flex-row"
    //             data-twe-navbar-nav-ref
    //           >
    //             <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
    //               {/* Dashboard link */}
    //               <a
    //                 className="text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
    //                 href="#"
    //                 data-twe-nav-link-ref
    //               >
    //                 Dashboard
    //               </a>
    //             </li>
    //             {/* Team link */}
    //             <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
    //               <a
    //                 className="text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
    //                 href="#"
    //                 data-twe-nav-link-ref
    //               >
    //                 Team
    //               </a>
    //             </li>
    //             {/* Projects link */}
    //             <li className="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
    //               <a
    //                 className="text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
    //                 href="#"
    //                 data-twe-nav-link-ref
    //               >
    //                 Projects
    //               </a>
    //             </li>
    //           </ul>
    //         </div>
    //         {/* Right elements */}
    //         <div className="relative flex items-center">
    //           {/* Cart Icon */}
    //           <a
    //             className="me-4 text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
    //             href="#"
    //           >
    //             <span className="[&>svg]:w-5">
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 viewBox="0 0 24 24"
    //                 fill="currentColor"
    //                 className="h-5 w-5"
    //               >
    //                 <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
    //               </svg>
    //             </span>
    //           </a>
    //           {/* Container with two dropdown menus */}
    //           <div
    //             className="relative"
    //             data-twe-dropdown-ref
    //             data-twe-dropdown-alignment="end"
    //           >
    //             {/* First dropdown trigger */}
    //             <a
    //               className="hidden-arrow me-4 flex items-center text-neutral-600 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
    //               href="#"
    //               id="dropdownMenuButton1"
    //               role="button"
    //               data-twe-dropdown-toggle-ref
    //               aria-expanded="false"
    //             >
    //               {/* Dropdown trigger icon */}
    //               <span className="[&>svg]:w-5">
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   viewBox="0 0 24 24"
    //                   fill="currentColor"
    //                   className="h-5 w-5"
    //                 >
    //                   <path
    //                     fillRule="evenodd"
    //                     d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
    //                     clipRule="evenodd"
    //                   />
    //                 </svg>
    //               </span>
    //               {/* Notification counter */}
    //               <span className="absolute -mt-4 ms-2.5 rounded-full bg-danger px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white">
    //                 1
    //               </span>
    //             </a>
    //             {/* First dropdown menu */}
    //             <ul
    //               className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-neutral-700"
    //               aria-labelledby="dropdownMenuButton1"
    //               data-twe-dropdown-menu-ref
    //             >
    //               {/* First dropdown menu items */}
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Action
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Another action
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Something else here
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //           {/* Second dropdown container */}
    //           <div
    //             className="relative"
    //             data-twe-dropdown-ref
    //             data-twe-dropdown-alignment="end"
    //           >
    //             {/* Second dropdown trigger */}
    //             <a
    //               className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
    //               href="#"
    //               id="dropdownMenuButton2"
    //               role="button"
    //               data-twe-dropdown-toggle-ref
    //               aria-expanded="false"
    //             >
    //               {/* User avatar */}
    //               <img
    //                 src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg"
    //                 className="rounded-full"
    //                 style={{ height: 25, width: 25 }}
    //                 alt
    //                 loading="lazy"
    //               />
    //             </a>
    //             {/* Second dropdown menu */}
    //             <ul
    //               className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-neutral-700"
    //               aria-labelledby="dropdownMenuButton2"
    //               data-twe-dropdown-menu-ref
    //             >
    //               {/* Second dropdown menu items */}
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Action
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Another action
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
    //                   href="#"
    //                   data-twe-dropdown-item-ref
    //                 >
    //                   Something else here
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //         </div>
    //       </div>
    //     </nav>
    //     {/* Navbar */}
    //   </header>

    // </div>

    <>
      <div>
        <nav className="border-gray-200 dark:bg-gray-900 border-b">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <div className="flex items-center gap-4 space-x-6 rtl:space-x-reverse w-4/6">
              <a
                href="tel:5541251234"
                className="text-sm  text-gray-500 dark:text-white hover:underline"
              >
                <FaPhoneAlt />
              </a>
              (555) 412-1234
              <a
                href="info@cybersolvings.com"
                className="text-sm  text-gray-500 dark:text-white hover:underline"
              >
                <IoMail />
              </a>
              info@cybersolvings.com
              <a
                href="tel:5541251234"
                className="text-sm  text-gray-500 dark:text-white hover:underline"
              >
                <FaLocationDot />
              </a>
              DD Bulding opp. new bus stand kurukeshtra
            </div>
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <a
                href="#"
                className="text-sm  text-white-600 dark:text-white-500 hover:underline"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="text-sm  text-white-600 dark:text-white-500 hover:underline"
              >
                <FaInstagramSquare />
              </a>
              <a
                href="#"
                className="text-sm  text-white-600 dark:text-white-500 hover:underline"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-sm  text-white-600 dark:text-white-500 hover:underline"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
