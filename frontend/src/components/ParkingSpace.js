import React from "react";

const ParkingSpace = ({ free }) => {
  return (
    <>
      <div className="parking-space">
        <div className="inner-pads">
          <div className={`availability ${free && "occupied"}`}></div>
        </div>
      </div>
    </>
  );
};

export default ParkingSpace;
