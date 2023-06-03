import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import NoPage from "./NoPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [isAuth, setAuth] = useState(false);
  return (
    <div>
      {/* <Dashboard /> */}
      {/* <Login/> */}
      {/* <Register/> */}
      {/* <Home/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="login" element={<Login setAuth={setAuth} />} />
            <Route path="register" element={<Register />} />
            <Route
              path="dashboard"
              element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
