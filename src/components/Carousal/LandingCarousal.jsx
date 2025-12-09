import React, { useState, useEffect } from "react";
// import MobileCarousal from "./MobileCarousal";
// import Carousal from "./Carousal";
import MainPageCarousal from "./MainPageCarousal";
import MainPageMobileCarousal from "./MainPageMobileCarousal";

const CarousalCardData = { img: "/images/banner/5.jpg", label: "Double Bed" };

const carousalData = [
  {
    img: "/1.png",
  },
  {
    img: "/2.png",
  },
  {
    img: "/8.png",
  },
];

const LandingCarousal = () => {
  const [SkeletonLoad, setSkeletonLoad] = useState(true);
  const [Banners, setBanners] = useState([]);
  const getBanners = async () => {
    setSkeletonLoad(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      import.meta.env.VITE_BASE_URL + "banner/getMainBanner",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        if (result.status === 200) {
          setBanners(result.data);
          setSkeletonLoad(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <div>
      <div className="px-14 py-8 hidden md:hidden lg:block xl:block h-[40%]">
        <MainPageCarousal MainBanners={Banners} SkeletonLoad={SkeletonLoad} />
      </div>
      <div className="block md:block lg:hidden xl:hidden">
        <MainPageMobileCarousal MainBanners={Banners} SkeletonLoad={SkeletonLoad} />
      </div>
    </div>
  );
};

export default LandingCarousal;
