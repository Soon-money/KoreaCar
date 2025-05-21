import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegShareFromSquare } from "react-icons/fa6"; // Import the share icon
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CarCard.css";

function CarCard({ car, onCardClick, onShare }) {
  return (
    <div
      className={`car-card ${car.soldOut ? "sold-out" : ""}`}
      onClick={() => onCardClick(car.id)} // Trigger card click handler
    >
      {/* Share Icon */}
      <div
        className="share-icon"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering card click
          onShare(car);
        }}
      >
        <FaRegShareFromSquare />
      </div>

      {/* Car Make and Year */}
      <div className="car-make-year">
        {car.make} {car.year}
      </div>

      {/* SOLD OUT Watermark */}
      {car.soldOut && <div className="soldout-watermark">SOLD OUT</div>}

      {/* Car Image */}
      <div className="car-image-wrapper">
        <LazyLoadImage
          src={
            car.pictures && car.pictures.length > 0
              ? car.pictures[0]
              : "https://via.placeholder.com/150"
          }
          alt={`${car.make} ${car.year}`}
          className="car-image"
          effect="blur"
        />
      </div>

      {/* Car Details */}
      <div className="car-info">
        <p className="car-price">{car.sellingPrice}</p>
      </div>
    </div>
  );
}

export default CarCard;