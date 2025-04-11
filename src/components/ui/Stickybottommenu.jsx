import React from "react";
import "./Stickybottommenu.css"; // Make sure to create this CSS file for styling
import { GoHomeFill } from "react-icons/go"; // Home icon
import { FaSearch, FaStore, FaPhoneAlt } from "react-icons/fa"; // Search, Store, and Contact icons
import { Link } from "react-router-dom"; // Import Link from React Router
import { useTranslation } from "../../TranslationContext"; // Import useTranslation

function Stickybottommenu() {
  const { translate } = useTranslation(); // Access the translate function

  return (
    <div className="sticky-menu">
      <Link to="/" className="menu-item"> {/* Link to HomePage */}
        <GoHomeFill />
        <span>{translate("home")}</span> {/* Translated text */}
      </Link>
      <Link to="/search" className="menu-item"> {/* Link to Search */}
        <FaSearch />
        <span>{translate("search")}</span> {/* Translated text */}
      </Link>
      <Link to="/boutique" className="menu-item"> {/* Link to Boutique (Store) */}
        <FaStore />
        <span>{translate("boutique")}</span> {/* Translated text */}
      </Link>
      <Link to="/contact" className="menu-item"> {/* Link to Contact */}
        <FaPhoneAlt />
        <span>{translate("contact")}</span> {/* Translated text */}
      </Link>
    </div>
  );
}

export default Stickybottommenu;