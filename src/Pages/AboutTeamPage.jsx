import React, { useEffect, useRef, useState } from 'react';

const teamMembers = [
    { name: "Emily Kim", role: "Founder", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=3687&auto=format&fit=crop" },
    { name: "Michael Steward", role: "Creative Director", img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=3870&auto=format&fit=crop" },
    { name: "Emma Rodriguez", role: "Lead Developer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=60" },
    { name: "Julia Gimmel", role: "UX Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60" },
    { name: "Lisa Anderson", role: "Marketing Manager", img: "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=900&auto=format&fit=crop&q=60" },
    { name: "James Wilson", role: "Product Manager", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=3687&auto=format&fit=crop" },
];

const AboutTeamPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const updateCarousel = (newIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);
        const nextIndex = (newIndex + teamMembers.length) % teamMembers.length;
        setCurrentIndex(nextIndex);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const handleSwipe = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            updateCarousel(currentIndex + (diff > 0 ? 1 : -1));
        }
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') updateCarousel(currentIndex - 1);
            if (e.key === 'ArrowRight') updateCarousel(currentIndex + 1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentIndex]);

    return (
        <div className=" flex flex-col items-center justify-center overflow-hidden relative py-10">


            <h1 className="text-[4rem] text-green-400 md:text-[7.5rem] absolute top-[1024px] left-1/2 -translate-x-1/2 ">
                OUR TEAM
            </h1>

            <div className="relative text-center my-10">
                <div className="text-4xl text-blue-600 dark:text-blue-400 font-bold relative inline-block">
                    <div className="text-2xl mb-1 animate-bounce">↑</div>
                    <h1 className="uppercase tracking-widest border-t-2 border-blue-400 pt-3">
                        Upper Line Hidden Text
                    </h1>
                </div>
            </div>


            <div
                className="relative w-[80%] max-w-[1200px] h-[450px] perspective-[1000px] mt-0"
                onTouchStart={(e) => (touchStartX.current = e.changedTouches[0].screenX)}
                onTouchEnd={(e) => {
                    touchEndX.current = e.changedTouches[0].screenX;
                    handleSwipe();
                }}
            >
                <button
                    className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-xl z-20 transition-transform duration-300 hover:scale-110"
                    onClick={() => updateCarousel(currentIndex - 1)}
                >
                    ‹
                </button>

                <div className="relative w-full h-full flex justify-center items-center transform-style-3d transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">

                    {teamMembers.map((member, index) => {
                        const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
                        let style = "absolute w-[280px] h-[380px] bg-base-300 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

                        let transformClass = "";
                        let extraClasses = "";

                        if (offset === 0) {
                            transformClass = "z-10 scale-[1.1] translate-z-0";
                            extraClasses = "";
                        } else if (offset === 1) {
                            transformClass = "z-5 translate-x-[200px] scale-[0.9] -translate-z-[100px] opacity-90";
                            extraClasses = "grayscale";
                        } else if (offset === 2) {
                            transformClass = "z-1 translate-x-[400px] scale-[0.8] -translate-z-[300px] opacity-70";
                            extraClasses = "grayscale";
                        } else if (offset === teamMembers.length - 1) {
                            transformClass = "z-5 -translate-x-[200px] scale-[0.9] -translate-z-[100px] opacity-90";
                            extraClasses = "grayscale";
                        } else if (offset === teamMembers.length - 2) {
                            transformClass = "z-1 -translate-x-[400px] scale-[0.8] -translate-z-[300px] opacity-70";
                            extraClasses = "grayscale";
                        } else {
                            transformClass = "opacity-0 pointer-events-none";
                        }

                        return (
                            <div
                                key={index}
                                className={`${style} ${transformClass}`}
                                onClick={() => updateCarousel(index)}
                            >
                                <img src={member.img} alt={member.name} className={`w-full h-full object-cover transition-all duration-[800ms] ${extraClasses}`} />
                            </div>
                        );
                    })}
                </div>

                <button
                    className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-[rgba(8,42,123,0.6)] hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-xl z-20 transition-transform duration-300 hover:scale-110"
                    onClick={() => updateCarousel(currentIndex + 1)}
                >
                    ›
                </button>
            </div>

            <div className="text-center mt-10 transition-all duration-500">
                <h2 className="text-blue-500 text-3xl md:text-4xl font-bold relative inline-block mb-2">
                    {teamMembers[currentIndex].name}
                    <span className="absolute w-[100px] h-[2px] bg-blue-500 top-full -left-[120px] hidden md:block" />
                    <span className="absolute w-[100px] h-[2px] bg-blue-500 top-full -right-[120px] hidden md:block" />
                </h2>
                <p className=" text-xl md:text-2xl uppercase tracking-widest mt-[-10px]">
                    {teamMembers[currentIndex].role}
                </p>
            </div>

            <div className="flex justify-center gap-3 mt-10">
                {teamMembers.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-blue-900 scale-125' : 'bg-[rgba(8,42,123,0.2)]'
                            }`}
                        onClick={() => updateCarousel(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AboutTeamPage;
