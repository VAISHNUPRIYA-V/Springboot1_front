import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/AppNavbar';
import Login from './components/Login';
import Signup from './components/Signup';
import './index.css';
import GetEmployees from './components/GetEmployees';
import EditEmployee from './components/EditEmployee';
import ViewEmployeeDetails from './components/ViewEmployeeDetails';
import AddEmployee from './components/AddEmployee';

const Home = () => (
  <div className="text-center mt-5">
    <h2>Welcome to the EMS Dashboard!</h2>
    <p>Use the navigation above to explore.</p>
  </div>
);
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employee" element={<GetEmployees/>} />
          <Route path="/employee/edit/:empId" element={<EditEmployee />} /> 
          <Route path="/employee/details/:empId" element={<ViewEmployeeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/employee" element={<ProtectedRoute><GetEmployees /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;