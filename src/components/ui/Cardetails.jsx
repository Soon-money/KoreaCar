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
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Header from "./Header";

import "./Cardetails.css";

function Cardetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const items = car.pictures;

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

  const handleFullScreenToggle = () => {
    setIsFullScreen(true);
    window.history.pushState(null, null, window.location.href);
  };

  return (
    <div className="cardetails-page">
      <Header />

      <div className="cardetails-container">
        <button className="go-back-button" onClick={() => navigate("/")}>
          <RiArrowGoBackFill /> Go Back
        </button>

        <h1 className="cardetails-title">
          {car.make} {car.model} ({car.year})
        </h1>

        <div
          className={`main-media-container ${isFullScreen ? "fullscreen" : ""}`}
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
          {!isFullScreen && (
            <>
              <button className="arrow arrow-left" onClick={handlePrevious}>
                <IoIosArrowBack />
              </button>
              <button className="arrow arrow-right" onClick={handleNext}>
                <IoIosArrowForward />
              </button>
            </>
          )}
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
              href="https://wa.me/821021597173"
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
      </div>
    </div>
  );
}

export default Cardetails;