import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        userName,
        password,
      });
      console.log("Login Successful! Response:", response.data);
      alert("Login Successful!");

      // --- CRITICAL FIX: STORE THE TOKEN AND ROLE ---
      localStorage.setItem('token', response.data.token);
      // Assuming your backend sends 'roles' and 'userName' in the response.data
      if (response.data.roles && response.data.roles.length > 0) {
        localStorage.setItem('role', response.data.roles[0]); // Store the first role for simplicity
      }
      localStorage.setItem('userName', response.data.userName);
      // --- END CRITICAL FIX ---

      // Redirect the user to the protected route (e.g., /employee or /dashboard)
      navigate('/Employee'); // Or '/employee' if you change your route definition

      // Optionally clear form after successful login
      setUserName("");
      setPassword("");

    } catch (e) {
      console.error("Login Error:", e.response ? e.response.data : e.message);
      alert(
        "Invalid Credentials: " +
          (e.response && e.response.data.message
            ? e.response.data.message
            : "Please check your username and password.")
      );
    }
    console.log("Form Submission Attempted.");
  }

  return (
    // ... rest of your Login component JSX ...
    // Make sure your styling for the card, labels, and inputs is consistent with dark theme if you still want it:
    <div className="container mt-5" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4" style={{ backgroundColor: '#f8f9fa', color: 'white', border: '1px solid #555' }}> {/* Darker card background */}
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{ color: 'black' }}>Login</h2> {/* White title */}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label" style={{ color: 'Black' }}> {/* White label */}
                    User Name
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    value={userName}
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label" style={{ color: 'black' }}> {/* White label */}
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    value={password}
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: 'white' }}>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;