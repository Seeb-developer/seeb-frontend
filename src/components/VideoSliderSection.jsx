import React, { useState } from 'react';
import {PlayCircle } from 'lucide-react';
import Slider from 'react-slick';
import Modal from 'react-modal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const videos = [
  { id: 1, thumbnail: "/interior-bg.jpeg", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: 2, thumbnail: "/interior-bg.jpeg", url: "https://www.w3schools.com/html/movie.mp4" },
  { id: 3, thumbnail: "/interior-bg.jpeg", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
];

export function VideoSlider() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const openModal = (videoUrl) => {
    setActiveVideo(videoUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setActiveVideo(null);
    setModalIsOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // default for desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // desktop
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // mobile
          slidesToScroll: 1,
        }
      }
    ]
  };
  

  return (
    <>
      {/* Video Carousel */}
      <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Watch How It Works</h2>
        <div className=" mx-auto">
          <Slider {...sliderSettings}>
            {videos.map((video) => (
              <div key={video.id} className="px-4">
                <div className="relative cursor-pointer">
                  <img
                    src={video.thumbnail}
                    alt="Video Thumbnail"
                    className="w-full h-64 object-cover rounded-xl"
                    onClick={() => openModal(video.url)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl">
                    <PlayCircle className="text-white w-16 h-16" onClick={() => openModal(video.url)} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Video Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="bg-black bg-opacity-80 fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="bg-white p-4 rounded-lg w-[90%] max-w-3xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >✕</button>
            {activeVideo && (
              <video controls autoPlay className="w-full rounded-md">
                <source src={activeVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </Modal>
      </section>
    </>
  );
}

export default VideoSlider;
