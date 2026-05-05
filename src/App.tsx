import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import BrandDashboard from './pages/Dashboard/BrandDashboard';
import InfluencerDashboard from './pages/Dashboard/InfluencerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import FindInfluencers from './pages/FindInfluencers';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Navbar from './components/layout/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/brand" element={<BrandDashboard />} />
        <Route path="/dashboard/influencer" element={<InfluencerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/find" element={<FindInfluencers />} />
        <Route path="*" element={<div className="flex items-center justify-center h-screen pt-20">Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
