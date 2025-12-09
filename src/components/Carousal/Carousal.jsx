import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Skeleton } from "antd";
import { GiSofa } from "react-icons/gi";
import { Pagination } from "swiper/modules";

const Carousal = ({ SubCategoryBanners, SwiperClassName, SkeletonLoad }) => {
  const skeletonArray = Array.from({ length: 1 }, (_, index) => index);
  return (
    <div className={`${SwiperClassName} w-full`}>
      <Swiper
        pagination={true}
        loop={true}
        modules={[Pagination]}
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
                  <GiSofa style={{ fontSize: 300, color: "#bfbfbf" }} />
                </Skeleton.Node>
              </div>
            ))}
          </div>
        ) : (
          SubCategoryBanners.map((el, i) => {
            if (el.device === "1") {
              return (
                <SwiperSlide key={i}>
                  <div>
                    <div className="">
                      <img
                        src={
                          import.meta.env.VITE_BASE_URL + el.path
                        }
                        alt="Image is not available"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                  {/* <img
                src={import.meta.env.VITE_BASE_URL + el.path}
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
  );
};

export default Carousal;
