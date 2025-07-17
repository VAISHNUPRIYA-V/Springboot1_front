import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const GetEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [employeeToAssignTask, setEmployeeToAssignTask] = useState(null);

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
        if (err.response?.status === 403) {
          alert("Access Denied: You do not have permission to view employees.");
        } else {
          alert("Error fetching employees: " + (err.message || "Unknown error"));
        }
      }
    };

    if (token) {
      fetchEmployees();
    } else {
      navigate("/login");
      alert("Please log in to view employees.");
    }
  }, [token, navigate]);

  const handleDelete = async (empId) => {
    try {
      await axios.delete(`http://localhost:8080/employee/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((emp) => emp.empId !== empId));
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee", err);
      alert("Delete failed: " + (err.message || "Unknown error"));
    }
  };

  const handleEdit = (empId) => navigate(`/employee/edit/${empId}`);
  const handleViewDetails = (empId) => navigate(`/employee/details/${empId}`);

  const handleOpenAssignTaskModal = (employee) => {
    setEmployeeToAssignTask(employee);
    setNewTaskDescription("");
    setShowAssignTaskModal(true);
  };

  const handleCloseAssignTaskModal = () => {
    setShowAssignTaskModal(false);
    setEmployeeToAssignTask(null);
    setNewTaskDescription("");
  };

  const handleAssignTaskSubmit = async () => {
    if (!newTaskDescription.trim()) {
      alert("Task description cannot be empty.");
      return;
    }
    if (!employeeToAssignTask || !token || role !== "ADMIN") {
      alert("Authorization error or no employee selected.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/task/id/${employeeToAssignTask.empId}`,
        { task: newTaskDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(`Task assigned to ${employeeToAssignTask.name} successfully!`);
      handleCloseAssignTaskModal();
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task: " + (err.response?.data || err.message));
    }
  };
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Employee List</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search employees by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
            {role === "ADMIN" && <th>Admin Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
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
              {role === "ADMIN" && (
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
                  <button
                    onClick={() => handleOpenAssignTaskModal(emp)}
                    className="btn btn-success btn-sm"
                  >
                    Assign Task
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>


      <Modal show={showAssignTaskModal} onHide={handleCloseAssignTaskModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Task to {employeeToAssignTask?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newTaskDescription">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
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
    </div>
  );
};

export default GetEmployees;
