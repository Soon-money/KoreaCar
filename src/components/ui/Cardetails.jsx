import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Import arrows
import { RiArrowGoBackFill } from "react-icons/ri"; // Import Go Back icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import Header from "./Header"; // Import Header
import Stickybottommenu from "./Stickybottommenu"; // Import Stickybottommenu
import "./Cardetails.css";

function Cardetails() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigation
  const car = location.state.car; // Retrieve car data from navigation state
  const { translate } = useTranslation(); // Access the translate function

  const [currentIndex, setCurrentIndex] = useState(0); // Current index for main image/video

  const items = [car.video, ...car.images]; // Combine video and images

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

  return (
    <div className="cardetails-page">
      <Header /> {/* Integrate Header */}

      <div className="cardetails-container">
        {/* Go Back Button */}
        <button className="go-back-button" onClick={() => navigate("/")}>
          <RiArrowGoBackFill /> {translate("goBack")} {/* Translated text */}
        </button>

        {/* Title */}
        <h1 className="cardetails-title">
          {translate("carDetails", { make: car.make, model: car.model, year: car.year })}
        </h1>

        {/* Main Media Section */}
        <div className="main-media-container">
          <button className="arrow arrow-left" onClick={handlePrevious}>
            <IoIosArrowBack />
          </button>
          {currentIndex === 0 ? (
            <video controls className="main-media">
              <source src={car.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={items[currentIndex]}
              alt={`Car Media ${currentIndex}`}
              className="main-media"
            />
          )}
          <button className="arrow arrow-right" onClick={handleNext}>
            <IoIosArrowForward />
          </button>
        </div>

        {/* Thumbnails Section */}
        <div className="thumbnails-container">
          {items.map((item, index) => (
            <div
              key={index}
              className={`thumbnail ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              {index === 0 ? (
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

        {/* Contact Section */}
        <div className="contact-section">
          <h3>{translate("contactOwner")}</h3> {/* Translated heading */}
          <a
            href={`https://wa.me/${car.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-option"
          >
            {translate("whatsapp")}
          </a>
          <a
            href={`https://open.kakao.com/o/${car.kakao}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-option"
          >
            {translate("kakaoTalk")}
          </a>
          <a href={`tel:${car.phone}`} className="contact-option">
            {translate("telephone")}
          </a>
        </div>
      </div>

      <Stickybottommenu /> {/* Replace Footer with Stickybottommenu */}
    </div>
  );
}

export default Cardetails;