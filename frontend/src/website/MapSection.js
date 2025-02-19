import React from 'react'

const MapSection = () => {
  return (
    <>
     <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div
            className="relative h-0 overflow-hidden mb-6"
            style={{ paddingBottom: "56.25%" }}
          >
             <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13824.541214142571!2d76.8669356!3d29.9755413!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e4745c7dce859%3A0xe9b68300f2752331!2sCybersolvings!5e0!3m2!1sen!2sin!4v1720683407573!5m2!1sen!2sin"  style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className='w-full h-[1000px]' />
          </div>
        </div>
      </section>
    
    </>
  )
}

export default MapSection