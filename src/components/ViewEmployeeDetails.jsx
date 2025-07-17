import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewEmployeeDetails = () => {
  const { empId } = useParams(); // Get empId from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role"); // Role might not be needed if this endpoint is public/user-accessible

  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!token) {
        navigate('/login');
        alert("Please log in to view employee details.");
        return;
      }

      try {
        // Assuming your backend has an endpoint like /employee/{id}/details
        // that returns employee info AND tasks. Adjust URL as needed.
        const response = await axios.get(`http://localhost:8080/employee/${empId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data.employee); // Assuming employee data is under 'employee' key
        setTasks(response.data.tasks || []); // Assuming tasks are under 'tasks' key, default to empty array
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load employee details.");
        if (err.response && err.response.status === 403) {
            alert("Access Denied: You do not have permission to view these details.");
            navigate('/GetEmployees'); // Redirect to employee list if not authorized
        } else if (err.response && err.response.status === 404) {
            alert("Employee or details not found.");
            navigate('/GetEmployees');
        } else {
            alert("Error fetching details: " + (err.message || "Unknown error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [empId, token, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading employee details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!employee) {
    return <div className="alert alert-warning mt-5">Employee data not found.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Employee Details</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{employee.name}</h5>
          <p className="card-text"><strong>ID:</strong> {employee.empId}</p>
          <p className="card-text"><strong>Email:</strong> {employee.email}</p>
          {/* Add more employee details here if your backend returns them */}
          {employee.department && <p className="card-text"><strong>Department:</strong> {employee.department}</p>}
          {employee.phone && <p className="card-text"><strong>Phone:</strong> {employee.phone}</p>}
        </div>
      </div>

      <h3 className="mt-4">Assigned Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks assigned to this employee.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.taskId || task.id} className="list-group-item">
              <strong>{task.name || task.title}</strong>: {task.description || 'No description'}
              {task.status && ` (Status: ${task.status})`}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/GetEmployees')} className="btn btn-secondary mt-4">
        Back to Employee List
      </button>
    </div>
  );
};

export default ViewEmployeeDetails;