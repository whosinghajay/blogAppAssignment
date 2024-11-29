import React from "react";
import "../css/LoadingBar.css";

const LoadingBar = ({ isLoading, height = "4px", color = "#007BFF" }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-bar" style={{ height, backgroundColor: color }}>
      <div className="progress" />
    </div>
  );
};

export default LoadingBar;
