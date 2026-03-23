// pages/Home.jsx
import React from 'react';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Tiers from '../components/Tiers';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import FinalCTA from '../components/FinalCTA';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Tiers />
        <Reviews />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;