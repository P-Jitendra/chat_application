import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import NoPage from "./NoPage";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function App() {
  // const location = useLocation();
  // const state = location.state;

  // // Use the attributes from the state object with optional chaining and nullish coalescing
  // const isLoggedIn = state?.isLoggedIn ?? false;
  // const username = state?.username ?? "";
  // const role = state?.role ?? "";
  const location = useLocation();
  const isLoggedIn = location.state && location.state.isLoggedIn;
  const userinfo = location.state && location.state.userinfo;
  return (
    <div>
      {/* <Dashboard /> */}
      {/* <Login/> */}
      {/* <Register/> */}
      {/* <Home/> */}
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="dashboard"
            element={
              isLoggedIn ? (
                <Dashboard userInfo={userinfo} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
