import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const GetEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // State for Assign Task Modal
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [employeeToAssignTask, setEmployeeToAssignTask] = useState(null); // To store which employee is selected

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/employee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees", err);
        if (err.response && err.response.status === 403) {
          alert("Access Denied: You do not have permission to view employees.");
        } else {
          alert("Error fetching employees: " + (err.message || "Unknown error"));
        }
      }
    };

    if (token) {
      fetchEmployees();
    } else {
      navigate('/login');
      alert("Please log in to view employees.");
    }
  }, [token, navigate]);

  const handleDelete = async (empId) => {
    try {
      await axios.delete(`http://localhost:8080/employee/${empId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(employees.filter((emp) => emp.empId !== empId));
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee", err);
      if (err.response && err.response.status === 403) {
        alert("Access Denied: You do not have permission to delete employees.");
      } else {
        alert("Delete failed: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleEdit = (empId) => {
    navigate(`/employee/edit/${empId}`);
  };

  const handleViewDetails = (empId) => {
    navigate(`/employee/details/${empId}`);
  };

  // --- NEW: Assign Task Modal Functions ---
  const handleOpenAssignTaskModal = (employee) => {
    setEmployeeToAssignTask(employee);
    setNewTaskDescription(''); // Clear previous input
    setShowAssignTaskModal(true);
  };

  const handleCloseAssignTaskModal = () => {
    setShowAssignTaskModal(false);
    setEmployeeToAssignTask(null);
    setNewTaskDescription('');
  };

  const handleAssignTaskSubmit = async () => {
    if (!newTaskDescription.trim()) {
      alert("Task description cannot be empty.");
      return;
    }
    if (!employeeToAssignTask || !token || role !== "ADMIN") {
      alert("Authorization error or no employee selected. Please log in as Admin.");
      return;
    }

    try {
      await axios.post(`http://localhost:8080/task/id/${employeeToAssignTask.empId}`, {
        task: newTaskDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      alert(`Task assigned to ${employeeToAssignTask.name} successfully!`);
      handleCloseAssignTaskModal(); // Close modal and reset state
      // No need to re-fetch employees here, as task assignment doesn't change employee list.
      // The task will appear when viewing details of that employee.
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task: " + (err.response?.data || err.message || "Unknown error"));
    }
  };
  // --- END NEW ---

  return (
    <div className="container mt-4">
      <h2>Employee List</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th> {/* Always visible for View Details */}
            {role === "ADMIN" && <th>Admin Actions</th>} {/* New column for Admin-only buttons */}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.empId}>
              <td>{emp.empId}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <button
                  onClick={() => handleViewDetails(emp.empId)}
                  className="btn btn-info btn-sm"
                >
                  View Details
                </button>
              </td>
              {role === "ADMIN" && ( // Show Admin Actions column content only if Admin
                <td>
                  <button
                    onClick={() => handleEdit(emp.empId)}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.empId)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Delete
                  </button>
                  {/* --- NEW: Assign Task button for Admin --- */}
                  <button
                    onClick={() => handleOpenAssignTaskModal(emp)}
                    className="btn btn-success btn-sm"
                  >
                    Assign Task
                  </button>
                  {/* --- END NEW --- */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- NEW: Assign Task Modal --- */}
      <Modal show={showAssignTaskModal} onHide={handleCloseAssignTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Task to {employeeToAssignTask?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="newTaskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssignTaskModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAssignTaskSubmit}>
            Assign Task
          </Button>
        </Modal.Footer>
      </Modal>
      {/* --- END NEW --- */}
    </div>
  );
};

export default GetEmployees;