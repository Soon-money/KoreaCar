import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBack } from "react-icons/io5";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import AddListing from "../AddListing/AddListing"; // Import AddListing component
import "./Admin.css";

function Admin() {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingCar, setEditingCar] = useState(null); // State for editing a car
  const carsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars");
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
    if (isAuthenticated) {
      fetchCars();
    }
  }, [isAuthenticated]);

  const handleEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`);
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
      const response = await fetch(`http://localhost:5000/api/cars/${updatedCar.id}`, {
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
      const response = await fetch(`http://localhost:5000/api/cars/${id}/soldout`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark car as sold out");
      }
      setCars((prevCars) => prevCars.filter((car) => car.id !== id)); // Remove car from frontend
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

  if (!isAuthenticated) {
    return null;
  }

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
              <div key={car.id} className="car-item">
                <div className="car-date">
                  Added on: {new Date(car.createdAt).toLocaleDateString()}
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
                <div className="car-info">
                  <span className="car-make">{car.make}</span>
                  <span className="car-year">{car.year}</span>
                </div>
                <div className="car-buttons">
                  <button className="edit-button" onClick={() => handleEdit(car.id)}>
                    Edit
                  </button>
                  <button className="soldout-button" onClick={() => handleSoldOut(car.id)}>
                    Sold Out
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