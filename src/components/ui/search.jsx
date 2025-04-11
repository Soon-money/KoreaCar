import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Import search icon
import { RiArrowGoBackFill } from "react-icons/ri"; // Import back button icon
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import Header from "./Header"; // Import Header
import Stickybottommenu from "./Stickybottommenu"; // Import Stickybottommenu
import "./search.css";
import Carcard from "./Carcard";

function Search({ cars = [], showAvailableCars = false }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { translate } = useTranslation(); // Access the translate function

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/search?query=${tag}`);
  };

  const tags = [
    "santafe",
    "avante",
    "carnival",
    "sorento",
    "k3",
    "grandeur",
    "lexus",
    "palisade",
    "toyota",
    "tesla",
  ];

  return (
    <>
      {/* Conditionally render the Header */}
      {location.pathname === "/search" && <Header />}
      <div className="search-container">
        {/* Back Button - Only show on the Search page */}
        {location.pathname === "/search" && (
          <button className="back-button" onClick={() => navigate("/")}>
            <RiArrowGoBackFill /> {translate("goBack")} {/* Translated text */}
          </button>
        )}

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={translate("searchPlaceholder")} // Translated placeholder
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        {/* Tags Section */}
        <div className="tags-container">
          {tags.map((tag) => (
            <span key={tag} className="tag" onClick={() => handleTagClick(tag)}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Available Cars Section */}
        {showAvailableCars && (
          <div className="available-cars">
            <h2>{translate("availableCars")}</h2> {/* Translated heading */}
            <div className="car-list">
              {cars.length > 0 ? (
                cars.map((car) => <Carcard key={car.id} car={car} />)
              ) : (
                <p>{translate("noCarsAvailable")}</p> 
              )}
            </div>
          </div>
        )}
      </div>
      <Stickybottommenu /> {/* Include Stickybottommenu */}
    </>
  );
}

export default Search;