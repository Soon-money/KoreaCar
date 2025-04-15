import React from 'react';
import Header from '../components/ui/Header';
import Hero from '../components/ui/Hero';
import Search from '../components/ui/search'; // Import the Search component
import AllCar from '../components/ui/AllCar';
import Category from '../components/ui/Category';
import Listings from '../components/ui/Listings';
import Howtobuy from '../components/ui/Howtobuy';
import Footer from '../components/ui/Footer';
import Stickybottommenu from '../components/ui/Stickybottommenu';



function HomePage() {
  return (
    <div className="homepage">
      <Header />
      
      <Search /> {/* Add the Search component here */}
      <Hero />
      <Category />
      <Listings />
      <AllCar />
      <Howtobuy />
      <Footer />
      <Stickybottommenu />
    </div>
  );
}

export default HomePage;