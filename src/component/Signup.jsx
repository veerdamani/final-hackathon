import React, { useState } from "react";
import { auth , db , database } from "../init-firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    googleLink: "",
    age: "",
    mobile: "",
    address: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        googleLink: formData.googleLink,
        age: formData.age,
        mobile: formData.mobile,
        address: formData.address
      });
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Signup</h2>
      <Form onSubmit={handleSignup}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Google Link</Form.Label>
          <Form.Control type="text" name="googleLink" value={formData.googleLink} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Signup
        </Button>
      </Form>
    </Container>
  );
}

export default Signup;
