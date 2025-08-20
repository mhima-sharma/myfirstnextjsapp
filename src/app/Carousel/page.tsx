"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Carousel() {
  const images = [
    "/img1.png",
    "/img2.png",
    "/img6.png",
    "/img5.png",
    "/img4.png",
    "/img3.png",
    "/img7.png",
    "/img8.png",
  ];

  return (
    <div className="w-full flex justify-center items-center bg-black py-10">
      <div className="w-[80%]">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="mySwiper"
        >
          {images.map((src, index) => (
            <SwiperSlide
              key={index}
              className="w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
