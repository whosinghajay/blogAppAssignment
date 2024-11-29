import React from "react";
import "../css/NoBlogsFound.css";

const NoBlogsFound = () => {
  return (
    <div className="no-blogs-container">
      <div className="no-blogs-content">
        <p className="no-blogs-message">No blogs found.</p>
        <p className="no-blogs-suggestion">
          Start creating amazing content and share your stories with the world!
        </p>
      </div>
    </div>
  );
};

export default NoBlogsFound;
