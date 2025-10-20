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
import Loader from "./components/Loader";
import NewProject from "./pages/NewProject";
import TemplatedEdit from "./pages/TemplatedEdit";
export const UserContext = createContext();
export const NotiFicationContext = createContext();

export const LoaderContext = createContext();
export default function App() {
  const [user, setUser] = useState();
  const [notification, setNotification] = useState();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  async function getUser() {
    try {
      setLoading(true)
      const resp = await axiosInstance.get("/authentication/current-user");
      setUser(resp.data.user);
      setLoading(false)
      navigate("/dashboard");
    } catch (error) {
      setLoading(false)
      navigate("/");
    }
  }

  useEffect(() => {
    getUser();
  }, []);


  if(loading){

    return <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center"><Loader/></div>
  }
  return (
      <LoaderContext.Provider value={[loading,setLoading]}>
    <UserContext.Provider value={[user, setUser]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="" element={<Home />} />
              <Route path="workspace" element={<Workspace />} />
              <Route path="new-project" element={<NewProject/>}/>
              <Route path="work/:id" element={<Generated />} />
              <Route path="work/:id/templated-edit" element={<TemplatedEdit/>}/>
            </Route>
          </Route>
          <Route path="/" element={<Hero />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/verification" element={<Verification />} />
        </Routes>
    </UserContext.Provider>
      </LoaderContext.Provider>
  );
}
