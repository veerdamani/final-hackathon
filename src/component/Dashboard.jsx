import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <h2>Dashboard</h2>
      <Button variant="success" onClick={() => navigate("/donate")} className="me-3">
        Donate Blood
      </Button>
      <Button variant="info" onClick={() => navigate("/receive")}>Receive Blood</Button>
    </Container>
  );
}

export default Dashboard;
