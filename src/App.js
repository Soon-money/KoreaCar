import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.js';
import AllCar from './components/ui/AllCar.jsx';
import Cardetails from './components/ui/Cardetails.jsx';
import Search from './components/ui/search.jsx';
import Contact from './components/ui/Contact.jsx';
import Help from './components/ui/Help.jsx';
import LanguageSwitcher from './components/ui/LanguageSwitcher.jsx';
import AddListing from './AddListing/AddListing.jsx';
import Admin from './Admin/Admin.jsx';
import RecentCar from './components/ui/RecentCar.jsx';
import Intro from './components/ui/Intro.jsx'; // Import the Intro component
import MakeSearch from "./Search/index.jsx"; // Import the MakeSearch component

import CategorySearch from './Search/[Category)]/index.jsx';


function App() {
  const [introFinished, setIntroFinished] = useState(false); // State to track if the intro is finished

  return (
    <BrowserRouter>
      {!introFinished ? (
        <Intro onFinish={() => setIntroFinished(true)} /> // Show the intro screen
      ) : (
        <>
          <LanguageSwitcher />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/AllCar" element={<AllCar />} />
            <Route path="/cardetails/:id" element={<Cardetails />} />
            <Route path="/RecentCar" element={<RecentCar />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/make/:make" element={<MakeSearch />} /> {/* Dynamic make search */}
            <Route path="/search/:query" element={<Search />} />
            <Route path="/cars/category/:category" element={<CategorySearch />} /> {/* Updated route */}
           
           
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/AddListing" element={<AddListing />} />
            <Route path="/AddListing/:id" element={<AddListing />} />
            <Route path="/Admin" element={<Admin />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;