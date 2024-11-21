import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get the blog ID from the URL
import "../css/BlogDetailPage.css";

const BlogDetailPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the blog details based on the ID
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER}/api/blogs/${id}`
        );
        setBlog(response.data); // Assuming the response is the full blog
      } catch (error) {
        setError("Failed to fetch blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!blog) return <div className="error-message">Blog not found.</div>;

  const removePtags = (description) => {
    return description.replace(/<p>/g, "").replace(/<\/p>/g, "");
  };

  return (
    <div className="blog-detail-container">
      <div className="blog-content">
        <h1 className="blog-title">{blog.title}</h1>
        <img
          src={`${import.meta.env.VITE_API_SERVER}/${blog.coverImage}`}
          alt={blog.title}
          className="cover-image"
        />
        {/* <p className="blog-description">{removePtags(blog.description)}</p> */}
        <div
          className="blog-description"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
        <div className="published-info">
          <strong>Published on:</strong>{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
