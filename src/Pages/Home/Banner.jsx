import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const slides = [
  {
    title: "Course Management System",
    subtitle: "Browse, enroll, and manage your courses with ease",
    image: "https://i.ibb.co/kzmbY7P/30-parcent.jpg",
  },
  {
    title: "Interactive Learning Experience",
    subtitle: "Engage with content through modern tools and UI",
    image: "https://i.ibb.co/1f9rhrYX/gsgs.jpg",
  },
  {
    title: "Your Courses in One Place",
    subtitle: "Organized access to all enrolled programs",
    image: "https://i.ibb.co/B5VtZJ3S/Screenshot-1.jpg",
  },
  {
    title: "Learn From Industry Experts",
    subtitle: "Get guidance and feedback from top instructors",
    image: "https://i.ibb.co/84GbcHLq/sdfs.jpg",
  },
];

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-cyan-500 bg-base-300 p-2 md:p-3 rounded-full shadow hover:bg-cyan-200"
    style={{ width: "36px", height: "36px" }}
  >
    <FaArrowRight size={18} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-cyan-500 bg-base-300 p-2 md:p-3 rounded-full shadow hover:bg-cyan-200"
    style={{ width: "36px", height: "36px" }}
  >
    <FaArrowLeft size={18} />
  </div>
);

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="
              w-full 
              h-[600px] md:h-[500px] lg:h-[600px] 
              flex flex-col
            "
          >
            {/* Image Section */}
            <div className="w-full h-[580px] md:h-[75%] lg:h-[80%]">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="
                  w-full 
                  h-[580px] md:h-full 
                  object-cover 
                  rounded-tl-xl rounded-tr-xl
                "
              />
            </div>

            {/* Text Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="
                w-full 
                h-[auto] md:h-[25%] lg:h-[20%] 
                bg-blue-100 text-center 
                flex flex-col items-center justify-center 
                px-4 md:px-8 py-4 md:py-6
              "
            >
              <h2
                className="
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                  font-extrabold text-cyan-600 
                  drop-shadow-md tracking-wide mb-2
                "
              >
                {slide.title}
              </h2>
              <p
                className="
                  text-sm sm:text-base md:text-lg lg:text-xl 
                  text-base-300 font-medium max-w-xl mb-4 md:mb-5 
                  px-2
                "
              >
                {slide.subtitle}
              </p>
            </motion.div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
