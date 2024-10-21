import React from "react";
import image from "./image.png"; // Assuming you have a sprite image
import "./ImageC.css";

function ImageC({ rAngle1, x, y }) {
  const style1 = {
    transform: `rotate(${rAngle1}deg)`, // Apply rotation
    position: "absolute",              // Position absolutely based on passed x and y
    left: `${x}px`,                    // X position
    top: `${y}px`,                     // Y position
    transition: "left 0.3s, top 0.3s, transform 0.3s", // Smooth transitions
    width: "50px",                     // Optional: Adjust width of the sprite
    height: "50px"                     // Optional: Adjust height of the sprite
  };

  return (
    <img
      src={image}
      style={style1}
      alt="sprite"
    />
  );
}

export default ImageC;
