import { useState } from "react";
import axios from "axios"; 
const backend_url = import.meta.env.VITE_BACKEND_URL;
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [roleNames, setRoles] = useState(["USER"]); 
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setRoles((prevRoles) => {
      if (checked) {
        return [...new Set([...prevRoles, value])];
      } else {
        const newRoles = prevRoles.filter((role) => role !== value);
        return newRoles.length === 0 && value !== "USER" ? ["USER"] : newRoles;
      }
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      userName,
      roleNames: roleNames.length > 0 ? roleNames : ["USER"],
    };

    console.log("Submitting:", userData);

    try {
      const response = await axios.post(`${backend_url}/api/auth/register`, userData);

      alert("Registered Successfully!");
      console.log("Registration success:", response.data);
      setName("");
      setEmail("");
      setPassword("");
      setUserName("");
      setRoles(["USER"]); 
    } catch (error) {
      console.error("Registration Error:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        alert(`Error while registering: ${error.response.data.message || 'Check console for details.'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Network error: No response from server. Check your internet connection or server status.");
      } else {
        console.error("Request setup error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5 mb-5" > 
      <div className="row justify-content-center" >
        <div className="col-md-7 col-lg-6" > 
          <div className="card shadow-lg p-4"style={{ backgroundColor: '#f8f9fa', color: 'black', border: '1px solid #555' }}>
            <div className="card-body" color='#fdf'>
              <h2 className="card-title text-center mb-4">Sign Up</h2>
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="form-control"
                    placeholder="Choose a username"
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="name@example.com"
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Create a password"
                    required
                    style={{ backgroundColor: '#444', color: 'white', border: '1px solid #666' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label d-block">Assign Roles:</label> 
                  <div className="d-flex gap-3"> 
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="roleUser"
                        name="roleNames"
                        value="USER"
                        checked={roleNames.includes("USER")}
                        onChange={handleRoleChange}
                        className="form-check-input"
                      />
                      <label htmlFor="roleUser" className="form-check-label">
                        User
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="roleAdmin"
                        name="roleNames"
                        value="ADMIN"
                        checked={roleNames.includes("ADMIN")}
                        onChange={handleRoleChange}
                        className="form-check-input"
                      />
                      <label htmlFor="roleAdmin" className="form-check-label">
                        Admin
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-success btn-lg">
                    Sign Up
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

export default Signup;