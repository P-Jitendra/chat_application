import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:4000/", {
        name,
        email,
        mobileNo,
        password,
      })
      .then((response) => {
        console.log("Printing response value : \n", response);
        if (response.data.status === "success") {
          navigate("/login");
        } else {
          setError(response.data.msg);
          //alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(`Received error : ${error}`);
        alert(error.data);
      });
  }

  return (
    <div className="common">
      <div className="registerContainer">
        <div className="heading">Chat App</div>
        <form className="registerBody">
          <span style={{ color: "red" }}>{error}</span>
          <input
            type="text"
            placeholder="Name"
            className="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Email"
            className="commonInput"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="MobileNo"
            className="commonInput"
            onChange={(e) => {
              setMobileNo(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Password"
            className="commonInput"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Confirm Password"
            className="commonInput"
          />
          <button className="button" onClick={(e) => submit(e)}>
            Register
          </button>
          <span className="loginText">
            Already have an account, <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
