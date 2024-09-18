import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function RegisterPage() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/register", { name, email, password })
      .then((result) => {
        console.log(result)
        navigate('/login')
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
      <hr />

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          <b>Name</b>
        </label>
        <input
          type="text"
          placeholder="Enter Name"
          name="name"
          id="name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          id="psw"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* <label htmlFor="psw-repeat">
          <b>Repeat Password</b>
        </label>
        <input
          type="password"
          placeholder="Repeat Password"
          name="psw-repeat"
          id="psw-repeat"
          required
        /> */}
        <hr />

        <p>
          By creating an account you agree to our{" "}
          <a href="/">Terms & Privacy</a>.
        </p>
        <button type="submit" className="registerbtn">
          Register
        </button>
      </form>

      <div className="container signin">
        <p>
          Already have an account? <a href="/">Sign in</a>.
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
