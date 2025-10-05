import { LampCeiling } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // GitHub style for code blocks
import "../markdownStyles.css"; // custom CSS for general markdown styling
const Generated = () => {
  const location = useLocation().state;
  const [data, setData] = useState(location.data);
  const [currentIndex,setCurrentIndex]=useState(0)
  console.log(data);

  return (
    <div className="flex gap-20">
      <nav className="flex flex-col h-screen w-1/5 border-r-2 border-r-gray-200  gap-3 py-10 px-2">
        {data.map((element, i) => {
          return (
            <button
              className={`w-full bg-gray-50 px-3 text-left py-4 rounded-lg border hover:bg-gray-200   text-gray-500 ${currentIndex==i?"border-gray-400 text-gray-8007":"border-gray-200"} duration-300 ease-in-out transition-all cursor-pointer`}
              onClick={() => {
                setCurrentIndex(i)
              }}
            >
              {element.filename}
            </button>
          );
        })}
      </nav>
      <div className="markdown-container p-20 text-wrap max-w-1/2 h-screen overflow-auto scrollbar-hide ">
        <ReactMarkdown
          children={data[currentIndex].content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        />
      </div>
    </div>
  );
};

export default Generated;
