import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}blog/get-all`)
      .then(res => {
        if (res.data.status === 200) {
          setBlogs(res.data.data);
        }
      })
      .catch(err => console.error("Failed to fetch blogs", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading blogs...</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="sm:text-5xl text-3xl font-bold mb-8 text-center">Latest Blogs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.id}`}
            className="block bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
          >
            <img
              src={`${import.meta.env.VITE_BASE_URL}/${blog.blog_image}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-4">
                {blog.description}
              </p>
              <p
                className="inline-block mt-4 text-blue-600 font-medium "
              >
                Read More →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
