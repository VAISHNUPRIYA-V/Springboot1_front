import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
const backend_url = import.meta.env.VITE_BACKEND_URL;
const EditEmployee = () => {
  const { empId } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!token) {
        navigate('/login');
        alert("Please log in to edit employees.");
        return;
      }
      if (role !== "ADMIN") {
        alert("Access Denied: You do not have permission to edit employees.");
        navigate('/GetEmployees'); 
        return;
      }

      try {
        const response = await axios.get(`${backend_url}/employee/${empId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
      } catch (err) {
        console.error("Error fetching employee for edit:", err);
        setError("Failed to load employee data.");
        if (err.response && err.response.status === 403) {
            alert("Access Denied: You do not have permission to access this employee's data.");
            navigate('/GetEmployees');
        } else if (err.response && err.response.status === 404) {
            alert("Employee not found.");
            navigate('/GetEmployees');
        } else {
            alert("Error fetching employee: " + (err.message || "Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId, token, role, navigate]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || role !== "ADMIN") {
        alert("Authorization error. Please log in as Admin.");
        return;
    }

    try {
      await axios.put(`${backend_url}/employee/${empId}`, employee, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      });
      alert("Employee updated successfully!");
      navigate('/employee'); 
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Failed to update employee: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading employee data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  
  return (
    <div className="container mt-5">
      <h2>Edit Employee: {employee.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success me-2">Update Employee</button>
        <button type="button" onClick={() => navigate('/employee')} className="btn btn-secondary">Cancel</button>
      </form>
    </div>
  );
};

export default EditEmployee;