import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useEffect } from "react";
const backend_url = import.meta.env.VITE_BACKEND_URL;



const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/employee");
  }
}, []);
  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/auth/login`, {
        userName,
        password,
      });
      console.log("Login Successful! Response:", response.data);
      alert("Login Successful!");

      
      localStorage.setItem('token', response.data.token);
      
      if (response.data.roles && response.data.roles.length > 0) {
        localStorage.setItem('role', response.data.roles[0]); 
      }
      localStorage.setItem('userName', response.data.userName);
      navigate('/employee'); 
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
    
    <div className="container mt-5" style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-4" style={{ backgroundColor: '#f8f9fa', color: 'white', border: '1px solid #555' }}> 
            <div className="card-body">
              <h2 className="card-title text-center mb-4" style={{ color: 'black' }}>Login</h2> 
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label" style={{ color: 'Black' }}> 
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