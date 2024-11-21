import React, { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/CreateBlog.css";
import { auth, db, storage } from "../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import axios from "axios";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !coverImage) {
      toast.error("Please fill in all fields and upload a cover image!", {
        position: "top-center",
      });
      return;
    }
  
    try {
      const user = auth.currentUser;
  
      if (!user) {
        toast.error("You must be logged in to create a blog!", {
          position: "top-center",
        });
        return;
      }
  
      const formData = new FormData();
      formData.append("userId", user.uid);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("coverImage", coverImage);
  
      const response = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201) {
        toast.success("Blog post submitted successfully!", {
          position: "top-center",
        });
  
        setTitle("");
        setDescription("");
        setCoverImage(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error creating blog:", error.message);
      toast.error("Failed to create blog post. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="create-blog">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label>Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="form-group">
          <label>Blog Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            placeholder="Write your blog description here..."
            className="text-editor"
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit">
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
