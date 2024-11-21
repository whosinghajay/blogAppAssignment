import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import the Quill styles
import "../css/EditBlog.css";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    coverImage: "",
  });
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch blog details
  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/blogs/${id}`);
      setBlogData(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to load blog details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file); // Set the new image file

    // Generate a preview of the new image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle description change with React Quill
  const handleDescriptionChange = (value) => {
    setBlogData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Submit updated blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);

    if (newImage) {
      formData.append("coverImage", newImage); // Add the new image to the request
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_SERVER}/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/"); // Redirect to homepage or a success page
    } catch (error) {
      setError("Failed to update blog. Please try again.");
    }
  };

  if (loading) return <p>Loading blog details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-blog">
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit} className="edit-blog-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* React Quill for description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <ReactQuill
            theme="snow"
            value={blogData.description}
            onChange={handleDescriptionChange} // Bind to the state
            placeholder="Write your blog description here..."
            className="text-editor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Change Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {newImagePreview ? (
              <>
                <p>New Image Preview:</p>
                <img src={newImagePreview} alt="New Preview" />
              </>
            ) : (
              blogData.coverImage && (
                <>
                  <p>Current Image:</p>
                  <img src={`${import.meta.env.VITE_API_SERVER}/${blogData.coverImage}`} alt={blogData.title} />
                </>
              )
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-save">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
