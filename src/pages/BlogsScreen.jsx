import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/BlogsScreen.css";

const BlogsScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/blogs`);
        setBlogs(response.data || []);
      } catch (error) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const removePtags = (description) => {
    return description.replace(/<p>/g, "").replace(/<\/p>/g, "");
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div>
      <h1>All Blogs</h1>

      {loading && <p>Loading blogs...</p>}
      {error && <p>{error}</p>}

      <div className="blogs-container">
        {currentBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          currentBlogs.map((blog) => (
            <div key={blog._id} className="blog-post">
              <Link to={`/blogs/${blog._id}`} className="blog-link">
                <h2>{blog.title}</h2>
                {/* <p>{truncateDescription(removePtags(blog.description), 150)}</p> */}
                <div
                  className="blog-description"
                  dangerouslySetInnerHTML={{ __html: blog.description.slice(0,150) }}
                />
                <img
                  src={`${import.meta.env.VITE_API_SERVER}/${blog.coverImage}`}
                  alt={blog.title}
                  style={{ width: "100%", height: "auto" }}
                />
                <p>
                  <strong>Published:</strong>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))
        )}
      </div>

      {blogs.length > blogsPerPage && (
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(blogs.length / blogsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default BlogsScreen;
