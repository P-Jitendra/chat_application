import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import useWebSocket from "react-use-websocket";
// import store from "./store";

//const WS_URL = "ws://127.0.0.1:8181";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const { readyState } = useWebSocket(WS_URL);
  const submit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/fetchUser", {
        email: email,
        password: password,
      })
      .then((response) => {
        // console.log("Printing response value : \n", response);
        if (response.data.status === "success") {
          // store.dispatch({ type: "loggedUser", email: email });
          // const CurrState = store.getState();
          // console.log(
          //   `Initial State after login: ${JSON.stringify(CurrState)}`
          // );
          const user_info = response.data.user_info;
          let user_contacts = [];
          // axios
          //   .get(`http://localhost:4000/allContacts/${user_info.mobileno}`)
          //   .then((response) => {
          //     if (response.data.status === "success") {
          //       user_contacts = response.data.user_contacts;
          //       console.log(
          //         `Fetched contacts successfully, Contacts : ${JSON.stringify(
          //           user_contacts
          //         )}`
          //       );
          //       setChats(user_contacts);
          //     } else {
          //       console.log(`Printing invalid status data : ${response.data}`);
          //     }
          //   })
          //   .catch((error) => {
          //     console.log(`Received error while fetching contacts : ${error}`);
          //   });
          console.log(`Websocket Status : `);
          console.log(`user_contacts : ${user_contacts}`);
          navigate("/dashboard", {
            state: {
              isLoggedIn: true,
              userinfo: {
                email: email,
                username: user_info.username,
                mobileno: user_info.mobileno,
              },
            },
          });
        } else {
          setError(response.data.msg);
          //alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
        //alert(error.data);
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
          <span style={{ color: "red" }}>{error}</span>
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
