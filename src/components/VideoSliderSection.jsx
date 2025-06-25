import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import Slider from 'react-slick';
import Modal from 'react-modal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const videos = [
  { id: 1, thumbnail: "https://img.youtube.com/vi/zNBREw-llPc/maxresdefault.jpg", url: "https://www.youtube.com/embed/zNBREw-llPc" },
  { id: 2, thumbnail: "https://img.youtube.com/vi/YmL_n61Ko2Q/maxresdefault.jpg", url: "https://www.youtube.com/embed/YmL_n61Ko2Q" },
  { id: 3, thumbnail: "https://img.youtube.com/vi/Dc3zWtLfkHg/maxresdefault.jpg", url: "https://www.youtube.com/embed/Dc3zWtLfkHg" }
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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <>
      <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Watch How It Works</h2>
        <div className="mx-auto">
          <Slider {...sliderSettings}>
            {videos.map((video) => (
              <div key={video.id} className="px-4">
                <div className="relative cursor-pointer">
                  <img
                    src={video.thumbnail}
                    alt="Video Thumbnail"
                    className="w-full object-cover rounded-xl"
                    onClick={() => openModal(video.url)}
                  />
                  <div className="absolute inset-0 h-full w-full bg-black bg-opacity-40 flex items-center justify-center rounded-xl">
                    <PlayCircle className="text-white w-16 h-16" onClick={() => openModal(video.url)} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Modal with YouTube iframe */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="bg-black bg-opacity-80 fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="Overlay"
          ariaHideApp={false}
        >
          <div className="bg-white rounded-lg w-[90%] max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >✕</button>
            {activeVideo && (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-md"
                  src={`${activeVideo}?autoplay=1`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </Modal>
      </section>
    </>
  );
}

export default VideoSlider;
