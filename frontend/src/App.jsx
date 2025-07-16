import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trends from './pages/Trends';
import TwitterPage from './pages/TwitterPage';
import Devlopers from './pages/Devlopers';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/twitter" element={<TwitterPage />} />
            <Route path="/dev" element={<Devlopers/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

