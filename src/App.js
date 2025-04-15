import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AllCar from './components/ui/AllCar';
import Cardetails from './components/ui/Cardetails'; 
import Search from './components/ui/search'; 
import Contact from './components/ui/Contact';
import Help from './components/ui/Help';
import LanguageSwitcher from './components/ui/LanguageSwitcher';
import AddListing from './AddListing/AddListing';
import Admin from './Admin/Admin';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
     <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/AllCar" element={<AllCar />} />
        <Route path="/cardetails/:id" element={<Cardetails />} /> 
        <Route path="/search" element={<Search />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/AddListing" element={<AddListing />}/>
        <Route path="/AddListing/:id" element={<AddListing />}/>
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Login" element={<Login />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;