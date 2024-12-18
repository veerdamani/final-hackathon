import React, { useState } from "react";
import { auth } from "../init-firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
