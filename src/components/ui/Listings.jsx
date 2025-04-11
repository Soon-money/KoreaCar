import React, { useState } from "react";
import "./Listings.css"; // Import CSS for styling
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa"; // Import toggle icons
import Carcard from "./Carcard"; // Import the Carcard component
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

// Import the images
import BMWImage from "../../Images/BMW neue klasse.webp";
import MaybachImage from "../../Images/esemayback.avif";
import LexusImage from "../../Images/Lexs.jpeg";

function Listings() {
  const { translate } = useTranslation(); // Access the translate function

  const sedans = [
    {
      id: 1,
      make: "BMW",
      model: "Neue Klasse",
      year: 2023,
      images: [BMWImage, MaybachImage, LexusImage],
      video: "car-video.mp4",
      whatsapp: "821021597173",
      kakao: "Felix12great",
      phone: "+821021597173",
    },
    {
      id: 2,
      make: "Mercedes",
      model: "Maybach",
      year: 2022,
      images: [MaybachImage, BMWImage, LexusImage],
      video: "car-video2.mp4",
      whatsapp: "821021597174",
      kakao: "Felix12great",
      phone: "+821021597174",
    },
    {
      id: 3,
      make: "Lexus",
      model: "RX 500h",
      year: 2021,
      images: [LexusImage, BMWImage, MaybachImage],
      video: "car-video3.mp4",
      whatsapp: "821021597175",
      kakao: "Felix12great",
      phone: "+821021597175",
    },
  ];

  const suvs = [
    {
      id: 1,
      make: "Kia",
      model: "Sportage",
      year: 2020,
      images: ["image7.jpg", "image8.jpg", "image9.jpg"],
      video: "car-video4.mp4",
      whatsapp: "821021597176",
      kakao: "Felix12great",
      phone: "+821021597176",
    },
    // Add other SUV data...
  ];

  const buses = [
    {
      id: 1,
      make: "Mercedes",
      model: "Sprinter",
      year: 2020,
      images: ["image10.jpg", "image11.jpg", "image12.jpg"],
      video: "car-video5.mp4",
      whatsapp: "821021597177",
      kakao: "Felix12great",
      phone: "+821021597177",
    },
    // Add other bus data...
  ];

  const trucks = [
    {
      id: 1,
      make: "Ford",
      model: "F-150",
      year: 2020,
      images: ["image13.jpg", "image14.jpg", "image15.jpg"],
      video: "car-video6.mp4",
      whatsapp: "821021597178",
      kakao: "Felix12great",
      phone: "+821021597178",
    },
    // Add other truck data...
  ];

  const [visibleCategories, setVisibleCategories] = useState({
    sedans: true,
    suvs: true,
    buses: true,
    trucks: true,
  });

  const toggleCategory = (category) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const CarRow = ({ cars, isVisible }) => (
    <div className={`car-row ${isVisible ? "visible" : "hidden"}`}>
      <div className="car-row-content">
        {cars.map((car) => (
          <Carcard key={car.id} car={car} /> // Use the Carcard component here
        ))}
      </div>
    </div>
  );

  return (
    <div className="listings">
      <h1 className="listings-title">{translate("listings")}</h1> {/* Translated title */}

      <div className="category">
        <h2 className="category-title">
          <span>{translate("sedan")}</span> {/* Translated category name */}
          <span
            className="toggle-icon"
            onClick={() => toggleCategory("sedans")}
          >
            {visibleCategories.sedans ? (
              <FaChevronCircleUp />
            ) : (
              <FaChevronCircleDown />
            )}
          </span>
        </h2>
        <CarRow cars={sedans} isVisible={visibleCategories.sedans} />
      </div>

      <div className="category">
        <h2 className="category-title">
          <span>{translate("suv")}</span> {/* Translated category name */}
          <span
            className="toggle-icon"
            onClick={() => toggleCategory("suvs")}
          >
            {visibleCategories.suvs ? (
              <FaChevronCircleUp />
            ) : (
              <FaChevronCircleDown />
            )}
          </span>
        </h2>
        <CarRow cars={suvs} isVisible={visibleCategories.suvs} />
      </div>

      <div className="category">
        <h2 className="category-title">
          <span>{translate("bus")}</span> {/* Translated category name */}
          <span
            className="toggle-icon"
            onClick={() => toggleCategory("buses")}
          >
            {visibleCategories.buses ? (
              <FaChevronCircleUp />
            ) : (
              <FaChevronCircleDown />
            )}
          </span>
        </h2>
        <CarRow cars={buses} isVisible={visibleCategories.buses} />
      </div>

      <div className="category">
        <h2 className="category-title">
          <span>{translate("truck")}</span> {/* Translated category name */}
          <span
            className="toggle-icon"
            onClick={() => toggleCategory("trucks")}
          >
            {visibleCategories.trucks ? (
              <FaChevronCircleUp />
            ) : (
              <FaChevronCircleDown />
            )}
          </span>
        </h2>
        <CarRow cars={trucks} isVisible={visibleCategories.trucks} />
      </div>
    </div>
  );
}

export default Listings;