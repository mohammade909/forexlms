import React from 'react'
import { Link } from 'react-router-dom'

const Feature = () => {
  return (
   <>
<section className="pt-20 lg:pt-[120px] pb-12 lg:pb-[90px]">
  <div className="container mx-auto">
    <div className="flex flex-wrap -mx-4">
      <div className="w-full px-4">
        <div className="text-center mx-auto mb-12 lg:mb-20 max-w-[510px]">
          <span className="font-semibold text-lg text-primary mb-2 block">
          Our IT Services
          </span>
          <h1 className="
            font-bold
            text-3xl
            sm:text-4xl
            md:text-[40px]
            text-dark
            mb-4
            ">
            What We Offer
          </h1>
          <p className="text-base text-body-color">
          Helping the next generation of tech experts gain the latest skills and knowledge.
          </p>
        </div>
      </div>
    </div>
<div className="flex flex-col md:grid md:grid-cols-4 gap-3">
  <div className="relative rounded overflow-hidden">
    <Link to="/ItCourse/FullStack">
    <img src="/full.jpg" alt="Hanging Planters" className="w-full h-52	" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Full Stack Development
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
    <Link to="/ItCourse/WebDesgin">
    <img src="/web1.jpg" alt="Planter Stand with Pots" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Web Designing
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/UiUx">
    <img src="/ui.jpg" alt="Watering Cans" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      UI/UX
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/DigitalMarketing">
    <img src="/digital.jpg" alt="Metal Planters" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Digital Marketing
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/DataScience">
    <img src="/data.jpg" alt="Table Top Planters" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Data Science
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/MachineLearning">
    <img src="/ml.webp" alt="Wall Mounted Stands" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
     Machine Learning
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/DeepLearning">
    <img src="/deep.jpg" alt="Jute Plant Pots" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Deep Learning
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/MobileApplication">
    <img src="/Android.jpg" alt="Bird Feeders" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      Android Development
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/Graphic">
    <img src="/grapic.jpg" alt="Hanging Birds" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover-bg-opacity-60 transition">
    Graphic Designing
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/ArtificialIntelligence">
    <img src="/ai.jpg" alt="Garden Sticks" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover:bg-opacity-60 transition">
      AI
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
  <Link to="/ItCourse/Python">
    <img src="/Python.gif" alt="Garden Tray Miniatures" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover-bg-opacity-60 transition">
     Python
    </p>
    </Link>
  </div>
  <div className="relative rounded overflow-hidden">
    <Link to='/ItCourse/EthicalHacker'>
    <img src="/eth.jpg" alt="Garden Tool Set" className="w-full h-52" />
    <p className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-2xl text-center text-white font-roboto font-medium group-hover-bg-opacity-60 transition">
    Security
    </p>
    </Link>
  </div>
</div>

  </div>
</section>


   </>
  )
}

export default Feature
