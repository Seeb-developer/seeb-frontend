import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Skeleton } from "antd";
import { GiSofa } from "react-icons/gi";
import { Pagination, Autoplay } from "swiper/modules";

const MainPageCarousal = ({ MainBanners, SkeletonLoad }) => {
  const skeletonArray = Array.from({ length: 1 }, (_, index) => index);

  return (
    <div className="flex md:flex lg:flex xl:flex gap-3 px-3 md:px-20 lg:px-20 xl:px-10">
      <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {SkeletonLoad ? (
            <div className="mt-5">
              {skeletonArray.map((index) => (
                <div key={index}>
                  <Skeleton.Node
                    active={true}
                    style={{ height: "50vh", width: "100vw" }}
                  >
                    {/* <img src="/logo_name.png" alt="Logo" className="h-16 " /> */}
                  </Skeleton.Node>
                </div>
              ))}
            </div>
          ) : (
            MainBanners.map((el, i) => {
              if (el.device === "2") {
                return (
                  <SwiperSlide key={i}>
                    <img 
                      className="rounded-xl"
                      src={import.meta.env.VITE_BASE_URL + el.path}
                      alt=""
                    />
                  </SwiperSlide>
                );
              } else {
                return null;
              }
            })
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default MainPageCarousal;
