import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogContactFormModal from "../components/BlogContactFormModal";

export default function BlogDetail() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}blog/single-blog/${blogId}`)
      .then((res) => {
        if (res.data.status === 200) {
          setBlog(res.data.data);
          // console.log("Blog Detail Response:", res.data.data);

        }
      })
      .catch((err) => console.error("Error loading blog:", err))
      .finally(() => setLoading(false));
  }, [blogId]);

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="text-center py-10 text-lg font-semibold text-red-600">Blog not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 bg-white">
      {/* Blog Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Published on {new Date(blog.created_at).toLocaleDateString()}
      </p>

      {blog.blog_image && (
        <img
          src={`${import.meta.env.VITE_BASE_URL}/${blog.blog_image}`}
          alt={blog.title}
          className="w-full max-h-[400px] object-cover rounded-xl mb-6"
        />
      )}

      {/* Blog Description */}
      <div className="blog-content text-gray-800 leading-relaxed whitespace-pre-line mb-10 text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: blog.description }}>
        {/* {blog.description} */}
      </div>

      {/* Sections */}
      {blog.blog_sections?.map((section) => (
        <div key={section.id} className="mb-12">

          {/* CTA Section */}
          {section.cta_text ? (
            <div
              className=" flex items-center w-full rounded-xl overflow-hidden mt-10 mb-4 cursor-pointer hover:shadow-xl transition duration-300"
              style={{
                backgroundImage: `url(${import.meta.env.VITE_BASE_URL}/${section.banner_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px"
              }}
              onClick={() => setShowModal(true)}
            >
              {/* <div className=" p-8 sm:p-12 text-white">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-2">{section.title}</h3>
                <p className="blog-content mb-4 text-base sm:text-lg">
                  {section.description}
                </p>
                <button className="bg-red-500 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 transition"
                  onClick={() => setShowModal(true)}>
                  {section.cta_text || "Get in Touch"}
                </button>

              </div> */}
              <BlogContactFormModal isOpen={showModal} onClose={() => setShowModal(false)} />

            </div>
          ) : (<>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">{section.title}</h2>

            {section.banner_image && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${section.banner_image}`}
                alt={section.title}
                className="w-full max-h-[450px] object-cover rounded-lg mb-6"
              />
            )}

            <div className="blog-content text-gray-700 whitespace-pre-line mb-4 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: section.description }}>
              {/* {section.description} */}
            </div>

            {/* Sub-sections */}
            {section.sub_sections &&
              JSON.parse(section.sub_sections).map((sub, index) => (
                <div key={index} className="mb-6 ml-2 sm:ml-4 border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-medium mb-2">{sub.title}</h3>
                  <p className="blog-content text-gray-700 whitespace-pre-line text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: sub.description }}>
                    {/* {sub.description} */}
                    </p>
                  {sub.images && (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/${sub.images}`}
                      alt={sub.title}
                      className="w-full max-h-[400px] object-cover rounded-lg mt-3"
                    />
                  )}
                </div>
              ))}
          </>)}
        </div>
      ))}
    </div>
  );
}
