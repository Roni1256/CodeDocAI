// FileDropZone.jsx
import React, { useState, useRef } from "react";

export default function FileDropZone({ onFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const inputRef = useRef(null);

  // Prevent default drag behaviors
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Highlight drop area when dragging
  const handleDragEnter = (e) => {
    preventDefaults(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    preventDefaults(e);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

    const handleFiles = (files) => {
        setDroppedFiles((prev) => [...prev, ...files]);
        if (onFiles) onFiles(files);
    };

    const handleBrowse = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

  return (
    <div className="">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={preventDefaults}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all h-[300px] flex flex-col items-center justify-center
        ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }
      `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onFiles}
          style={{ display: "none" }}
        />

        <p className="text-gray-700 font-medium">
          {isDragging
            ? "Drop files here..."
            : "Drag & drop files here, or click to browse"}
        </p>

        {droppedFiles.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-semibold mb-2">Uploaded Files:</h3>
            <ul className="space-y-1 text-sm">
              {droppedFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border rounded px-3 py-1 bg-white shadow-sm"
                >
                  <span>{file.name}</span>
                  <span className="text-gray-500 text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
