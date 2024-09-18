import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import classNames from "classnames/bind";
// const cx = classNames.bind(styles);

function LoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "Login successful") {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
      <hr />

      <form onSubmit={handleSubmit}>
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

        <hr />

        <button type="submit" className="loginbtn">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;