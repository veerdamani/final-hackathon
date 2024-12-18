import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { FaUser, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { MdEmail, MdBloodtype } from 'react-icons/md';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
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
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError('User profile not found.');
          }

          const donationsSnapshot = await getDoc(doc(db, 'donations', user.uid));
          if (donationsSnapshot.exists()) {
            setDonationHistory(donationsSnapshot.data().history || []);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setEditedData(userData);
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSaveChanges = async () => {
    try {
      // Save changes logic
      // Example: Save `editedData` to Firestore
      setUserData(editedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="profile-container">
          <div className="error-message">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-image">
              <img src={userData?.profileImageUrl || '/default-avatar.png'} alt="Profile" />
            </div>
            <div className="profile-details">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editedData.userName || ''}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                  />
                  <input
                    type="number"
                    value={editedData.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                  <button onClick={handleSaveChanges}>Save</button>
                  <button onClick={handleEditToggle}>Cancel</button>
                </>
              ) : (
                <>
                  <h1 className="profile-name">{userData?.userName.toUpperCase() || 'User Name'}</h1>
                  <button className="edit-btn" onClick={handleEditToggle}>
                    Edit Profile
                  </button>
                  <div className="info-item">
                    <FaUser />
                    <span>Age: {userData?.age || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <MdBloodtype />
                    <span>Blood Group: {userData?.bloodGroup || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <FaMapMarkerAlt />
                    <span>Location: {userData?.address || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <FaPhone />
                    <span>Phone: {userData?.contactNumber || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <MdEmail />
                    <span>Email: {userData?.email || 'Not specified'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="donation-history">
          <h2>Donation History</h2>
          {donationHistory.length > 0 ? (
            donationHistory.map((donation, index) => (
              <div key={index} className="history-card">
                <div className="history-icon">
                  <FaTint />
                </div>
                <div className="history-details">
                  <h3>Donation at {donation.location || 'Unknown Location'}</h3>
                  <p>Date: {donation.date || 'Unknown Date'}</p>
                  <span className="donation-type">{donation.type || 'N/A'}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-donations">
              <p>No donation history available</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
