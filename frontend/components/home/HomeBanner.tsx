"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";

// ================= SKELETON =================

const BannerSkeleton = () => (
  <div className="bannerSkeleton shimmer" />
);

// ================= ITEM =================

const BannerItem = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="bannerImgWrapper">
      {!loaded && !error && <BannerSkeleton />}

      {error ? (
        <div className="bannerError">
          تعذر تحميل الصورة
        </div>
      ) : (
        <img
          src={src}
          alt="جوهرة العرب - عروضنا ومنتجاتنا"
          loading="eager"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`bannerImg ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

// ================= SWIPER =================

const SwiperComponent = dynamic(
  () =>
    Promise.all([
      import("swiper/react"),
      import("swiper/modules"),
    ]).then(([{ Swiper, SwiperSlide }, { Autoplay, Pagination, Navigation }]) => {
      return function SwiperWrapper({ images }: { images: string[] }) {
        return (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={0}
            centeredSlides={false}
            loop={images.length > 1}
            loopAdditionalSlides={1}
            speed={800}
            watchOverflow
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="homeSwiper"
          >
            {images.map((img) => (
              <SwiperSlide key={img}>
                <BannerItem src={img} />
              </SwiperSlide>
            ))}
          </Swiper>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="bannerImgWrapper">
        <BannerSkeleton />
      </div>
    ),
  }
);

// ================= MAIN =================

const HomeBanner: React.FC = () => {
  const bannerImages = [
    "/imgs/slider1.jpg",
    "/imgs/slider2.jpg",
    "/imgs/slider3.jpg",
  ];

  return (
    <section className="my-3 w-full px-3 sm:my-5 sm:px-6 md:my-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl">
        <SwiperComponent images={bannerImages} />
      </div>
    </section>
  );
};

export default HomeBanner;