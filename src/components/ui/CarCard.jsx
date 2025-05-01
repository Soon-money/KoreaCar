import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./CarCard.css";

function CarCard({ car }) {
  return (
    <Link to={`/cardetails/${car.id}`} className="car-card-link"> {/* Wrap the card in a Link */}
      <div className="car-card">
        {/* Car Image */}
        <div className="car-image-wrapper">
          <LazyLoadImage
            src={car.pictures && car.pictures.length > 0 ? car.pictures[0] : "https://via.placeholder.com/150"}
            alt={`${car.make} ${car.year}`}
            className="car-image"
            effect="blur"
          />
        </div>

        {/* Car Details */}
        <div className="car-info-wrapper">
          <div className="car-info">
            <span className="car-make-year">
              {car.make} ({car.year})
            </span>
            <span className="car-price">${car.sellingPrice}</span>
            <span className="car-comment">{car.comment}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CarCard;