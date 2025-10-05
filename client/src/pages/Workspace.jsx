import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
const Workspace = () => {
  const navigate = useNavigate();
  const [isFullScreen, setFullScreen] = useState(false);
  const [data, setData] = useState({
    project_name: "",
    project_description: "",
    prompt: "",
  });
  const [fileContents, setFileContents] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user,setUser]=useContext(UserContext)
  async function uploadFile(e) {
    try {
      let files = e.target.files || {};
      console.log(files);

      if (!files) return alert("No file Selected");
      Array.from(files).forEach((element) => {
        // console.log(element);
        let filename = element.name.split(".")[0] || "";
        let type = element.name.split(".")[1] || "";

        const reader = new FileReader();
        reader.onload = (e) => {
          console.log(e.target.result);
          const fileObj = {
            filename: filename,
            fileType: type,
            fileContent: e.target.result,
          };
          if (
            !fileContents.find((item) => {
              return item.filename === fileObj.filename;
            })
          )
            setFileContents((prev) => [...prev, fileObj]);
        };
        reader.readAsText(element);
      });
    } catch (error) {
      console.log(error);
    }
  }

  function removeFile(element) {
    const newFileContents = fileContents.filter((item) => {
      return element.filename !== item.filename;
    });
    setFileContents(newFileContents);
  }

  function handleChanges(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }
  async function generate() {
    try {
      setLoading(true);
      const detailsObj = {
        project: data,
        file: fileContents,
      };
      const response = await axios.post(
        `http://localhost:5000/api/ai/generate-content/${user._id}`,
        detailsObj
      );
      console.log(response);
      setLoading(false);
      navigate(`generate/name`, { state: { data: response.data.resultArray } });

      console.log(detailsObj);
    } catch (error) {
      setLoading(false);
      console.log(error);
      
    }
  }

  function handleNext() {
    console.log(data);

    if (data.project_name && data.project_description) setCurrentSection(1);
    else if (currentSection === 0) {
      alert("Enter Project details!");
      setCurrentSection(0);
    }
    if (currentSection === 1 && fileContents.length === 0) {
      alert("Files are empty");
      setCurrentSection(1);
    } else if (currentSection === 1) {
      setCurrentSection(2);
    }
  }

  return (
    <div
      className={`h-screen p-10 flex ${
        isFullScreen ? "flex-col" : "flex-row"
      } items-center justify-center relative`}
    >
      {loading && (
        <div className="top-0 left-0 fixed flex items-center justify-center backdrop-blur-2xl h-full w-full">
          <Loader />
        </div>
      )}
      <div className=" p-10 rounded-xl border border-gray-200  shadow-md shadow-gray-200 bg-white w-full lg:w-1/2">
        {currentSection === 0 && (
          <>
            <h1 className="text-xl font-semibold text-neutral-400">
              Project Details
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
          </>
        )}
        {currentSection === 1 && (
          <>
            <h1 className="text-xl font-semibold text-neutral-400">
              File Details
            </h1>

            <div className="flex flex-col gap-2 mt-5">
              <label htmlFor="project-file">Project Files</label>
              <input
                type="file"
                name="project-file"
                id="select-file"
                className="input-primary cursor-pointer hidden"
                placeholder="Upload Project File"
                onChange={uploadFile}
                multiple
              />
              <div
                className="bg-gray-100  px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-500 cursor-pointer duration-300 transition-all ease-in-out"
                onClick={() => document.getElementById("select-file").click()}
              >
                Choose File
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <label htmlFor="project-file">
                Selected Files:{fileContents.length}
              </label>

              {fileContents.map((element, i) => {
                return (
                  <div
                    className="flex items-center justify-between py-2 px-4 rounded-lg  bg-gray-50 border border-gray-300"
                    key={i}
                  >
                    <span>{element.filename}</span>
                    <button
                      className="hover:bg-gray-100 cursor-pointer p-2"
                      onClick={() => removeFile(element)}
                    >
                      <X />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {currentSection === 2 && (
          <div className="flex flex-col gap-2 mt-5">
            <label htmlFor="prompt">Prompt</label>
            <textarea
              name="prompt"
              className="input-primary resize-none overflow-auto w-full "
              value={data.prompt}
              rows={8}
              placeholder="Generate me in this structure ..."
              draggable="false"
              onChange={(e) => handleChanges(e)}
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-8">
          {(currentSection === 1 || currentSection == 2) && (
            <button
              className="button-plain "
              onClick={() => setCurrentSection(currentSection - 1)}
            >
              Back
            </button>
          )}
          {(currentSection === 0 || currentSection === 1) && (
            <button className="button-secondary " onClick={() => handleNext()}>
              Next
            </button>
          )}
          {currentSection === 2 && (
            <button className="button-secondary " onClick={generate}>
              Generate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
