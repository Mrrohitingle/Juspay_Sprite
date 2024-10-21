import React from "react";
import "./Operation.css";

function Operation({ label1, label2, fName, textBId, textBId1, textBId2, operationId }) {
  return (
    <div className="operation-container">
      <button
        id={operationId}
        draggable="true"
        onDragStart={(e) => e.dataTransfer.setData("operationId", operationId)}
      >
        {label1}
        {textBId ? <input type="text" id={textBId} /> : null}
        {label2}
        {textBId1 && textBId2 ? (
          <>
            <input type="text" id={textBId1} />
            <input type="text" id={textBId2} />
          </>
        ) : null}
      </button>
    </div>
  );
}

export default Operation;
