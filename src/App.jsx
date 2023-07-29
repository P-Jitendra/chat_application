import "./App.css";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import NoPage from "./NoPage";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();
  const isAuth = location.state;
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
            element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
