import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

// Import videos
import vid1 from "../assets/v2.webm";
import vid2 from "../assets/v4.webm";
import vid3 from "../assets/v5.webm";

// Texts for each slide
const slideTexts = [
  "Discover the world of herbs at herbal garden",
  "Experience the healing power of nature",
  "Explore rare medicinal plants and their benefits"
];

const VideoSlider = () => {
  const videos = [vid1, vid2, vid3];

  return (
    <div className="w-full px-4 md:px-10 pt-[5px] pb-4.5 md:pb-7.5 mt-4">
      <div className="overflow-hidden rounded-2xl shadow-lg relative h-[28vh] sm:h-[35vh] md:h-[45vh] lg:h-[50vh]">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {videos.map((video, index) => (
            <SwiperSlide key={index} className="relative flex justify-center items-center">
              
              {/* Video */}
              <video 
                src={video} 
                className="w-full h-full object-cover rounded-2xl"
                autoPlay 
                muted 
                loop
                preload="none"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white px-4 md:px-10 text-center">
                <h2 className="text-lg sm:text-xl md:text-3xl font-semibold italic">
                  {slideTexts[index]}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default VideoSlider;
