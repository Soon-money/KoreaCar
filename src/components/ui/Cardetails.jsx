import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { IoIosSpeedometer } from "react-icons/io";
import { BsFillFuelPumpFill } from "react-icons/bs";
import Header from "./Header";
import Stickybottommenu from "./Stickybottommenu";
import "./Cardetails.css";

function Cardetails() {
  const { id } = useParams(); // Get car ID from URL params
  const navigate = useNavigate(); // Initialize navigation
  const [car, setCar] = useState(null); // State to store car data
  const [currentIndex, setCurrentIndex] = useState(0); // Current index for main image/video
  const [isFullScreen, setIsFullScreen] = useState(false); // State for full-screen mode
  const [lastClickTime, setLastClickTime] = useState(0); // Track last click time for double-click detection
  const [touchStartX, setTouchStartX] = useState(0); // Track touch start position
  const [touchEndX, setTouchEndX] = useState(0); // Track touch end position

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch car details: ${response.statusText}`);
        }
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setCar({ error: "Failed to load car details. Please try again later." });
      }
    };

    fetchCarData();
  }, [id]);

  if (!car) {
    return <div className="loading">Loading...</div>;
  }

  if (car.error) {
    return <div className="error">{car.error}</div>;
  }

  const items = car.videos && car.videos.length > 0 ? [...car.videos, ...car.pictures] : car.pictures;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleMediaClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      // Double-click detected
      setIsFullScreen(false); // Exit full-screen mode
    } else {
      setLastClickTime(currentTime);
    }
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(true); // Enter full-screen mode
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX); // Record the starting touch position
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX); // Update the touch end position
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      handleNext();
    } else if (touchEndX - touchStartX > 50) {
      // Swipe right
      handlePrevious();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <div className="cardetails-page">
      <Header />

      <div className="cardetails-container">
        {/* Go Back Button */}
        <button className="go-back-button" onClick={() => navigate("/")}>
          <RiArrowGoBackFill /> Go Back
        </button>

        {/* Title */}
        <h1 className="cardetails-title">
          {car.make} {car.model} ({car.year})
        </h1>

        {/* Main Media Section */}
        <div
          className={`main-media-container ${isFullScreen ? "fullscreen" : ""}`}
          onClick={isFullScreen ? handleMediaClick : undefined}
          onTouchStart={handleTouchStart} // Handle touch start for both modes
          onTouchMove={handleTouchMove} // Handle touch move for both modes
          onTouchEnd={handleTouchEnd} // Handle touch end for both modes
        >
          {!isFullScreen && (
            <button className="arrow arrow-left" onClick={handlePrevious}>
              <IoIosArrowBack />
            </button>
          )}
          {items[currentIndex].endsWith(".mp4") ? (
            <video
              controls={!isFullScreen}
              className={`main-media ${isFullScreen ? "fullscreen-media" : ""}`}
              onClick={handleFullScreenToggle}
            >
              <source src={items[currentIndex]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={items[currentIndex]}
              alt={`Car Media ${currentIndex}`}
              className={`main-media ${isFullScreen ? "fullscreen-media" : ""}`}
              onClick={handleFullScreenToggle}
            />
          )}
          {!isFullScreen && (
            <button className="arrow arrow-right" onClick={handleNext}>
              <IoIosArrowForward />
            </button>
          )}
        </div>

        {/* Thumbnails Section */}
        {!isFullScreen && (
          <div className="thumbnails-container">
            {items.map((item, index) => (
              <div
                key={index}
                className={`thumbnail ${currentIndex === index ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              >
                {item.endsWith(".mp4") ? (
                  <video className="thumbnail-video">
                    <source src={item} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item}
                    alt={`Thumbnail ${index}`}
                    className="thumbnail-image"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Details Section */}
        {!isFullScreen && (
          <div className="details-section">
            <h3>Car Details</h3>
            <div className="detail-item">
              <PiCurrencyDollarSimpleFill className="detail-icon" />
              <span className="detail-text">Price: ${car.sellingPrice}</span>
            </div>
            <div className="detail-item">
              <IoIosSpeedometer className="detail-icon" />
              <span className="detail-text">Mileage: {car.mileage} km</span>
            </div>
            <div className="detail-item">
              <BsFillFuelPumpFill className="detail-icon" />
              <span className="detail-text">Fuel Type: {car.fuelType}</span>
            </div>
          </div>
        )}
      </div>

      <Stickybottommenu />
    </div>
  );
}

export default Cardetails;