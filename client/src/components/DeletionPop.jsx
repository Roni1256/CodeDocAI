import { Delete, X } from "lucide-react";
import React from "react";
import { axiosInstance } from "../utils/axiosInstance";

const DeletionPop = ({ project_name = "sample",userId ,projectId ,setDeletion}) => {
    async function deleteProject(){
        try {
            const resp=await axiosInstance.delete(`/project/delete/${userId}/${projectId}`)
            console.log(resp);
            
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 backdrop-blur-xs">
      <div className="bg-white p-10 rounded-lg border border-gray-300 shadow-md shadow-gray-300 flex flex-col w-1/2 items-center">
      <div className="w-full flex items-center  justify-between">
        <h1 className="text-gray-600 text-lg  ">
          Confirm Delete <b className="capitalize">{project_name}</b>
        </h1>
          <button
            className="bg-gray-100 rounded-md p-2 hover:text-red-400 cursor-pointer border border-gray-300"
            onClick={()=>setDeletion(false)}
          >
            <X />
          </button>

      </div>
        <p className="text-gray-900 mt-8 text-2xl text-justify">
          This will permanently delete the{" "}
          <b className="capitalize">{project_name}</b> and the files
          accommodated with this project.
        </p>
        <span className="w-full my-4 p-2 rounded-lg border border-red-300 bg-red-100 text-red-600">
          Note: This action cannot be reverted.
        </span>
        <button className="bg-red-500 text-white text-xl py-2 rounded-lg w-full mt-4 " onClick={()=>{deleteProject()}}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeletionPop;
