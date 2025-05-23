import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegShareFromSquare } from "react-icons/fa6";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CarCard.css";

function CarCard({ car, onCardClick }) {
  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `https://carvision.onrender.com/car/${car.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${car.make} ${car.model} (${car.year})`,
          text: `Check out this car: ${car.make} ${car.model} (${car.year}) for $${car.sellingPrice}.`,
          url: shareUrl,
        })
        .then(() => console.log("Car shared successfully!"))
        .catch((error) => console.error("Error sharing car:", error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handleCardClick = () => {
    // Redirect to the specific car details page
    window.location.href = `/cardetails/${car.id}`;
  };

  return (
    <div
      className={`car-card ${car.soldOut ? "sold-out" : ""}`}
      onClick={handleCardClick}
    >
      {/* Share Icon */}
      <div className="share-icon" onClick={handleShare}>
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