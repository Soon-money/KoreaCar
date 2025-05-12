import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowGoBackFill } from "react-icons/ri";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { IoIosSpeedometer } from "react-icons/io";
import { LiaCommentSolid } from "react-icons/lia";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io5";
import { RiKakaoTalkLine } from "react-icons/ri";
import { CiShare2 } from "react-icons/ci"; // Import the share icon
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Header from "./Header";
import Comment from "./comment"; // Import the comment component

import "./Cardetails.css";

function Cardetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [clickCount, setClickCount] = useState(0); // Track consecutive clicks
  const [touchStartX, setTouchStartX] = useState(0); // Track the starting X position of a touch
  const [touchEndX, setTouchEndX] = useState(0); // Track the ending X position of a touch

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`https://carvision.onrender.com/api/cars/${id}`);
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

  useEffect(() => {
    // Handle the mobile back button to exit fullscreen mode
    const handlePopState = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFullScreen]);

  const handleFullScreenToggle = () => {
    setClickCount((prevCount) => prevCount + 1);

    if (clickCount === 1) {
      // Exit fullscreen mode on the second consecutive click
      setIsFullScreen(false);
      setClickCount(0); // Reset click count
    } else {
      setIsFullScreen(true);
      window.history.pushState(null, null, window.location.href); // Push state for back button handling
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === car.pictures.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? car.pictures.length - 1 : prevIndex - 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX); // Record the starting X position
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX); // Update the ending X position as the user moves
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      handleNext();
    }

    if (touchEndX - touchStartX > 50) {
      // Swipe right
      handlePrevious();
    }

    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.make} ${car.model} (${car.year})`,
          text: `Check out this car: ${car.make} ${car.model} (${car.year}) for $${car.sellingPrice}.`,
          url: window.location.href,
        })
        .then(() => console.log("Car shared successfully!"))
        .catch((error) => console.error("Error sharing car:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  if (!car) {
    return <div className="loading">Loading...</div>;
  }

  if (car.error) {
    return <div className="error">{car.error}</div>;
  }

  const items = car.pictures;

  return (
    <div className="cardetails-page">
      <Header />

      <div className="cardetails-container">
  {/* SOLD OUT Watermark */}
  {car.soldOut && <div className="soldout-watermark">SOLD OUT</div>}

  <div className="top-bar">
    <button className="go-back-button" onClick={() => navigate("/")}>
      <RiArrowGoBackFill /> Go Back
    </button>
    <button className="share-button" onClick={handleShare}>
      <CiShare2 /> Share
    </button>
  </div>

  <h1 className="cardetails-title">
    {car.make} {car.model} ({car.year})
  </h1>

  <div
  className={`main-media-container ${isFullScreen ? "fullscreen" : ""}`}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  {items[currentIndex] && (
    <LazyLoadImage
      src={items[currentIndex]}
      alt={`Car Media ${currentIndex}`}
      effect="blur"
      className={`main-media ${isFullScreen ? "fullscreen-media" : ""}`}
      onClick={handleFullScreenToggle}
    />
  )}

  {/* Navigation Arrows */}
  <button
    className={`arrow arrow-left ${isFullScreen ? "fullscreen-arrow" : ""}`}
    onClick={handlePrevious}
  >
    <IoIosArrowBack />
  </button>
  <button
    className={`arrow arrow-right ${isFullScreen ? "fullscreen-arrow" : ""}`}
    onClick={handleNext}
  >
    <IoIosArrowForward />
  </button>
</div>

        {/* Thumbnails Section */}
        <div className="thumbnails-container">
          {items.map((thumbnail, index) => (
            <div
              key={index}
              className={`thumbnail ${
                index === currentIndex ? "active-thumbnail" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <LazyLoadImage
                src={thumbnail}
                alt={`Thumbnail ${index}`}
                effect="blur"
                className="thumbnail-image"
              />
            </div>
          ))}
        </div>

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
          <div className="detail-item">
            <LiaCommentSolid className="detail-icon" />
            <span className="detail-text">Comment: {car.comment}</span>
          </div>

          <div className="contact-icons">
            <a
              href="https://wa.me/821075611177"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
            >
              <IoLogoWhatsapp />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://open.kakao.com/o/Felix12great"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon"
            >
              <RiKakaoTalkLine />
              <span>KakaoTalk</span>
            </a>
          </div>
        </div>

        {/* Comment Section */}
        <Comment carId={id} />
      </div>
    </div>
  );
}

export default Cardetails;