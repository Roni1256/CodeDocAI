import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { LoaderContext, UserContext } from "../App";

const NewProject = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    project_name: "",
    project_description: "",
  });
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  function handleChanges(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  async function fetchFiles(project) {
    setLoading(true);
    const files = project.files;
    let responses = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      try {
        const resp = await axiosInstance.get(`/project/get-file/${element}`);
        console.log(resp.data.file);
        responses.push(resp.data.file);
      } catch (error) {
        return console.log(error);
      }
    }
    setLoading(false);
    navigate(`/dashboard/work/${project._id}`, {
      state: { data: responses, project: project },
    });
  }
  async function createProject() {
    try {
      const resp = await axiosInstance.post(
        `project/add-project/${user._id}`,
        data
      );
      fetchFiles(resp.data.savedProject);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="h-[70vh] w-full flex items-center justify-center ">
      <div className="w-1/2 h-1/2 bg-white  rounded-xl p-5">
        <h1 className="text-2xl text-gray-600 ">New Project</h1>
        <div className="flex flex-col gap-2 mt-6">
          <label htmlFor="project-name">Project Name</label>
          <input
            type="text"
            name="project_name"
            className="input-primary"
            placeholder="Enter the project name"
            value={data.project_name}
            onChange={(e) => handleChanges(e)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <label htmlFor="project-description">Project Description</label>
          <textarea
            name="project_description"
            className="input-primary resize-none w-full "
            value={data.project_description}
            rows={8}
            placeholder="The Project is about ..."
            draggable="false"
            onChange={(e) => handleChanges(e)}
          />
        </div>
        <button className="button-secondary mt-5" onClick={createProject}>
          Create
        </button>
      </div>
    </div>
  );
};

export default NewProject;
