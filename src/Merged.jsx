import { useState } from "react";
import ImageC from "./ImageC";
import "./Merged.css";

function Merged() {
  const [clonedOperations, setClonedOperations] = useState([]);
  const [sprites, setSprites] = useState([{ id: 0, x: 0, y: 0, rAngle: 0 }]); // List of sprites with default sprite
  const [isPlaying, setIsPlaying] = useState(false); // State to track if animation is playing
  const [animationInterval, setAnimationInterval] = useState(null); // To store the interval ID
  const [selectedSpriteId, setSelectedSpriteId] = useState(0); // Selected sprite ID (default is sprite 1)

  // Define actions for the buttons and apply to the selected sprite only
  function move1() {
    let temp = document.getElementById("stepCount").value;
    temp = parseInt(temp, 10);
    if (!isNaN(temp)) {
      const radians = (sprites[selectedSpriteId].rAngle * Math.PI) / 180; // Use the angle of the selected sprite to calculate movement
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === selectedSpriteId
            ? {
                ...sprite,
                x: Math.round(sprite.x + temp * Math.cos(radians)),
                y: Math.round(sprite.y + temp * Math.sin(radians)),
              }
            : sprite
        )
      );
    }
  }

  function clock1() {
    let temp = document.getElementById("clockA").value;
    temp = parseInt(temp, 10);
    if (!isNaN(temp)) {
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === selectedSpriteId
            ? { ...sprite, rAngle: sprite.rAngle - temp } // Rotate the selected sprite
            : sprite
        )
      );
    }
  }

  function clock2() {
    let temp = document.getElementById("antiCA").value;
    temp = parseInt(temp, 10);
    if (!isNaN(temp)) {
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === selectedSpriteId
            ? { ...sprite, rAngle: sprite.rAngle + temp } // Rotate the selected sprite
            : sprite
        )
      );
    }
  }

  function goto() {
    let x = document.getElementById("gotoX").value;
    let y = document.getElementById("gotoY").value;
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    if (!isNaN(x) && !isNaN(y)) {
      setSprites((prevSprites) =>
        prevSprites.map((sprite) =>
          sprite.id === selectedSpriteId
            ? { ...sprite, x: x, y: y } // Move the selected sprite
            : sprite
        )
      );
    }
  }

  // Function to execute a single operation
  const executeOperation = (operationId) => {
    switch (operationId) {
      case "move1":
        move1();
        break;
      case "clock1":
        clock1();
        break;
      case "clock2":
        clock2();
        break;
      case "goto":
        goto();
        break;
      default:
        break;
    }
  };

  // Handle the drop event
  const handleDrop = (e) => {
    e.preventDefault();
    const operationId = e.dataTransfer.getData("operationId");

    // Check if the dragged button has a valid function
    if (operationId) {
      const clonedElement = {
        id: operationId,
        func: () => executeOperation(operationId), // Bind the function to the cloned element
      };

      // Add the dragged operation to the list
      setClonedOperations((prev) => [...prev, clonedElement]);
    }
  };

  // Handle drag over event
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to repeat all dragged operations in the drop zone
  const repeatActions = (repeatCount) => {
    let currentIteration = 0;

    const repeatMoveActions = () => {
      let temp = document.getElementById("stepCount").value;
      temp = parseInt(temp, 10);
      if (!isNaN(temp)) {
        const radians = (sprites[selectedSpriteId].rAngle * Math.PI) / 180; // Use the angle of the selected sprite to calculate movement
        setSprites((prevSprites) =>
          prevSprites.map((sprite) =>
            sprite.id === selectedSpriteId
              ? {
                  ...sprite,
                  x: Math.round(sprite.x + temp * Math.cos(radians)),
                  y: Math.round(sprite.y + temp * Math.sin(radians)),
                }
              : sprite
          )
        );
      }
    };

    const executeOperations = () => {
      clonedOperations.forEach((operation) => {
        operation.func();
      });
    };

    const repeatInterval = setInterval(() => {
      if (currentIteration >= repeatCount) {
        clearInterval(repeatInterval);
        return;
      }

      repeatMoveActions();
      executeOperations();
      currentIteration++;
    }, 500); // Adjust the delay as necessary
  };

  // Add a new sprite
  const addSprite = () => {
    const newSprite = {
      id: sprites.length,
      x: 0,
      y: 0,
      rAngle: 0,
    };
    setSprites([...sprites, newSprite]); // Add the new sprite to the list
  };

  // Hero Feature: Collision detection and swapping of animations
  const detectCollision = (sprite1, sprite2) => {
    const distance = Math.sqrt(
      Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)
    );
    return distance < 20; // Collision threshold is 20 units
  };

  const swapAnimations = (sprite1Id, sprite2Id) => {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) => {
        if (sprite.id === sprite1Id || sprite.id === sprite2Id) {
          return { ...sprite, rAngle: sprite.rAngle + 180 }; // Reverse direction
        }
        return sprite;
      })
    );
  };

  // Function to play the animation in a loop with collision detection
  const playAnimation = () => {
    if (!isPlaying) {
      const interval = setInterval(() => {
        clonedOperations.forEach((operation) => {
          operation.func();
        });

        // Check for collisions between sprites
        for (let i = 0; i < sprites.length; i++) {
          for (let j = i + 1; j < sprites.length; j++) {
            if (detectCollision(sprites[i], sprites[j])) {
              swapAnimations(sprites[i].id, sprites[j].id); // Swap their animations on collision
            }
          }
        }
      }, 500); // Adjust the interval as needed (500ms for example)
      setAnimationInterval(interval);
      setIsPlaying(true);
    }
  };

  // Function to stop the animation
  const stopAnimation = () => {
    if (isPlaying && animationInterval) {
      clearInterval(animationInterval);
      setIsPlaying(false);
    }
  };

  // Handle sprite selection from the dropdown
  const handleSpriteSelection = (e) => {
    setSelectedSpriteId(parseInt(e.target.value, 10)); // Set the selected sprite's ID
  };

  return (
    <>
      <div className="common-heading">
        <h2>Sprite Animation Control Panel</h2>
      </div>
      <div className="container">
        <div className="side1">
          <h3>Motion</h3>
          {/* Add buttons to directly trigger the operations in the Motion section */}
          <button
            draggable="true"
            onDragStart={(e) => e.dataTransfer.setData("operationId", "move1")}
            onClick={() => executeOperation("move1")}
          >
            Move
          </button>
          <input id="stepCount" type="number" placeholder="Steps" />

          <button
            draggable="true"
            onDragStart={(e) => e.dataTransfer.setData("operationId", "clock1")}
            onClick={() => executeOperation("clock1")}
          >
            Turn Clockwise
          </button>
          <input id="clockA" type="number" placeholder="Degrees" />

          <button
            draggable="true"
            onDragStart={(e) => e.dataTransfer.setData("operationId", "clock2")}
            onClick={() => executeOperation("clock2")}
          >
            Turn Anticlockwise
          </button>
          <input id="antiCA" type="number" placeholder="Degrees" />

          <button
            draggable="true"
            onDragStart={(e) => e.dataTransfer.setData("operationId", "goto")}
            onClick={() => executeOperation("goto")}
          >
            Goto (X,Y)
          </button>
          <input id="gotoX" type="number" placeholder="X" />
          <input id="gotoY" type="number" placeholder="Y" />

          <button
            draggable="true"
            onDragStart={(e) => e.dataTransfer.setData("operationId", "repeat")}
            onClick={() =>
              repeatActions(parseInt(document.getElementById("repeatCount").value, 10))
            }
          >
            Repeat
          </button>
          <input id="repeatCount" type="number" placeholder="Repeat Count" />

          {/* Button to add a new sprite */}
          <button onClick={addSprite}>Add New Sprite</button>

          {/* New buttons for Play and Stop */}
          <button onClick={playAnimation} disabled={isPlaying}>
            Play Animation
          </button>
          <button onClick={stopAnimation} disabled={!isPlaying}>
            Stop Animation
          </button>
        </div>

        <div className="side2" onDrop={handleDrop} onDragOver={handleDragOver}>
          <h3>Drag and Drop Area</h3>
          <div>
            {/* Dropdown to select a sprite */}
            <select onChange={handleSpriteSelection}>
              {sprites.map((sprite) => (
                <option key={sprite.id} value={sprite.id}>
                  Sprite {sprite.id + 1}
                </option>
              ))}
            </select>
          </div>
          <div id="drop-zone">
            {clonedOperations.map((operation, index) => (
              <div key={index}>
                {/* Clone button in drop zone */}
                <button onClick={operation.func}>{operation.id} action</button>
              </div>
            ))}
          </div>
        </div>

        <div className="side4">
  <h3>Preview Area</h3>
  {/* Create a common container with a fixed size for the preview */}
  <div style={{ position: 'relative', width: '500px', height: '400px', border: '1px solid #ccc', margin: '0 auto' }}> 
    {sprites.map((sprite, index) => (
      <ImageC
        key={sprite.id} // Use sprite.id instead of index to avoid rendering issues
        rAngle1={sprite.rAngle}
        x={sprite.x}
        y={sprite.y}
        style={{
          position: 'absolute',
          left: `${sprite.x}px`, // Sprite x-coordinate relative to the container
          top: `${sprite.y}px`,  // Sprite y-coordinate relative to the container
        }}
      />
    ))}
  </div>
  <div className="info">
    <p>X Coordinate: {sprites[selectedSpriteId].x}</p>
    <p>Y Coordinate: {sprites[selectedSpriteId].y}</p>
    <p>Rotation Angle: {sprites[selectedSpriteId].rAngle}°</p>
  </div>
</div>

      </div>
    </>
  );
}

export default Merged;
