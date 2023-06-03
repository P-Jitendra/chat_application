import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/fetchUser", {
        email,
        password,
      });
      setAuth(true);
      navigate("/dashboard");
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  }

  return (
    <div className="common">
      <div className="loginContainer">
        <div className="heading">Chat App</div>
        <form className="loginBody">
          <input
            type="text"
            placeholder="MobileNo/Email"
            className="name"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Password"
            className="pwd"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="button" onClick={(e) => submit(e)}>
            Login
          </button>
          <span className="registerText">
            Don't have an account, <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
