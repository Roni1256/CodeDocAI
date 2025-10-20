import { Brain, Send } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { axiosInstance } from "../utils/axiosInstance";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "../markdownStyles.css";

const PromptEngine = ({ files, project }) => {
  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useContext(UserContext);
  const [allFiles, setAllFile] = useState(files || []);
  const [currentFile, setCurrentFile] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  const [currentProject, setProject] = useState(project || {});
  const [isGenerating, setGenerating] = useState(false);
  const [responses, setResponses] = useState([]);
  const [notification, setNotification] = useState();

  async function send() {
    try {
      setGenerating(true);
      setResponses((prev) => [
        ...prev,
        { prompt, currentFile: !currentFile ? "Common" : currentFileName },
      ]);
      setPrompt("");

      const resp = await axiosInstance.post(
        `/chat/ask-ai/${user._id}/${currentProject._id}`,
        { prompt: prompt, fileId: currentFile }
      );

      setGenerating(false);
      setResponses((prev) => [
        ...prev,
        {
          ai: resp.data.ai,
          currentFile: !currentFile ? "Common" : currentFileName,
        },
      ]);
      console.log(resp.data);
    } catch (error) {
      setGenerating(false);

      setNotification(error.message);
      console.log(error);
    }
  }
  async function retrieveChats() {
    try {
      const chats = await axiosInstance.get(`/chat/get-chats/${project._id}`);
      console.log(chats.data.chats);

      setResponses(chats.data.chats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    retrieveChats();
  }, []);
  return (
    <div className="w-full flex flex-col justify-between py-4 col-span-6  relative h-full">
      <div className="flex w-full items-center">
        <div className="self-start flex items-center justify-between gap-3 text-neutral-600">
          <Brain size={30} />
          <h2 className="text-2xl ">Ask AI</h2>
        </div>
        <div className=""></div>
      </div>

      <div className="h-[60vh] w-full p-2 overflow-auto flex flex-col py-5 gap-y-8 self scrollbar-hide">
        {!responses.length > 0 && !isGenerating && (
          <div className="w-full h-full flex items-center justify-center text-2xl text-neutral-600 flex-col select-none text-center">
            <span>Ask AI to Clarify and Generate</span>
            {/* <span>
              <b>{currentFile.file_name} </b> is the current File
            </span> */}
          </div>
        )}

        {responses.map((resp, i) => {
          if (i % 2 == 0) {
            return (
              <div
                className="flex flex-col self-end gap-1 relative max-w-3/4 "
                key={i}
              >
                <p className="self-end rounded-lg bg-gray-500 text-white p-3 w-full">
                  {resp.prompt}
                </p>
                <div className="flex items-center self-end gap-2">
                  <div className="text-gray-600 px-4 bg-gray-200 rounded-xl">
                    {resp.currentFile}
                  </div>
                  <div className="text-md bg-purple-500 text-white  p-3 rounded-full w-8 h-8  flex items-center justify-center ">
                    {user.username[0]}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                className="max-w-3/4 flex flex-col self-start gap-1 relative"
                key={i}
              >
                <div className="self-start  rounded-lg bg-neutral-800 text-white p-3">
                  <ReactMarkdown
                    children={resp.ai}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xl bg-neutral-300 text-gray-800  p-3 rounded-full w-10 h-10 flex items-center justify-center self-start">
                    <Brain />
                  </div>
                  <div className="text-gray-600 px-4 bg-gray-200 rounded-xl">
                    {resp.currentFile}
                  </div>
                </div>
              </div>
            );
          }
        })}
        {isGenerating && (
          <div className="bg-gray-200 rounded-lg p-2 flex items-center justify-center gap-2 w-fit">
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse" />
          </div>
        )}
      </div>
      <div className="shadow-md shadow-gray-500 border border-gray-400 self-end w-full rounded-xl p-5 flex flex-col items-center justify-between">
        <textarea
          name="prompt"
          className="w-full focus:outline-none tracking-wider text-lg text-neutral-800  resize-none "
          rows={3}
          value={prompt}
          placeholder="Ask about the project and files here..."
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center w-full">
          <select
            className="focus:outline-none bg-gray-100 rounded-lg p-2 focus:border-gray-300 border border-gray-200 text-sm"
            onClick={(e) => {
              setCurrentFile(e.target.value);
              setCurrentFileName(e.target.name);
            }}
            defaultValue={""}
          >
            <option value="">Project</option>
            {allFiles.map((file, i) => {
              return (
                <option
                  className=""
                  value={file._id}
                  key={i}
                  name={file.file_name}
                >
                  {file.file_name}
                </option>
              );
            })}
          </select>
          <button
            className="rounded-full bg-neutral-900 text-white p-2 flex items-center justify-center w-10 h-10 self-end hover:bg-neutral-800 duration-300 ease-in-out transition-all cursor-pointer"
            onClick={send}
          >
            <Send size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptEngine;
