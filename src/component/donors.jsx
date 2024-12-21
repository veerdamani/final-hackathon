import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to configure Firebase correctly
// import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaTint, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import '../css/donors.css'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Header from './Header';


function Donors() {
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
    <>
      <Header />
    <div className="donors-page">
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
                  src={donor.profileImageUrl || 'data:image/jpeg;base64,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'}
                  alt={donor.userName}
                />
                <span className="blood-group-badge">{donor.bloodGroup}</span>
              </div>
              <div className="donor-info">
                <h3><FaUser /> {donor.userName}</h3>
                <p><FaMapMarkerAlt /> {donor.address}</p>
                <p><FaPhone /> {donor.contactNumber}</p>
                <p><FaEnvelope /> {donor.email}</p>
                {/* <p><FaTint /> Last Donation: {donor.lastDonation || 'N/A'}</p> */}
              </div>
              {/* <button className="contact-btn">Contact Donor</button> */}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default Donors;
