import React from 'react';
import '../css/Header.css'; 
import { useNavigate } from 'react-router-dom';
import ImageLogo from '../images/blood-donation.png';


const Header = ({username}) => {

  const navigate = useNavigate()

  return (
    <header className="header">
      {/* Left Section: Username and Logout Button */}
      <div className="left-section">
        <span className="username">{username}</span>
        <button className="logout-btn" onClick={() =>navigate('/login')} >Logout</button>
      </div>

      {/* Center Section: Navigation Links */}
      <nav className="nav-links">
        <a href="/dashboard">Home</a>
        <a href="/donors">Donators</a>
        <a href="/profile">My Profile</a>
      </nav>

      {/* Right Section: Company Logo */}
      <div className="logo">
        <img src={ImageLogo} alt="Company Logo" />
      </div>
    </header>
  );
};

export default Header;
