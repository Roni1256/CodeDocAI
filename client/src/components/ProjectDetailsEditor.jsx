import React, { useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { X } from "lucide-react";

const ProjectDetailsEditor = ({
  projectId,
  project_name,
  project_description,
  setEditor
}) => {
  const [data, setData] = useState({
    project_name: project_name || "",
    project_description: project_description || "",
  });
  function handleChanges(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  
  async function update() {
    try {
      const resp = await axiosInstance.put(
        `/project/update/${projectId}`,
        data
      );
      console.log(resp);
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="h-screen w-full fixed top-0 left-0 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-white rounded-lg p-5 shadow-md shadow-gray-200 border border-gray-300 w-1/2">
        <h1 className="text-xl font-semibold text-neutral-400 flex items-center justify-between">
          Project Details
          <button className="bg-gray-100 rounded-md p-2 hover:text-red-400 cursor-pointer border border-gray-300"
          onClick={()=>setEditor(false)}
          >
            <X />
          </button>
        </h1>
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
        <button className="button-primary mt-4 w-1/5" onClick={()=>update()}>Edit</button>
      </div>
    </div>
  );
};

export default ProjectDetailsEditor;
