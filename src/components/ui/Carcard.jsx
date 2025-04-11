import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import "./Carcard.css";

function Carcard({ car }) {
  const navigate = useNavigate();
  const { translate } = useTranslation(); // Get the translate function

  const handleViewDetails = () => {
    navigate(`/cardetails/${car.id}`, { state: { car } });
  };

  return (
    <div className="car-card" onClick={handleViewDetails}>
      {/* Car Image */}
      <img
        src={car.images[0]} // Display only the first image
        alt={`${car.make} ${car.model}`}
        className="car-image"
      />

      {/* Tiny Text Overlay */}
      <div className="car-info-tiny">
        {translate("carDetails", { make: car.make, model: car.model, year: car.year })}
      </div>
    </div>
  );
}

export default Carcard;