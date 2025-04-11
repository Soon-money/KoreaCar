import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Boutique from './components/ui/Boutique';
import BoutiqueDetails from './components/ui/BoutiqueDetails';
import Cardetails from './components/ui/Cardetails'; 
import Search from './components/ui/search'; 
import Contact from './components/ui/Contact';
import Help from './components/ui/Help';
import LanguageSwitcher from './components/ui/LanguageSwitcher';

function App() {
  return (
    <BrowserRouter>
     <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/boutique/:id" element={<BoutiqueDetails />} />
        <Route path="/cardetails/:id" element={<Cardetails />} /> 
        <Route path="/search" element={<Search />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;