import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/fetchUser", {
        email: email,
        password: password,
      })
      .then((response) => {
        console.log("Printing response value : \n", response);
        if (response.data.status === "success") {
          navigate("/dashboard", { state: true });
        } else {
          setError(response.data.msg);
          //alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.data);
      });
  };
  // async function submit(e) {
  //   e.preventDefault();
  //   try {
  //     await axios.post("http://localhost:4000/fetchUser", {
  //       email,
  //       password,
  //     });
  //     setAuth(true);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     console.log(`Error : ${error}`);
  //   }
  // }

  return (
    <div className="common">
      <div className="loginContainer">
        <div className="heading">Chat App</div>

        <form className="loginBody">
          <span style={{color : "red"}}>{error}</span>
          <input
            type="text"
            placeholder="MobileNo/Email"
            className="name"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
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
