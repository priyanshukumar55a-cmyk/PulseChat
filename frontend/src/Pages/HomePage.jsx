import React from "react";
import bgImage from "../assets/chat-background.jpg";

console.log(bgImage);

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold">PulseChat</h1>
          <p className="mt-4 text-xl text-white/80">Feel Every Conversation</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
