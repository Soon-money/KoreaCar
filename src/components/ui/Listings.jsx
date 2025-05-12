import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./carcard.jsx"; // Import the CarCard component
import "./Listings.css";

function Listings() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
          const response = await fetch("http://localhost:5000/api/available-cars");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await response.json();

      // Sort cars: non-sold-out cars first, then sold-out cars
      const sortedData = data.sort((a, b) => {
        if (a.soldOut === b.soldOut) {
          return new Date(b.createdAt) - new Date(a.createdAt); // Sort by creation date
        }
        return a.soldOut - b.soldOut; // Sold-out cars appear last
      });

      setCars(sortedData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const nextPage = () => {
    if (indexOfLastCar < cars.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleShare = (car) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.make} (${car.year})`,
          text: `Check out this car: ${car.make} (${car.year}) for $${car.sellingPrice}.`,
          url: window.location.href,
        })
        .then(() => console.log("Car shared successfully!"))
        .catch((error) => console.error("Error sharing car:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const handleCardClick = (carId) => {
    navigate(`/cardetails/${carId}`);
  };

  return (
    <div className="listings">
      <h1 className="listings-title">Car Listings</h1>

      <div className="cars-grid">
        {currentCars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            onCardClick={handleCardClick}
            onShare={handleShare}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {Math.ceil(cars.length / carsPerPage)}
        </span>
        <button
          className="pagination-button"
          onClick={nextPage}
          disabled={indexOfLastCar >= cars.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Listings;