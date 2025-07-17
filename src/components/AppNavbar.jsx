import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate('/login');
  };

  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">EMS Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="me-autome-auto mb-2 mb-lg-0">
            <Nav.Link as={Link} to="/" className="me-3">Home</Nav.Link>
            <Nav.Link as={Link} to="/employee" className="me-3">Employees</Nav.Link>

            {token && role === "ADMIN" && (
              <Nav.Link as={Link} to="/add-employee" className="me-3">
                Add Employee
              </Nav.Link>
            )}

            {!token ? (
              <>
                <Nav.Link as={Link} to="/login" className="me-3">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={handleLogout} className="me-3">Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
