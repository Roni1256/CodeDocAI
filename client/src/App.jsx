import { Route, Routes, useNavigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Authentication from "./pages/Authentication";
import { createContext, useEffect, useState } from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Home from "./pages/Home";
import Generated from "./pages/Generated";
import Verification from "./pages/Verification";
import { axiosInstance } from "./utils/axiosInstance";
export const UserContext = createContext();
export default function App() {
  const [user, setUser] = useState();
  const navigate=useNavigate()
    async function getUser(){
      try {
        const resp=await axiosInstance.get('/authentication/current-user');
        setUser(resp.data.user)
        navigate("/dashboard")
      } catch (error) {
        navigate("/")
      }
    }

    useEffect(()=>{
      getUser()
    },[])
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Routes>
        <Route element={<ProtectedRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="" element={<Home/>}/>
            <Route path="workspace" element={<Workspace/>}/>
            <Route path="workspace/generate/:id" element={<Generated/>}/>
          </Route>
        </Route>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/verification" element={<Verification/>}/>
      </Routes>
    </UserContext.Provider>
  );
}
