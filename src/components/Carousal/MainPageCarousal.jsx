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
    <div>
      <div>
        <Swiper
          pagination={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
          height={400}
        >
          {SkeletonLoad ? (
            <div className="mt-5">
              {skeletonArray.map((index) => (
                <div key={index}>
                  <Skeleton.Node
                    active={true}
                    style={{ height: "50vh", width: "100vw" }}
                  >
                    <div className="flex justify-center">
                      {/* <img src="/logo_name.png" alt="Logo" className="h-16 " /> */}
                    </div>
                  </Skeleton.Node>
                </div>
              ))}
            </div>
          ) : (
            MainBanners.map((el, i) => {
              if (el.device === "1") {
                return (
                  <SwiperSlide key={i}>
                    <div>
                      <div className="relative">
                        <img
                          src={
                            import.meta.env.VITE_BASE_URL + el.path
                          }
                          alt="Image is not available"
                          className="w-full h-auto object-contain bg-red-100 rounded-none xl:rounded-xl"
                        />
                        {/* <button className="bg-[#000] text-white font-normal text-2xl tracking-wide p-3 px-9 rounded-full absolute bottom-[60px] left-[88.5px]">Order Now</button> */}
                      </div>
                    </div>
                    {/* <img
            src={process.env.REACT_APP_HAPS_MEDIA_BASE_URL + el.path}
            alt="" 
            className="object-cover"
          /> */}
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
