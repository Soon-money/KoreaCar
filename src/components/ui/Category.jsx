import React from "react";
import "./Category.css"; // Import CSS for styling
import { IoCarSport } from "react-icons/io5"; // Sedan icon
import { TbCarSuvFilled } from "react-icons/tb"; // SUV icon
import { FaBus } from "react-icons/fa"; // Bus icon
import { FaTruckFront } from "react-icons/fa6"; // Truck icon
import { BiSolidCarGarage } from "react-icons/bi"; // Convertible icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

function Category() {
  const { translate } = useTranslation(); // Access the translate function

  const categories = [
    { name: translate("sedan"), icon: <IoCarSport /> },
    { name: translate("suv"), icon: <TbCarSuvFilled /> },
    { name: translate("bus"), icon: <FaBus /> },
    { name: translate("truck"), icon: <FaTruckFront /> },
    { name: translate("convertible"), icon: <BiSolidCarGarage /> },
    { name: translate("electric"), icon: "⚡" }, // Keep the emoji for Electric
  ];

  return (
    <div className="category-section">
      <h2>{translate("exploreCategories")}</h2> {/* Translated heading */}
      <div className="category-container">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;