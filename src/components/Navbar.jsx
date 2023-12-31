import React from "react";
import { useNavigate } from "react-router-dom";
// import store from "../store";

const Navbar = (props) => {
  const userInfo = props.userInfo;
  const sendMessage = props.sendMessage;
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    // store.dispatch({ type: "loggedOutUser", email: props.userId });
    // const newState = store.getState();
    // console.log(`Printing State after logout : ${JSON.stringify(newState)}`);
    sendMessage(JSON.stringify({ type: "close", clientId: userInfo.mobileno }));
    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="logo">Chat App</span>
      <div className="user">
        <img
          src="https://images.unsplash.com/photo-1590341328520-63256eb32bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVnbyUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=700&q=60"
          alt=""
          className="image"
        />
        <span>{userInfo.username}</span>
        <button className="button" onClick={(e) => submit(e)}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
