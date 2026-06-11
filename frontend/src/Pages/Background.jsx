import React from "react";
import bgImage from "../assets/chat-background.jpg";

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <img
        src={bgImage}
        alt="Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default Background;
