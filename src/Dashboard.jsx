import React from "react";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import "./App.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Dashboard;
