import React, { useState } from "react";

const DocumentToCodeSwitch = ({ isDocument, setDocument }) => {
  const [mode, setMode] = useState("code");
  return (
    <div className="relative flex w-[240px] bg-gray-200 text-gray-300 rounded-2xl p-1">
      <button
        className={`z-30 cursor-pointer w-full select-none ${
          mode == "code" ? "text-neutral-800" : "text-white"
        }`}
        onClick={() => {
          setMode('document');
          setDocument(true);
        }}
      >
        Document
      </button>
      <button
        className={`w-full cursor-pointer z-30 select-none  ${
          mode == "code" ? "text-white" : "text-neutral-800"
        }`}
        onClick={() => {
          setMode('code');
          setDocument(false);
        }}
      >
        Code
      </button>
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-neutral-900 rounded-xl transition-all duration-300 ${
          mode === "code" ? "translate-x-full" : ""
        }`}
      />
    </div>
  );
};

export default DocumentToCodeSwitch;
