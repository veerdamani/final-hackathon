import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    age: '',
    bloodGroup: '',
    contactNumber: '',
    address: '',
    userType: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.userName || !formData.email || !formData.password || !formData.age) {
      setError('Please fill all the required fields.');
      return false;
    }
    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 55) {
      setError('Age must be between 18 and 55.');
      return false;
    }
    if (!/^\d{11}$/.test(formData.contactNumber)) {
      setError('Contact number must be 11 digits.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...formData,
        createdAt: new Date().toISOString()
      });

      Swal.fire({
        icon: 'success',
        title: 'Registration Complete!',
        text: 'Welcome to our community!',
        confirmButtonColor: '#ff6500'
      }).then(() => navigate('/login'));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>
        <p>Join our blood donation network</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Full Name*</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email*</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password*</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age*</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="userType" className="form-label">I am a*</label>
            <select
              className="form-select"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>

        <div className="mt-3">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
