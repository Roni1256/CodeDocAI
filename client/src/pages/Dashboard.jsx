import { Brain, Home, LogOut, User2 } from "lucide-react";
import React, {
  createContext,
  lazy,
  useContext,
  useEffect,
  useState,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LoaderContext, UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
export const CurrentProjectContext = createContext();
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [isProfile, setProfile] = useState(false);
  const [currentProject, setCurrentProject] = useState("");
  async function getUser() {
    try {
      setLoading(true);
      const resp = await axiosInstance.get("/authentication/current-user");
      setUser(resp.data.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function logout() {
    try {
      setLoading(true);
      const resp = await axiosInstance.get("/authentication/logout");
      console.log(resp);
      location.reload();
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    getUser();
    setLoading(false);
  }, []);
  return (
    <CurrentProjectContext.Provider value={[currentProject, setCurrentProject]}>
      <div className="h-full w-full bg-gray-200  flex flex-col lg:flex-row gap-2">
        <div className="h-full  bg-white lg:rounded-xl w-full relative">
          <div className="flex items-center justify-between px-10 ">
            <h1 className="px-8 py-6 text-2xl font-semibold text-neutral-600">
              CODEDOC AI
            </h1>
            {currentProject && (
              <div className="relative">
              <div className="text-lg text-neutral-700 bg-gray-100 px-4 py-2 rounded-xl border border-gray-300  peer">
                <span className=" w-full">{currentProject.project_name}</span>
              </div>
                <div className="hidden peer-hover:block absolute bg-white -bottom-42 z-50    overflow-auto left-0 mb-2 rounded-lg p-2 text-sm shadow-lg border border-gray-200">
                  {currentProject.project_description}
                </div>

              </div>
            )}
            <div className="flex items-center gap-2 lg:gap-10 ">
              <button
                className={`button-route ${
                  location.pathname.endsWith("/") ||
                  location.pathname.endsWith("dashboard")
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-200 focus:bg-black focus:text-white text-gray-600"
                } flex items-center gap-4 `}
                onClick={() => navigate("")}
              >
                <span className="hidden lg:block">Home</span> <Home size={20} />
              </button>

              <div className="">
                <button
                  className={`bg-blue-900 text-white rounded-full w-[30px]  h-[30px] lg:w-[40px] lg:h-[40px] flex items-center justify-center cursor-pointer text-lg lg:text-2xl hover:border-4 hover:border-blue-200 ${
                    isProfile ? "border-4 border-blue-200" : ""
                  }`}
                  onClick={() => setProfile(!isProfile)}
                >
                  {user.username[0]}
                </button>
                {isProfile && (
                  <div className=" rounded-lg bg-white absolute right-3 top-18 overflow-hidden border border-gray-400">
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center justify-center w-full px-20 py-3 gap-5 text-md hover:bg-gray-50 duration-300 transition-all ease-in-out border-b border-gray-300 cursor-pointer"
                      onClick={() => logout()}
                    >
                      Logout <LogOut />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr className="outline-none border-gray-300" />
          <div className="" onClick={() => setProfile(false)}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </CurrentProjectContext.Provider>
  );
};

export default Dashboard;
