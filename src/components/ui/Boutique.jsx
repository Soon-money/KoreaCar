import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold4Fill } from 'react-icons/ri'; // Import the icon
import './Boutique.css';

function Boutique() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  const boutiques = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Boutique ${index + 1}`,
    logo: 'https://via.placeholder.com/150',
  }));

  const handleCardClick = (id) => {
    navigate(`/boutique/${id}`); // Navigate to the boutique's page
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <RiMenuUnfold4Fill />
      </button>

      {/* Hidden Left-Side Menu */}
      <div className={`hidden-menu ${isMenuOpen ? 'visible' : ''}`}>
        <div className="menu-content">
          {boutiques.map((boutique) => (
            <div
              key={boutique.id}
              className="menu-item"
              onClick={() => handleCardClick(boutique.id)}
            >
              <img
                src={boutique.logo}
                alt={`${boutique.name} Logo`}
                className="menu-logo"
              />
              <span className="menu-name">{boutique.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Boutique;