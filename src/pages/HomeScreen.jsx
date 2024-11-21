import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../css/HomeScreen.css";
import { auth, db } from "../components/firebase";
import axios from "axios";

const HomeScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        fetchUserBlogs(user.uid);
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      // window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  // Fetch blogs created by the logged-in user from the backend
  const fetchUserBlogs = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/blogs`);
      const filteredBlogs = response.data.filter(
        (blog) => blog.userId === userId
      );
      console.log(filteredBlogs, "filtered");
      setUserBlogs(filteredBlogs);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  const removePtags = (description) => {
    return description.replace(/<p>/g, "").replace(/<\/p>/g, "");
  };

  const handleDeleteBlog = async () => {
    try {
      if (blogToDelete) {
        await axios.delete(`${import.meta.env.VITE_API_SERVER}/api/blogs/${blogToDelete}`);
        setUserBlogs(userBlogs.filter((blog) => blog._id !== blogToDelete));
        setShowModal(false); // Close the modal after successful delete
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openModal = (blogId) => {
    setBlogToDelete(blogId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setBlogToDelete(null);
  };

  return (
    <div className="home-screen">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">Blogify</div>
        <div className="navbar-buttons">
          {userDetails ? (
            <>
              <Link to="/create-blog" className="btn">
                Create
              </Link>
              <Link onClick={handleLogout} to="/" className="btn">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Landing Section */}
      <header className="landing">
        <div className="landing-content">
          <h1>Welcome to Blogify</h1>
          <p>Your one-stop platform to share and discover amazing stories.</p>
          <div className="landing-buttons">
            <Link to="/create-blog" className="btn btn-primary">
              Start Writing
            </Link>
            <Link to="/blogs" className="btn">
              Explore Blogs
            </Link>
          </div>
        </div>
        <div className="landing-image">
          <img
            src="https://img.freepik.com/free-vector/blog-post-concept-illustration_114360-244.jpg?t=st=1732122946~exp=1732126546~hmac=0ee0f09b56eb711dcce12a1aa533e9d0cf3819c307085976d3b9a48939380f39&w=740"
            alt="Landing Illustration"
            width="400"
            height="200"
          />
        </div>
      </header>

      {/* User's Blogs Section */}
      <section className="user-blogs">
        <h2>Your Blogs</h2>
        {userBlogs.length > 0 ? (
          <div className="blogs-grid">
            {userBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <img
                  src={`${import.meta.env.VITE_API_SERVER}/${blog.coverImage}`}
                  alt={blog.title}
                  className="blog-image"
                />
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  {/* <p>{removePtags(blog.description.slice(0, 100))}...</p>{" "} */}
                  <div
                    className="blog-description"
                    dangerouslySetInnerHTML={{ __html: blog.description.slice(0,100) }}
                  />
                  {/* Show only a preview of the description */}
                  <div className="blog-actions">
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="btn btn-edit"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-delete"
                      // onClick={() => handleDeleteBlog(blog._id)}
                      onClick={() => openModal(blog._id)}
                    >
                      Delete
                    </button>
                    <Link to={`/blogs/${blog._id}`} className="btn btn-view">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not posted any blogs yet.</p>
        )}
      </section>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this blog?</h3>
            <div className="modal-actions">
              <button onClick={handleDeleteBlog} className="btn btn-confirm">
                Confirm
              </button>
              <button onClick={closeModal} className="btn btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
