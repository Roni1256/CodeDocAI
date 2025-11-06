import React, { useContext } from "react";
import { LoaderContext, UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../components/Loader";
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  FileText,
  CalendarDays,
  Clock,
  FolderCode,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import ProjectDetailsEditor from "../components/ProjectDetailsEditor";
import DeletionPop from "../components/DeletionPop";
import { CurrentProjectContext } from "./Dashboard";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useContext(LoaderContext);
  const [cardDetails, showDetails] = useState();
  const [respFile, setRespFile] = useState([]);
  const [editor, setEditor] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [currentProject, setCurrentProject] = useContext(CurrentProjectContext);
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
    <div className="h-full px-50 py-10 ">
      <header className="w-full ">
        <h1 className="text-5xl">
          Welcome Back! <b className="text-gray-500"> {user.username}</b>
        </h1>
        <p className="text-3xl mt-4 text-gray-800">
          Let's build something great today.
        </p>
      </header>

      <div className=" mt-5 ">
        <div className="w-full flex items-center gap-20 mb-8">
          <h1 className="text-3xl tracking-wider text-neutral-600 font-semibold w-fit  py-2 rounded-xl">
            Your Works
          </h1>
          {projects.length > 0 && (
            <button
              className="button-primary flex items-center gap-4 text-sm"
              onClick={() => navigate("new-project")}
            >
              <Plus size={30} className="transition-all duration-300 " />
              Add New
            </button>
          )}
        </div>
        {projects.length <= 0 && (
          <div className="h-full w-full flex items-center justify-center flex-col mt-10">
            <span className="bg-gray-200 p-3 rounded-xl">
              <FolderCode size={50}  />
            </span>
            <h1 className="text-3xl font-semibold text-neutral-800 mt-4">
              No Projects Yet
            </h1>
            <p className="text-lg text-center mt-2">
              You haven't created any project yet. <br />
              Get Started by creating your first project.
            </p>
            <div className="flex items-center justify-center mt-4 gap-5">
              <button
                className="button-primary"
                onClick={() => navigate("new-project")}
              >
                Create Project
              </button>
              <button className="button-outlined">Learn More</button>
            </div>
          </div>
        )}
        <div className="flex  justify-between  w-full">
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min h-full w-full  gap-5">
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
                    <Folder fill="black" size={80} />
                    {element.project_name}
                  </div>
                );
              })}
          </div>
          {projects.length > 0 && (
            <div className="w-full lg:w-1/2 h-fit rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col gap-6">
              {cardDetails ? (
                <>
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row gap-3 lg:itecdms-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                      {cardDetails.project_name}
                    </h2>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditor(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => setDeletion(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Description
                    </span>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {cardDetails.project_description.length > 150
                        ? `${cardDetails.project_description.slice(0, 150)}...`
                        : cardDetails.project_description}
                    </p>
                  </div>

                  {/* File Info */}
                  <div className="flex items-center gap-2 text-base mt-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-700">Files:</span>
                    <span className="text-gray-500">
                      {cardDetails.files.length}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-5 mt-4 text-sm text-gray-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          Created
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {cardDetails.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">
                          Last Updated
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {cardDetails.updatedAt.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center py-10">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-600">
                    No Project Selected
                  </h3>
                  <p className="text-gray-400 mt-1">
                    Select a project to view its details
                  </p>
                </div>
              )}
            </div>
          )}
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
          fetchProjects={getProjects}
        />
      )}
    </div>
  );
};

export default Home;
