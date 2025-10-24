import React, { useEffect, useRef, useState } from 'react';

const heroData = [
    {
        title: "🎉 10% Offer Just for You!",
        desc: "Start learning today and save 10% on any course you choose—limited time only!",
        img: "https://i.ibb.co/kVPnVQcr/10.png",
    },
    {
        title: "🔥 20% Offer for You!",
        desc: "Boost your skills with 20% off—now's the perfect time to invest in yourself.",
        img: "https://i.ibb.co/DDY5Zkjk/20.png",
    },

    {
        title: "🎯 40% Discount on All Courses!",
        desc: "Don't miss this chance—get certified and save big with 40% off!",
        img: "https://i.ibb.co/BK5QVt31/40.png",
    },
    {
        title: "💡 Grab 50% Off Your Favorite Course!",
        desc: "Level up your career at half the price—quality education made affordable.",
        img: "https://i.ibb.co/jZ6XZqrq/50.png",
    },
    {
        title: "🚀 60% Off – Learn More, Pay Less!",
        desc: "This is your sign to start now—get premium learning at just 40% of the cost!",
        img: "https://i.ibb.co/nM28gHwf/60.png",
    },
    {
        title: "💥 Get 70% Off – Limited Period Offer!",
        desc: "Unlock massive savings and expert knowledge—offer valid till stocks last!",
        img: "https://i.ibb.co/Ngz8HXd2/70.png",
    },
    {
        title: "🎁 Flat 80% Off on Select Courses!",
        desc: "Upgrade your future at an unbeatable price—enroll now before it ends!",
        img: "https://i.ibb.co/sJpNvgBx/80.jpg",
    },
    {
        title: "🌟 Unbelievable 90% Off – Today Only!",
        desc: "Get ahead for almost nothing—this once-in-a-lifetime offer won't last long!",
        img: "https://i.ibb.co/V042ZHYs/90.png",
    },
];



const HeroBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const updateCarousel = (newIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);
        const nextIndex = (newIndex + heroData.length) % heroData.length;
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
        <div className=" flex flex-col items-center justify-center rounded-4xl container mx-auto overflow-hidden relative py-6">

            <div
                className="relative w-[80%] max-w-[1200px] h-[400px] perspective-[1000px] mt-0"
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
                    {heroData.map((item, index) => {
                        const offset = (index - currentIndex + heroData.length) % heroData.length;
                        let style = "absolute w-[280px] h-[380px] bg-base-300 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";
                        let transformClass = "";
                        let extraClasses = "";

                        if (offset === 0) {
                            transformClass = "z-10 scale-[1.1] translate-z-0";
                        } else if (offset === 1) {
                            transformClass = "z-5 translate-x-[200px] scale-[0.9] -translate-z-[100px] opacity-90";
                            extraClasses = "grayscale";
                        } else if (offset === 2) {
                            transformClass = "z-1 translate-x-[400px] scale-[0.8] -translate-z-[300px] opacity-70";
                            extraClasses = "grayscale";
                        } else if (offset === heroData.length - 1) {
                            transformClass = "z-5 -translate-x-[200px] scale-[0.9] -translate-z-[100px] opacity-90";
                            extraClasses = "grayscale";
                        } else if (offset === heroData.length - 2) {
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
                                <img src={item.img} alt={item.title} className={`w-full h-full object-cover transition-all duration-[800ms] ${extraClasses}`} />
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
                <h2 className="text-blue-500 text-3xl md:text-4xl font-bold mb-5">
                    {heroData[currentIndex].title}
                </h2>
                <p className=" text-xl md:text-2xl mt-[-10px]">
                    {heroData[currentIndex].desc}
                </p>
            </div>

            <div className="flex justify-center gap-3 mt-5">
                {heroData.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-[rgba(8,42,123,0.2)]'}`}
                        onClick={() => updateCarousel(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
