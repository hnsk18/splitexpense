import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { getProfile } from "./services/userapi";
import { useEffect } from "react";
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/group/Dashboard'
import Layout from "./components/Layout";
import ProtectedRoute from "./route/ProtectedRoute";
import PublicRoute from "./route/PublicRoute";

function App() {

  const { setUser } = useAuth();
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
      }
    }
    loadUser();
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/me" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
