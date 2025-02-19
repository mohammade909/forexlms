import React from "react";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Company", href: "#" },
];
const stats = [
  { label: "Transactions every 24 hours", value: "44 million" },
  { label: "Assets under holding", value: "$119 trillion" },
  { label: "New users annually", value: "46,000" },
];
const values = [
  {
    name: "Provide High-Quality IT Education",
    description:
      "Provide High-Quality IT EducationWe offer up-to-date courses that give students practical skills and knowledge needed in the IT industry. Our curriculum is regularly updated with the latest technologies and best practices.",
  },
  {
    name: "Encourage Innovation",
    description:
      "We inspire creative thinking and problem-solving skills to prepare students for the changing world of technology. Through real-world projects, we nurture an innovative mindset in our students.",
  },
  {
    name: "Make Learning Accessible",
    description:
      "We provide flexible class schedules to make IT education accessible to learners from diverse backgrounds. Our conveniently located facility and varied course timings ensure quality education is available to all, accommodating different work and life commitments.",
  },
  {
    name: "Build a Supportive Community",
    description:
      "We create a collaborative environment where students learn, share, and grow together. Networking opportunities, peer learning, and mentorship programs enhance the overall learning experience.",
  },
  {
    name: "Bridge the Skills Gap",
    description:
      "Our curriculum is designed in collaboration with industry needs to prepare students for jobs. We partner with tech companies to ensure our courses meet current market demands and trends.",
  },
  {
    name: "Promote Lifelong Learning",
    description:
      "We encourage our students to keep learning and developing professionally. Our resources and guidance support ongoing skill enhancement, helping alumni stay competitive in their careers long after completing our courses.",
  },
];
const team = [
  {
    name: "Parth Panchal",
    role: "Manager / AI Engineer",
    imageUrl: "/teams/parth.JPG",
    alt: "parth",
  },
  {
    name: "Mohammad Aasif",
    role: "Software Engineer SDE II",
    imageUrl: "/teams/mohammad.jpeg",
    alt: "mohammad",
  },
  {
    name: "Satish Thakur",
    role: "Frontend Expert",
    imageUrl: "/teams/satish-thakur.jpg",
    alt: "staish thakur",
  },
  {
    name: "Manoj ",
    role: "Backend Expert",
    imageUrl: "/teams/manoj-talwar.jpg",
    alt: "manoj kumar",
  },

  // More people...
];
const blogPosts = [
  {
    id: 1,
    title: "Vel expedita assumenda placeat aut nisi optio voluptates quas",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://media.istockphoto.com/id/1371339413/photo/co-working-team-meeting-concept-businessman-using-smart-phone-and-digital-tablet-and-laptop.jpg?s=612x612&w=0&k=20&c=ysEsVw3q2axYt3oVZAuQjtHRlN3lY-U_e0ikK5yKIXQ=",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    alt: "expedita assumenda",
    author: {
      name: "Michael Foster",
      alt: "Michael Foster",
      imageUrl:
        "https://i.pinimg.com/474x/68/06/24/680624236bf7c6d77afc034674244be7.jpg",
    },
  },
  {
    id: 1,
    title: "Vel expedita assumenda placeat aut nisi optio voluptates quas",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://www.skillreactor.io/blog/wp-content/uploads/2024/05/Full-Stack-Developer.jpg",
    date: "Mar 16, 2020",
    alt: "voluptates",
    datetime: "2020-03-16",
    author: {
      name: "Michael Foster",
      alt: "Michael",
      imageUrl:
        "https://i.pinimg.com/236x/81/8f/1b/818f1b3ee137f5891a952ce42744161f.jpg",
    },
  },
  {
    id: 1,
    title: "Vel expedita assumenda placeat aut nisi optio voluptates quas",
    href: "#",
    alt: "voluptas",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://media.istockphoto.com/id/1452604857/photo/businessman-touching-the-brain-working-of-artificial-intelligence-automation-predictive.jpg?s=612x612&w=0&k=20&c=GkAOxzduJbUKpS2-LX_l6jSKtyhdKlnPMo2ito4xpR4=",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    author: {
      name: "Michael Foster",
      alt: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More posts...
];

const OurMission = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
          <div
            aria-hidden="true"
            className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          >
            <div
              style={{
                clipPath:
                  "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
              }}
              className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
        </div>
        {/* Content section */}
        <div className="mx-auto  max-w-7xl px-6 sm:mt-0 lg:px-8 ">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get the IT Skills You Need to Succeed
            </h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="ext-base leading-8 text-gray-600">
                  At CyberSolvings, we love helping people like you reach their
                  IT goals. Technology is always changing, and there's a big
                  need for skilled IT workers. That's why we offer a wide range
                  of IT courses to give you the knowledge and skills you need to
                  succeed. Our courses are designed to be easy to understand and
                  practical.
                </p>
                <div className="mt-5 max-w-xl text-base leading-7 text-gray-700">
                  <p>
                    We aim to connect theory with practice by providing
                    high-quality, relevant IT education. We believe everyone
                    should have the chance to learn and grow in the tech world.
                    We strive to make our courses accessible and beneficial for
                    all learners.
                  </p>
                  <p className="mt-5">
                    We focus on the learner, offering interactive learning
                    experiences for different learning styles. Our courses are
                    created and taught by experienced IT professionals who are
                    eager to share their knowledge. We ensure our teaching
                    methods are engaging and effective.
                  </p>
                </div>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col-reverse gap-y-4"
                    >
                      <dt className="text-base leading-7 text-gray-600">
                        {stat.label}
                      </dt>
                      <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
        {/* Image section */}
        <div className="mt-16 sm:mt-16 xl:mx-auto xl:max-w-7xl xl:px-8">
          <img
            alt="unsplash"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
          />
        </div>
        .ḍ
        {/* Values section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-16 lg:px-8">
          <div className="mx-auto max-w-7xl lg:mx-0 text-center ">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900  sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-2 text-lg mb-8 mx-auto px-16 text-gray-600">
              Our core values shape everything we do. These principles guide our
              approach to education, innovation, and student success.
            </p>
          </div>
          <dl className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-5 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className=" text-gray-900 text-base font-semibold">
                  {value.name}
                </dt>
                <dd className="mt-1 text-gray-600 text-base">
                  {value.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {/* Logo cloud */}
        <div className="relative isolate -z-10 mt-5 sm:mt-5">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
            <svg
              aria-hidden="true"
              className="h-[40rem] w-[80rem] flex-none stroke-gray-200"
            >
              <defs>
                <pattern
                  x="50%"
                  y="50%"
                  id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                  patternTransform="translate(-100 0)"
                >
                  <path d="M.5 200V.5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y="50%" className="overflow-visible fill-gray-50">
                <path
                  d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>
          </div>
        </div>
        {/* Team section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-16 lg:px-8">
          <div className="mx-auto max-w-7xl lg:mx-0 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-1 text-lg  text-gray-600">
              Meet the team at CyberSolvings. Our instructors and support staff
              are dedicated professionals with years of industry experience and
              a strong passion for teaching in every class.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-10 flex justify-around max-w-2xl gap-x-8 gap-y-16 text-center lg:mx-0 lg:max-w-none"
          >
            {team.map((person) => (
              <li key={person.name}>
                <img
                  alt={person.alt}
                  src={person.imageUrl}
                  className="mx-auto h-24 w-24 rounded-full"
                />
                <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-sm leading-6 text-gray-600">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>
        {/* Blog section */}
        <div className="mx-auto mt-10 max-w-7xl px-6 sm:mt-10 lg:px-8 py-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none text-center">
            <h2 className="text-3xl font-bold  text-gray-900 sm:text-4xl">
              From the blog
            </h2>
            <p className="mt-2 text-lg  text-gray-600">
              Stay informed about the latest IT trends, career advice, and tech
              insights. Our blog offers expert articles, industry news, and
              valuable tips to help you learn and grow in your career.
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <img
                  alt={post.alt}
                  src={post.imageUrl}
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={post.datetime} className="mr-8">
                    {post.date}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg
                      viewBox="0 0 2 2"
                      className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                    >
                      <circle r={1} cx={1} cy={1} />
                    </svg>
                    <div className="flex gap-x-2.5">
                      <img
                        alt={post.alt}
                        src={post.author.imageUrl}
                        className="h-6 w-6 flex-none rounded-full bg-white/10"
                      />
                      {post.author.name}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <a href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OurMission;
