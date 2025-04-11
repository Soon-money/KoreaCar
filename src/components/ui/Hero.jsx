import React, { useState, useEffect } from "react";
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import "./Hero.css"; // Make sure to create this CSS file for styling
import BMWNeueKlasse from "../../Images/BMW neue klasse.webp";
import K8 from "../../Images/k8.jpg";
import Lexs from "../../Images/Lexs.jpeg";
import esemayback from "../../Images/esemayback.avif";

function Hero() {
  const { translate } = useTranslation(); // Access the translate function

  const slides = [
    { image: BMWNeueKlasse, text: translate("bmwNeueKlasse") },
    { image: K8, text: translate("kiaK8") },
    { image: Lexs, text: translate("lexus") },
    { image: esemayback, text: translate("newModels") },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  let touchStartX = 0;
  let touchEndX = 0;

  // Automatically change slides every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slides.length]);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
    if (touchEndX - touchStartX > 50) {
      // Swipe right
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div
      className="hero"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="hero-image"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      ></div>
      <div className="hero-text">
        <h2>{slides[currentSlide].text}</h2>
        <button className="cta-button">{translate("shopNow")}</button>
      </div>
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Hero;