import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import Header from "../components/ui/Header.jsx";
import Footer from "../components/ui/Footer.jsx";
import AddListing from "../AddListing/AddListing.jsx";
import "./Admin.css";

function Admin() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCar, setEditingCar] = useState(null); // State for editing a car
 
  const carsPerPage = 20;
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const response = await fetch("https://carvision.onrender.com/api/cars");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch car details");
      }
      const car = await response.json();
      setEditingCar(car); // Set the car to be edited
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  const handleSave = async (updatedCar) => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${updatedCar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCar),
      });
      if (!response.ok) {
        throw new Error("Failed to update car details");
      }
      setEditingCar(null); // Close the edit form
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error("Error updating car details:", error);
    }
  };

  const handleSoldOut = async (id) => {
    try {
      const response = await fetch(`https://carvision.onrender.com/api/cars/${id}/soldout`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark car as sold out");
      }
      
      fetchCars(); // Refresh the car list
    } catch (error) {
      console.error("Error marking car as sold out:", error);
    }
  };

 

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
    <div className="admin">
      <Header />
      <button className="back-button" onClick={() => navigate("/")}>
        <IoReturnUpBack /> Back
      </button>
      <h1 className="admin-title">Admin Panel</h1>

      {editingCar ? (
        <div className="edit-form">
          <h2>Edit Car</h2>
          {/* Render AddListing component with pre-filled data */}
          <AddListing
            initialData={editingCar} // Pass the car details as initial data
            onSave={handleSave} // Handle save action
            onCancel={() => setEditingCar(null)} // Handle cancel action
          />
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {currentCars.map((car) => (
              <div key={car.id} className={`car-item ${car.soldOut ? "sold-out" : ""}`}>

                {/* Display make and year at the top */}
                <div className="car-header">
                  <span className="car-make">{car.make}</span>
                  <span className="car-year">{car.year}</span>
                </div>
                <img
                  src={
                    Array.isArray(car.pictures) && car.pictures.length > 0
                      ? car.pictures[0]
                      : "https://via.placeholder.com/150"
                  }
                  alt={`${car.make} ${car.year}`}
                  className="car-image"
                />
                {car.soldOut && <div className="soldout-watermark">SOLD OUT</div>}
                <div className="car-buttons">
                  <button className="edit-button" onClick={() => handleEdit(car.id)}>
                    Edit
                  </button>
                  <button className="soldout-button" onClick={() => handleSoldOut(car.id)}>
                    Sold
                  </button>
                  
                </div>
              </div>
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
        </>
      )}
      <Footer />
    </div>
  );
}

export default Admin;