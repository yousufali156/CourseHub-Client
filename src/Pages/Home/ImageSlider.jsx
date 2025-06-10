import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Default slides to use if none are provided
const defaultSlides = [
     {
        bg: 'https://source.unsplash.com/featured/?technology',
        title: 'Explore the Future',
        subtitle: 'Dive into the latest in tech and innovation.',
    },
    {
        bg: 'https://source.unsplash.com/featured/?coding',
        title: 'Learn to Code',
        subtitle: 'Master development skills with expert-led courses.',
    },
    {
        bg: 'https://source.unsplash.com/featured/?design',
        title: 'Design Your Vision',
        subtitle: 'Bring your ideas to life with creative tools.',
    },
];

const ImageSlider = ({ slides = defaultSlides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const goToPrevious = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    useEffect(() => {
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [goToNext]);

    return (
        <div className="relative container mx-auto h-96 rounded-lg overflow-hidden shadow-xl">
            
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={slide.bg}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-600 to-pink-500 bg-opacity-70 flex items-center justify-center text-center p-6">
                        <div className="relative z-10 text-white">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg"
                            >
                                {slide.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md"
                            >
                                {slide.subtitle}
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={index === currentSlide ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mt-8 bg-yellow-400 text-blue-800 hover:bg-yellow-300 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition duration-300"
                            >
                                Explore Courses
                            </motion.button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-blue-600 p-2 rounded-full hover:bg-opacity-90 transition-all duration-300 z-20"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 text-blue-600 p-2 rounded-full hover:bg-opacity-90 transition-all duration-300 z-20"
            >
                <ChevronRight size={32} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === idx ? 'bg-white' : 'bg-gray-400 bg-opacity-70'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
