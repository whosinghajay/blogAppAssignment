import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import BlogsScreen from "./pages/BlogsScreen";
import BlogDetailPage from "./pages/BlogDetailPage";
import EditBlog from "./pages/EditBlog";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blogs" element={<BlogsScreen />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
