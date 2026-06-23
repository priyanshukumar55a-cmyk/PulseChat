import React from "react";
import "./Background.css";

const Background = () => {
  return (
    <div className=" body-bg">
      <div className="circle c1"></div>
      <div className="circle c2"></div>
      <div className="circle c3"></div>
      <div className="circle c4"></div>
      <div className="overlay"></div>

      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`dot-grid grid${i + 1}`}></div>
      ))}
    </div>
  );
};

export default Background;
