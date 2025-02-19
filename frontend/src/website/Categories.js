import Category from "./Category";
import React,{useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Import Swiper styles for autoplay
import { FreeMode, Pagination, Autoplay } from "swiper/modules"; // Import the Autoplay module
import {useDispatch, useSelector} from 'react-redux'
import {getCourses} from '../actions/course'
const products = [
  {
    id: 1,
    img: "https://svitla.com/uploads_converted/0/1768-web_design.webp?1554368507",
    name: "Web Design",
    desc: "Learn to create attractive and functional websites using HTML and CSS. Master techniques for making websites look good on different devices.",
  },
  {
    id: 2,
    img: "https://static.vecteezy.com/system/resources/previews/001/268/226/non_2x/graphic-designer-s-workspace-free-photo.jpg",
    name: "Graphic Design",
    desc: "Develop skills in digital drawing, fonts, and visual communication. Become good at using Adobe Creative Suite.",
  },
  {
    id: 3,
    img: "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg",
    name: "UI/UX Design",
    desc: " Design easy-to-use screens and improve user experiences. Use design principles that focus on users and learn tools for making prototypes.",
  },
  {
    id: 4,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwoyqNgInjwhh4kvpVv699esg6-HO2P6u9jg&s",
    name: "Digital Marketing",
    desc: "Make detailed digital marketing plans for different platforms. Become skilled in SEO, social media, writing, and data.",
  },
  {
    id: 5,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMtM2-EyRjFcpAuCQ_K7I0-ZadCznWJUpXTg&s",
    name: "FullStack Development",
    desc: "Learn both front-end and back-end technologies for making complete web apps. Get good at databases, server programming, and apps for users.",
  },
  {
    id: 6,
    img: "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/293996141/original/98104d97def38192b15c43b99d8b5ef48fe4931b/do-any-work-in-python.jpg",
    name: "Python",
    desc: "Learn more about Python with hard programming ideas and ways. Also learn about data shapes, problems, and making hard apps.",
  },
  {
    id: 7,
    img: "https://imageio.forbes.com/specials-images/dam/imageserve/966248982/960x0.jpg?height=456&width=711&fit=bounds",
    name: "Machine Learning",
    desc: "Use computer learning to understand and explain data. Make models and decide on smart actions.",
  },
  {
    id: 8,
    img: "https://d3lkc3n5th01x7.cloudfront.net/wp-content/uploads/2023/06/16031110/Deep-learning.png",
    name: "Deep Learning",
    desc: "Learn about smart machines and hard AI for problems. Use deep learning for looking and talking with machines.",
  },
  {
    id: 9,
    img: "https://media.istockphoto.com/id/1452604857/photo/businessman-touching-the-brain-working-of-artificial-intelligence-automation-predictive.jpg?s=612x612&w=0&k=20&c=GkAOxzduJbUKpS2-LX_l6jSKtyhdKlnPMo2ito4xpR4=",
    name: "AI",
    desc: "Explore new AI technology and how to use it. Make systems that think, learn, and solve problems.",
  },
  {
    id: 10,
    img: "https://www.simplilearn.com/ice9/free_resources_article_thumb/how_to_become_a_data_scientist.jpg",
    name: "Data Science",
    desc: " Learn how to learn new things from big and hard data. Get good at numbers, pictures, and making models.",
  },
  {
    id: 11,
    img: "https://www.techopedia.com/wp-content/uploads/2023/02/dreamstime_m_123641233-1.jpg",
    name: "Certified Ethical Hacker Certification",
    desc: " Learn about problems in a computer and how to fix them. Get ready for CEH tests with real hacking ways.",
  },
  {
    id: 12,
    img: "https://www.bridgingminds.net/wp-content/uploads/2022/12/the-important-skills-needed-for-professional-ethical-hackers.jpg.jpg",
    name: "Mobile Application Development",
    desc: " Learn to create apps for smartphones and tablets. Master the skills for developing, testing, and launching mobile apps using both Android and iOS platforms.",
  },
];

const Categories = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  useEffect(() => {
    dispatch(getCourses());
  }, []);

  return (
    <section className="flex flex-col justify-center max-w-6xl min-h-screen px-4 py-6 mx-auto sm:px-6">
      <div className="flex flex-wrap items-center justify-center mb-8">
        <div>
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="bg-white px-3 text-base font-semibold leading-6 text-blue-600">
                {" "}
                TOP POPULAR COURSE
              </span>
            </div>
          </div>
          <h2 className=" text-2xl font-bold leading-none md:text-3xl">
          Study Courses You Can Join With Us
          </h2>
        </div>
      </div>

      <div className="w-full flex">
        <Swiper
          slidesPerView={2}
          freeMode={true}
          autoplay={{
            delay: 2500, // Time between slides in milliseconds
            disableOnInteraction: false, // Autoplay will not be disabled after user interactions
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            100: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
          }}
          modules={[FreeMode, Pagination, Autoplay]} // Add Autoplay to the modules array
          className="mySwiper m-auto border-black"
        >
          {courses?.map((item, index) => (
            <SwiperSlide key={index}>
              <Category course={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Categories;
