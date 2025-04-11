import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../TranslationContext"; // Import useTranslation
import "./Header.css"; // Make sure to create this CSS file for styling

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { translate } = useTranslation(); // Access the translate function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo linked to the homepage */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <h1>KoreaCar</h1> {/* Plain text for the logo */}
        </Link>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            {translate("home")}
          </Link>
          <Link to="/Boutique" onClick={() => setIsMenuOpen(false)}>
            {translate("boutique")}
          </Link>
          <Link to="/search" onClick={() => setIsMenuOpen(false)}>
            {translate("search")}
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            {translate("contact")}
          </Link>
          <Link to="/help" onClick={() => setIsMenuOpen(false)}>
            {translate("help")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;