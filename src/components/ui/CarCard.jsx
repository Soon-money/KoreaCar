import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegShareFromSquare } from "react-icons/fa6";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CarCard.css";

function CarCard({ car, onCardClick, latestComment }) {
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
    window.location.href = `/cardetails/${car.id}`;
  };

  // Truncate comment if too long
  const truncate = (str, n) => (str && str.length > n ? str.slice(0, n) + "..." : str);

  return (
    <div
      className={`car-card ${car.soldOut ? "sold-out" : ""}`}
      onClick={handleCardClick}
      style={{ flexDirection: "row-reverse" }} // Picture on right, details on left
    >
      {/* Share Icon */}
      <div className="share-icon" onClick={handleShare}>
        <FaRegShareFromSquare />
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
        <div className="car-make-year-light">{car.make} {car.year}</div>
        <div className="car-price-light">{car.sellingPrice}</div>
        <div className="car-comment-label">Comment</div>
        <div className="car-comment-light">
          {latestComment ? truncate(latestComment, 60) : <span className="car-no-comment">No comments yet.</span>}
        </div>
        
      </div>
    </div>
  );
}

export default CarCard;
