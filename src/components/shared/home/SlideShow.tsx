import React, { useState, useEffect } from "react";
import { useSlideImage } from "../../../lib/queries";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TSlide = {
  id: string;
  title: string;
  title_kh: string;
  title_ch: string;
  image: string;
};

const SlideShow: React.FC = () => {
  const { data: slides, isLoading: isLoadingSlide } = useSlideImage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideData = slides?.data || [];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slideData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slideData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slideData.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slideData.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideData.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (isLoadingSlide) {
    return (
      <section className="mt-4 sm:mt-6 px-2 sm:px-4">
        <div className="relative w-full max-w-7xl mx-auto h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] bg-slate-800/40 rounded-2xl sm:rounded-3xl animate-pulse border border-slate-600/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[#DAA520] text-base sm:text-lg">
              Loading slides...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!slideData || slideData.length === 0) {
    return (
      <section className="mt-4 sm:mt-6 px-2 sm:px-4">
        <div className="relative w-full max-w-7xl mx-auto h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] bg-slate-800/40 rounded-2xl sm:rounded-3xl border border-slate-600/30 flex items-center justify-center">
          <p className="text-gray-400 text-sm sm:text-base">
            No slides available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4 sm:mt-6 px-2 sm:px-4 py-4 sm:py-8" data-aos="fade-up">
      <div
        className="relative w-full max-w-7xl mx-auto group"
        role="region"
        aria-label="Promotional slideshow"
      >
        <div className="relative w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[420px] lg:h-[520px] xl:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-600/40 shadow-xl sm:shadow-2xl bg-slate-900/70">
          {slideData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
              aria-hidden={index !== currentIndex}
            >
              <img
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
                {/* 
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" /> 
              */}

            </div>
          ))}

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-[#DAA520]/80 text-white p-2 sm:p-3 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-900/70 hover:bg-[#DAA520]/80 text-white p-2 sm:p-3 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>

          {/* Gold accent corners */}
          <div className="hidden sm:block absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#DAA520]/50 rounded-tl-2xl" />
          <div className="hidden sm:block absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#DAA520]/50 rounded-tr-2xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#DAA520]/50 rounded-bl-2xl" />
          <div className="hidden sm:block absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#DAA520]/50 rounded-br-2xl" />
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
          {slideData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 sm:w-12 h-2.5 sm:h-3 bg-[#DAA520] shadow-[0_0_10px_rgba(218,165,32,0.6)]"
                  : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-500 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>

        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-slate-900/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white border border-[#DAA520]/30 text-xs sm:text-sm">
          <span className="font-semibold text-[#DAA520]">
            {currentIndex + 1}
          </span>
          <span className="text-gray-300"> / {slideData.length}</span>
        </div>
      </div>
    </section>
  );
};

export default SlideShow;
