import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to configure Firebase correctly
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaTint, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import './donors.css'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredDonors, setFilteredDonors] = useState([]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const usersRef = collection(db, 'users');
      const donorsQuery = query(usersRef, where('userType', '==', 'donor'));

      const donorsSnapshot = await getDocs(donorsQuery);
      const donorsData = donorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDonors(donorsData);
      setFilteredDonors(donorsData);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const handleBloodGroupChange = (group) => {
    setSelectedBloodGroup(group);
    filterDonors(group, selectedCity);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    filterDonors(selectedBloodGroup, city);
  };

  const filterDonors = (bloodGroup, city) => {
    let filtered = [...donors];
    if (bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === bloodGroup);
    }
    if (city) {
      filtered = filtered.filter(donor =>
        donor.address.toLowerCase().includes(city.toLowerCase())
      );
    }
    setFilteredDonors(filtered);
  };

  const resetFilters = () => {
    setSelectedBloodGroup('');
    setSelectedCity('');
    setFilteredDonors(donors);
  };

  return (
    <div className="donors-page">
      <Navbar />
      <div className="donors-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="filters-section"
        >
          <h2>Find Blood Donors</h2>
          <div className="filters">
            <select
              value={selectedBloodGroup}
              onChange={(e) => handleBloodGroupChange(e.target.value)}
              className="filter-dropdown"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Enter city name..."
              className="filter-input"
            />

            <button onClick={resetFilters} className="reset-btn">
              Show All Donors
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="donors-grid"
        >
          {filteredDonors.map(donor => (
            <motion.div
              key={donor.id}
              whileHover={{ scale: 1.02 }}
              className="donor-card"
            >
              <div className="donor-image">
                <img
                  src={donor.profileImageUrl || '/default-avatar.png'}
                  alt={donor.userName}
                />
                <span className="blood-group-badge">{donor.bloodGroup}</span>
              </div>
              <div className="donor-info">
                <h3><FaUser /> {donor.userName}</h3>
                <p><FaMapMarkerAlt /> {donor.address}</p>
                <p><FaPhone /> {donor.contactNumber}</p>
                <p><FaEnvelope /> {donor.email}</p>
                <p><FaTint /> Last Donation: {donor.lastDonation || 'N/A'}</p>
              </div>
              <button className="contact-btn">Contact Donor</button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Donors;
