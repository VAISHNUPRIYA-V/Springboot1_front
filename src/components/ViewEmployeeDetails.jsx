import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap';
const backend_url = import.meta.env.VITE_BACKEND_URL;
const ViewEmployeeDetails = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        alert("Please log in to view employee tasks.");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${backend_url}/task/id/${empId}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.warn("Unexpected response format. Expected an array.");
          setTasks([]);
        }

      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks.");

        const status = err.response?.status;
        if (status === 403) {
          alert("Access denied.");
        } else if (status === 404) {
          alert("Tasks not found.");
        } else {
          alert("An error occurred.");
        }

        navigate('/employee');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [empId, token, navigate]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `${backend_url}/task/status/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.taskId === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status", err);
      alert("Could not update task status.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading tasks...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Tasks for Employee ID: {empId}</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.taskId || task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>{task.task}</div>
              {role === "ADMIN" ? (
                <Form.Select
                  size="sm"
                  style={{ width: "200px" }}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.taskId || task.id, e.target.value)}
                >
                  <option>Yet to Complete</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </Form.Select>
              ) : (
                <span className="badge bg-info">{task.status}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/employee')} className="btn btn-secondary mt-4">
        Back to Employee List
      </button>
    </div>
  );
};

export default ViewEmployeeDetails;
