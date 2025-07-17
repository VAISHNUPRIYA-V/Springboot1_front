import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/AppNavbar';
import Login from './components/Login';
import Signup from './components/Signup';
import './index.css';
import GetEmployees from './components/GetEmployees';
import EditEmployee from './components/EditEmployee'; // <--- NEW Import

const Home = () => (
  <div className="text-center mt-5">
    <h2>Welcome to the EMS Dashboard!</h2>
    <p>Use the navigation above to explore.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<GetEmployees/>} />
          {/* <Route path="/employee" element={<GetEmployees/>} />  <--- Or use this if you change your navbar link */}
          <Route path="/employee/edit/:empId" element={<EditEmployee />} /> {/* <--- NEW ROUTE */}

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;