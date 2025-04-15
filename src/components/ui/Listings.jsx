import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Listings.css";

function Listings() {
  const [cars, setCars] = useState([]); // All cars
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const carsPerPage = 9; // Number of cars per page

  const fetchListings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await response.json();

      // Sort the data by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setCars(sortedData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Pagination logic
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

  return (
    <div className="listings">
      <h1 className="listings-title">Car Listings</h1>

      <div className="cars-grid">
        {currentCars.map((car) => (
          <Link to={`/cardetails/${car.id}`} key={car.id} className="car-item">
            <img
              src={
                Array.isArray(car.pictures) && car.pictures.length > 0
                  ? car.pictures[0]
                  : "https://via.placeholder.com/150"
              }
              alt={`${car.make} ${car.year}`}
              className="car-image"
            />
            <div className="car-info">
              <span className="car-make">{car.make}</span>
              <span className="car-year">{car.year}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
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