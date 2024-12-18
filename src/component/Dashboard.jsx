import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/home.css';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  FaUsers, FaHandHoldingHeart, FaHeartbeat, FaTint, FaHospital, FaQuoteLeft,
} from 'react-icons/fa';

const Home = () => {
  const [stats, setStats] = useState({ totalUsers: 0, donors: 0, recipients: 0 });
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const navigate = useNavigate();

 

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const donorsSnap = await getDocs(query(collection(db, 'users'), where('userType', '==', 'donor')));
      const recipientsSnap = await getDocs(query(collection(db, 'users'), where('userType', '==', 'receiver')));
      setStats({
        totalUsers: usersSnap.size,
        donors: donorsSnap.size,
        recipients: recipientsSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedBloodGroup) return;
    setLoading(true);
    try {
      const recipientsSnap = await getDocs(query(
        collection(db, 'users'),
        where('userType', '==', 'receiver'),
        where('bloodGroup', '==', selectedBloodGroup),
      ));
      const recipientsData = recipientsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecipients(recipientsData);
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Donate Blood, Save Lives
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A single drop can bring a smile to someone’s life.
            </motion.p>
            <div className="blood-search">
              <select
                className="blood-dropdown"
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Find Recipients'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <FaHandHoldingHeart className="stat-icon" />
          <h3>Donors</h3>
          <p>{stats.donors}</p>
        </div>
        <div className="stat-card">
          <FaHeartbeat className="stat-icon" />
          <h3>Recipients</h3>
          <p>{stats.recipients}</p>
        </div>
      </div>

      <div className="benefits-section">
        <h2 className="section-title">Why Donate Blood?</h2>
        <div className="benefits-grid">
          <motion.div className="benefit-card" whileHover={{ scale: 1.05 }}>
            <FaHeartbeat className="benefit-icon" />
            <h3>Save Lives</h3>
            <p>Each blood donation impacts three lives!</p>
          </motion.div>
          <motion.div className="benefit-card" whileHover={{ scale: 1.05 }}>
            <FaTint className="benefit-icon" />
            <h3>Health Benefits</h3>
            <p>Maintains a healthy heart and iron levels.</p>
          </motion.div>
          <motion.div className="benefit-card" whileHover={{ scale: 1.05 }}>
            <FaHospital className="benefit-icon" />
            <h3>Free Checkups</h3>
            <p>Get a free health screening at every donation.</p>
          </motion.div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">What Donors Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <FaQuoteLeft className="testimonial-icon" />
            <p>"It’s a small act of kindness with a huge impact. I feel honored to donate blood regularly."</p>
            <h4>- Madan Bhanani</h4>
          </div>
          <div className="testimonial-card">
            <FaQuoteLeft className="testimonial-icon" />
            <p>"The process was smooth and easy. I encourage everyone to try it once."</p>
            <h4>- Priya Sharma</h4>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
