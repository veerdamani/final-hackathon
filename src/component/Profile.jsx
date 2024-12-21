import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { FaUser, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { MdEmail, MdBloodtype } from 'react-icons/md';
import Footer from './Footer';
import '../css/profile.css';
import Header from './Header';

const Profile = () => {
  const [userData, setUserData] = useState([]);
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

          const donationsSnapshot = await getDoc(doc(db, 'users', user.uid));
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
        <Header />
        <div className="profile-container">
          <div className="error-message">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header  />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-image">
              <img src={userData?.profileImageUrl || 'data:image/jpeg;base64,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'} alt="Profile" />
            </div>
            <div className="profile-details">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    placeholder='UserName'
                    value={userData.userName || ''}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder='Enter your Age'
                    value={editedData.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                  <button onClick={handleSaveChanges}>Save</button>
                  <button onClick={handleEditToggle}>Cancel</button>
                </>
              ) : (
                <>
                  <h1 className="profile-name">{userData?.userName || 'User Name'}</h1>
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
