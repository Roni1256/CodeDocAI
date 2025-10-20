import {
  Code,
  File,
  LampCeiling,
  Pencil,
  Plus,
  Save,
  Trash,
  X,
} from "lucide-react";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "../markdownStyles.css"; // custom CSS for general markdown styling
import Editor, { useMonaco } from "@monaco-editor/react";
import { axiosInstance } from "../utils/axiosInstance";
import dracula from "monaco-themes/themes/Dracula.json";
import ToggleButton from "../components/ToggleButton";
import "highlight.js/styles/github.css"; // GitHub style for code blocks
import "highlight.js/styles/atom-one-dark.css"; // 🌙 Dark theme
import DocumentToCodeSwitch from "../components/DocumentToCodeSwitch";
import { LoaderContext } from "../App";
import PromptEngine from "../components/PromptEngine";
import FileDropZone from "../components/FileDropZone";

const Generated = () => {
  const navigation = useNavigate();
  const loc = useLocation();
  const location = useLocation().state;
  const { id } = useParams();
  console.log(id);

  const [data, setData] = useState(location.data || {});

  const [loading, setLoading] = useContext(LoaderContext);
  const [project, setProject] = useState(location.project);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDocument, setDocument] = useState(false);
  const [code, setCode] = useState(
    data.length ? data[currentIndex].file_content : ""
  );
  const [document, setCurrentDocument] = useState(
    data.length ? data[currentIndex].output_content : ""
  );
  const [isAddingNewFile, setIsAddingNewFile] = useState(false);
  const [newFile, setNewFile] = useState({
    file_name: "",
    file_content: "",
    file_type: "",
  });
  const [isDelete, setDelete] = useState(false);
  const [isEditDocument, setEditDocument] = useState(false);
  const monaco = useMonaco();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [fileContents, setFileContents] = useState([]);
  const [generationStatus, setGenerationStatus] = useState([]);

  const handleEditorChange = (value) => {
    if (!isDocument) setCode(value);
    else setCurrentDocument(value);
  };

  async function fetchFiles(e) {
    const files = project.files;

    try {
      const resp = await axiosInstance.post(
        `/project/get-files/${project._id}`,
        { files: files }
      );

      setData(resp.data.files);
      setCurrentDocument(resp.data.files[currentIndex].output_content);
      setCode(resp.data.files[currentIndex].file_content);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function save(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (!isDocument) {
        const resp = await axiosInstance.put(
          `/project/save/code/${data[currentIndex]._id}`,
          { file_content: code }
        );
        console.log(resp.data.savedFile);
      } else {
        const resp = await axiosInstance.put(
          `/project/save/document/${data[currentIndex]._id}`,
          { output_content: document }
        );
        console.log(resp.data.savedDocument);
      }

      fetchFiles();
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  async function deleteFile(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const newFiles = project.files.filter(
        (file) => file != data[currentIndex]._id
      );
      console.log();

      setProject((prev) => ({ ...prev, files: newFiles }));
      const resp = await axiosInstance.delete(
        `/project/delete/file/${data[currentIndex].projectId}/${data[currentIndex]._id}`
      );
      console.log(resp);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      fetchFiles();
      setLoading(false);
    }
  }

  async function addNewFile(e) {
    e.preventDefault();
    try {
      setIsAddingNewFile(false);
      for (let index = 0; index < fileContents.length; index++) {
        const element = fileContents[index];
        setGenerationStatus((prev) => [
          ...prev,
          {
            status: "generating",
            message: `generating for ${element.file_name}`,
          },
        ]);
        const fileResp = await axiosInstance.post(
          `/project/add-file/${project._id}`,
          { file: element }
        );
        ``;
        setGenerationStatus((prev) => [
          ...prev,
          {
            status: "completed",
            message: `Generation Completed for ${element.file_name}`,
          },
        ]);

        setGenerationStatus((prev) => [
          ...prev,
          { status: "fetching", message: `Fetching ${element.file_name}` },
        ]);
        fetchFiles(e);
        setGenerationStatus((prev) => [
          ...prev,
          {
            status: "fetch-completed",
            message: `Fetching Complete ${element.file_name}`,
          },
        ]);
        setIsAddingNewFile(false);
      }
    } catch (error) {
      setLoading(false);
      setIsAddingNewFile(false);
      console.log(error);
    } finally {
      setGenerationStatus([]);
    }
  }
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
            file_name: element.name,
            file_type: type,
            file_content: e.target.result,
          };
          if (
            !fileContents.find((item) => {
              return item.file_name === fileObj.file_name;
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
      return element.file_name !== item.file_name;
    });
    setFileContents(newFileContents);
  }

  useEffect(() => {
    fetchFiles();
    if (monaco && !themeLoaded) {
      monaco.editor.defineTheme("dracula", dracula);
      monaco.editor.setTheme("dracula");
      setThemeLoaded(true);
    }

    setLoading(false);
  }, [monaco, themeLoaded]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Required for most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    const handlePopState = (event) => {
      const confirmLeave = window.confirm(
        "Are you sure you want to leave this page? Unsaved changes may be lost."
      );
      if (!confirmLeave) {
        // Prevent navigation by pushing the current location back
        navigate(loc.pathname, { replace: true });
      }
    };
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigation, loc.pathname]);

  if (isAddingNewFile) {
    return (
      <div className="w-full h-screen backdrop-blur-md flex items-center justify-center fixed top-0 left-0 z-30">
        <div className="bg-white rounded-lg w-1/2  border border-gray-300 shadow-md shadow-gray-600 p-10">
          <div className="flex items-center justify-between ">
            <h1 className="text-xl text-gray-400">Upload New File</h1>
            <button
              className="p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500  hover:text-red-400 cursor-pointer "
              onClick={() => setIsAddingNewFile(false)}
            >
              <X size={20} />
            </button>{" "}
          </div>

          <div className=" mt-4 ">
            <div
              className="w-full h-[200px] flex items-center justify-center border-4 border-gray-500 border-dashed rounded-xl cursor-pointer"
              onClick={() => {
                window.document.getElementById("files").click();
              }}
            >
              <h1 className="text-xl text-gray-500 ">
                Click Here To Upload Files
              </h1>
              <input
                type="file"
                name="file"
                id="files"
                onChange={uploadFile}
                className=" hidden"
                multiple
              />
            </div>
            <div className="max-h-[200px] overflow-auto mt-5 flex flex-col gap-2  ">
              {fileContents.map((element, i) => {
                return (
                  <div
                    className="flex items-center justify-between p-1 px-4 rounded-lg  bg-gray-50 border border-gray-300 text-sm"
                    key={i}
                  >
                    <span>{element.file_name}</span>
                    <button
                      className="hover:bg-gray-100 cursor-pointer p-2"
                      onClick={() => removeFile(element)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <button className="button-primary" onClick={addNewFile}>
            Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-10 h-[80vh] gap-4 ">
      {/* Left Section */}
      <nav className="flex flex-col col-span-2  border-r-2 border-r-gray-200   overflow-auto h-[80vh] ">
        <span className="text-gray-500 text-md p-4">Explorer</span>

        {data.map((element, i) => {
          return (
            <button
              key={i}
              className={`w-full  px-3 text-left text-lg py-2  hover:bg-neutral-800 hover:text-white  text-neutral-800 ${
                currentIndex == i ? " bg-neutral-950 text-white" : ""
              } duration-300 ease-in-out transition-all cursor-pointer`}
              onClick={() => {
                setCurrentIndex(i);
                setCode(data[currentIndex].file_content);
                setCurrentDocument(data[currentIndex].output_content);
              }}
            >
              {element.file_name}
            </button>
          );
        })}
        {generationStatus.length ? (
          <div className="w-full p-3">
            <ol className="bg-gray-50 rounded-lg border border-gray-200 w-full h-[300px] max-h-[300px] overflow-auto p-5">
              {generationStatus.map((status, i) => {
                return (
                  <li className="text-md border-b border-gray-200 text-gray-700">
                    {status.message}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          ""
        )}
        <div className="p-3 justify-self-end">
          <button
            className="w-full bg-gray-100 border border-gray-200 text-neutral-500  rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:border-gray-400 cursor-pointer duration-300 transition-all ease-in-out hover:text-neutral-900"
            onClick={() => setIsAddingNewFile(true)}
          >
            Add File <Plus />
          </button>
        </div>
        <div className="w-full flex justify-center items-center  gap-2 px-5">
          {isEditDocument && (
            <button
              className="button-blue w-2/3 flex items-center justify-between"
              onClick={save}
            >
              Save <Save size={20} />
            </button>
          )}
          <button
            className="button-danger w-2/3 flex items-center justify-between"
            onClick={() => setDelete(true)}
          >
            Delete File <Trash size={20} />
          </button>
        </div>
      </nav>
      {/* Middle Section */}
      <div
        className={`markdown-container col-span-5 text-wrap overflow-auto scrollbar-hide w-full`}
      >
        {data.length > 0 && (
          <div className="w-full mb-3 flex items-center justify-between gap-2">
            <DocumentToCodeSwitch
              isDocument={isDocument}
              setDocument={setDocument}
            />

            <ToggleButton
              label={"Edit Document"}
              isOn={isEditDocument}
              setOn={setEditDocument}
            />
          </div>
        )}
        {isDocument && data.length > 0 ? (
          !isEditDocument ? (
            <div className="bg-[#1E1E1E] text-gray-200 p-6 rounded-xl shadow-lg overflow-auto prose prose-invert max-w-none">
              <ReactMarkdown
                children={document}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              />
            </div>
          ) : (
            <Editor
              className="w-screen overflow-auto rounded-2xl"
              value={data[currentIndex].output_content}
              height="70vh"
              width={"100%"}
              language="markdown"
              theme="dracula"
              onChange={handleEditorChange}
              options={{
                wordWrap: "wordWrapColumn",
                fontSize: 16,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                padding: { top: 10, bottom: 10 },
                fontLigatures: true,
                lineNumbers: "on",
                renderLineHighlight: "all",
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                },
                allowOverflow: true,
              }}
            />
          )
        ) : data.length > 0 ? (
          <Editor
            value={code}
            height="70vh"
            width={"100%"}
            theme="dracula"
            language="javascript"
            onChange={handleEditorChange}
            options={{
              wordWrap: "wordWrapColumn",
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              padding: { top: 10, bottom: 10 },
              fontLigatures: true,
              lineNumbers: "on",
              renderLineHighlight: "all",
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              readOnly: !isEditDocument ? true : false,
            }}
            className="w-screen overflow-auto rounded-2xl"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-4xl text-gray-500">No File Found</span>
          </div>
        )}
      </div>
      {/* Right Section */}
      <div className="flex flex-col  items-center justify-between   border-l-2  border-gray-300 px-5  col-span-3">
        <PromptEngine files={data} project={project} />
      </div>
      {/* deletion Popup */}
      {isDelete && (
        <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center backdrop-blur-lg z-40">
          <div className="w-1/3 bg-white  rounded-lg shadow shadow-gray-200 p-5">
            <div className="flex items-center justify-between self-start ">
              <h1 className="text-xl text-gray-400">
                {data[currentIndex].file_name}
              </h1>
              <button
                className="p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500  hover:text-red-400 cursor-pointer "
                onClick={() => setDelete(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-2xl text-neutral-800 mt-5">
              Deleting <b>{data[currentIndex].file_name}</b> will delete this
              permanently and cannot be reverted.
            </p>
            <button className="button-danger w-full mt-4" onClick={deleteFile}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generated;
