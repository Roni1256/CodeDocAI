import { Brain, Home, LogOut, User2 } from "lucide-react";
import React, { lazy, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [isProfile, setProfile] = useState(false);
  async function getUser() {
    try {
      const resp = await axiosInstance.get("/authentication/current-user");
      setUser(resp.data.user);
    } catch (error) {
      console.log(error);
    }
  }
  async function logout() {
    try {
      const resp = await axiosInstance.get("/authentication/logout");
      console.log(resp);

      location.reload();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="h-full w-full bg-gray-200 lg:p-5 flex flex-col lg:flex-row gap-2">
      <div className="h-full  bg-white lg:rounded-xl w-full relative">
        <div className="flex items-center justify-between px-10 ">
          <h1 className="px-8 py-6 text-2xl font-semibold text-neutral-600">
            CODEDOC AI
          </h1>
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
              <span className="hidden lg:block">Home</span>{" "}
              <Home size={20}/>
            </button>

            <button
              className={`button-route ${
                location.pathname.endsWith("workspace")
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-200 focus:bg-black focus:text-white text-gray-600  "
              } flex items-center gap-4`}
              onClick={() => navigate("workspace")}
            >
              <span className="hidden lg:block">Workspace</span>{" "}<Brain size={20} />
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
  );
};

export default Dashboard;
