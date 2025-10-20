import React, { useContext } from "react";
import { LoaderContext, UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../components/Loader";
import { Folder, FolderPlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectDetailsEditor from "../components/ProjectDetailsEditor";
import DeletionPop from "../components/DeletionPop";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useContext(LoaderContext);
  const [cardDetails, showDetails] = useState();
  const [respFile, setRespFile] = useState([]);
  const [editor, setEditor] = useState(false);
  const [deletion, setDeletion] = useState(false);

  async function fetchFiles(project) {
    setLoading(true);
    const files = project.files;
    let responses = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      try {
        const resp = await axiosInstance.get(`/project/get-file/${element}`);
        responses.push(resp.data.file);
      } catch (error) {
        return console.log(error);
      }
    }
    setLoading(false);
    navigate(`work/${project._id}`, {
      state: { data: responses, project: project },
    });
  }
  async function getProjects() {
    try {
      setLoading(true);
      const resp = await axiosInstance.get(`/project/get/${user._id}`);
      setProjects(resp.data.projects);

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
      <p className="text-xl mt-3 text-gray-700">Have a wonderful day!</p>
      <div className="mt-5   pt-5">
        <h1 className="text-5xl tracking-wider text-neutral-800 w-fit px-3 py-2 rounded-xl">
          Your Works
        </h1>

        <div className="flex items-center justify-between h-screen w-full">
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min h-full w-full  gap-5">
            <button className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-600 bg-gradient-to-b from-neutral-800 to-neutral-700 p-6 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-neutral-500 hover:shadow-blue-500/20 cursor-pointer"
            onClick={()=>navigate('new-project')}
            >
              <div className="flex h-20 w-20 items-center justify-center  rounded-full bg-neutral-600/40 transition-all duration-300 group-hover:bg-blue-500/20">
                <Plus
                  size={48}
                  className="transition-all duration-300 "
                />
              </div>
              <span className="mt-3 text-sm text-gray-300 transition-colors duration-300 group-hover:text-white">
                Add New
              </span>
            </button>

            {!loading &&
              projects.map((element, index) => {
                return (
                  <div
                    className="flex flex-col items-center justify-center  w-fit h-fit p-5 hover:bg-gray-100 rounded-lg cursor-pointer  select-none"
                    onClick={() => showDetails(element)}
                    onDoubleClick={() => {
                      fetchFiles(element);
                    }}
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
                <div className="flex flex-col lg:flex-row  gap-4 lg:items-center justify-between border-b border-gray-200 pb-2">
                  <h2 className="text-2xl text-neutral-800 font-semibold">
                    {cardDetails.project_name}
                  </h2>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-all"
                      onClick={() => {
                        setEditor(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-all"
                      onClick={() => setDeletion(true)}
                    >
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
      {editor && (
        <ProjectDetailsEditor
          setEditor={setEditor}
          project_name={cardDetails.project_name}
          project_description={cardDetails.project_description}
          projectId={cardDetails._id}
        />
      )}
      {deletion && (
        <DeletionPop
          setDeletion={setDeletion}
          projectId={cardDetails._id}
          project_name={cardDetails.project_name}
          userId={user._id}
        />
      )}
    </div>
  );
};

export default Home;
