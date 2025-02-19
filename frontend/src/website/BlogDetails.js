import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBlogById } from "../redux/blogSlice";
// import he from "he";
import { StarIcon } from "@heroicons/react/20/solid";
// import DOMPurify from "dompurify";
const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog } = useSelector((state) => state.blogs);
  // const sanitizedContent =DOMPurify.sanitize(he.decode(blog.content));
  useEffect(() => {
    dispatch(getBlogById(id));
  }, [dispatch, id]);

  if (!blog) return <div>Loading...</div>;

  const reviews = {
    average: 4,
    featured: [
      {
        id: 1,
        rating: 5,
        content: `
          <p>${blog.content}</p>
        `,
        date: new Date(blog.created_at).toLocaleDateString(),
        datetime: blog.created_at,
        author: "Anonymous", // Update with actual author if available
        avatarSrc: "https://example.com/avatar.jpg", // Use a relevant image URL
      },
      // Add more reviews if necessary
    ],
  };

  return (
    <>
      <div className="bg-white py-5 sm:py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Blog Details
            </h1>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Blog Image */}
          <div
            className="h-96 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(/blogs/${blog.blog_image})`,
            }}
          ></div>

          {/* Blog Content */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="mr-4">By: {blog.author_id || "Anonymous"}</span>
              <span className="mr-4">
                {new Date(blog.created_at).toLocaleDateString()}
              </span>
              <span>{blog.category}</span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {blog.blog_excerpt}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-gray-800 text-base leading-relaxed whitespace-pre-line"
            />

            <div className="mt-8 flex justify-between text-sm text-gray-500">
              <div>Status: {blog.status}</div>
              {/* <div>Tags: {blog.tags.join(", ")}</div> */}
            </div>
          </div>

          {/* Blog Video */}
          {blog.video && (
            <div className="p-8">
              <video controls className="w-full rounded-lg shadow-md">
                <source src={blog.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default BlogDetails;
