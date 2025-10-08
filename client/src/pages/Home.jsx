import React, { useContext } from "react";
import { UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../components/Loader";
import { Folder } from "lucide-react";

const Home = () => {
  const [user, setUser] = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardDetails, showDetails] = useState();

  async function getProjects() {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(`/project/get/${user._id}`);
      setProjects(resp.data.projects);
      console.log(resp.data.projects);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="h-full px-18 py-10">
      <h1 className="text-3xl font-semibold text-gray-700">
        Welcome Back! {user.username}
      </h1>
      <p className="text-xl mt-3 text-gray-700">Have a wonderfull day!</p>
      <div className="mt-5   pt-5">
        <h1 className="text-5xl tracking-wider text-neutral-800 w-fit px-3 py-2 rounded-xl">
          Your Works
        </h1>
        {loading && (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div className="flex items-center justify-between h-screen w-full">
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-screen w-full gap-3 ">
            {!loading &&
              projects.map((element, index) => {
                return (
                  <div
                    className="flex flex-col items-center w-fit h-fit p-5 hover:bg-gray-100 rounded-lg cursor-pointer relative"
                    onClick={() => showDetails(element)}
                    key={index}
                  >
                    <Folder fill="black" size={100} />
                    {element.project_name}
                  </div>
                );
              })}
          </div>
          <div className="w-1/2 h-fit border rounded-xl border-gray-300 p-6 self-start shadow-md shadow-gray-200 bg-white flex flex-col gap-4">
            {cardDetails ? (
              <>
                {/* Project Title */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h2 className="text-2xl text-neutral-800 font-semibold">
                    {cardDetails.project_name}
                  </h2>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-all">
                      Delete
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col ">
                  <span className="font-semibold text-neutral-700">
                    Project Description:
                  </span>
                  <p className="text-lg text-neutral-600 leading-relaxed">
                    {cardDetails.project_description.length > 150
                      ? `${cardDetails.project_description.slice(0, 150)}...`
                      : cardDetails.project_description}
                  </p>
                </div>

                {/* File Count */}
                <div className="flex items-center  gap-2 text-lg mt-2">
                  <span className="font-semibold text-neutral-700">Files:</span>
                  <span className="text-neutral-500">
                    {cardDetails.files.length}
                  </span>
                </div>

                {/* Dates Section */}
                <div className="grid grid-cols-2 gap-3 mt-3 text-sm text-neutral-600">
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-700">
                      Created At:
                    </span>
                    <span>{cardDetails.createdAt.slice(0, 10)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-neutral-700">
                      Updated At:
                    </span>
                    <span>{cardDetails.updatedAt.slice(0, 10)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-500 flex flex-col items-center justify-center py-8">
                <span className="text-xl font-semibold">
                  No Project Selected
                </span>
                <p className="mt-2 text-neutral-400">
                  Select a project to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
