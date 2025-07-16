// src/Signup.jsx
import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const[role,setRole]=useState("");

  const handleSignup = async(e) => {
    e.preventDefault();
    try {
      await axios.post("https://springboot-employee-2.onrender.com/api/auth/register", form);
      alert("Registered Successfully!");
    } catch (error) {
      console.error("Registration Error", error);
      alert("Error while registering");
    }
  };

  return (
    <section>
      <h2>Sign Up</h2>
      <div>
        <form onSubmit={handleSignup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br/>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <br/>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br/>
          <label htmlFor="userName">User Name</label>
          <input
            type="text"
            id="userName"
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
           <br />
          <label htmlFor="userRole">User Role</label>
          <input
            type="text"
            id="userRole"
            onChange={(e) => setUserRole(e.target.value)}
          />
          <br />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </section>
  );
};

export default Signup;