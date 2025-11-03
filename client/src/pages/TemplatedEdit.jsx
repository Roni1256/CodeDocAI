import { GripVertical } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // GitHub style for code blocks
import "../markdownStyles.css";
import "highlight.js/styles/atom-one-dark.css"; // 🌙 Dark theme

const templates = [
  {
    label: "README (Project-Level Documentation)",
    mandatory: ["Project Title", "Overview", "Installation", "Usage Guide"],
    optional: [
      "Key Features",
      "Table of Contents",
      "Screenshots / UI Previews",
      "Configuration (if any)",
      "Folder Structure",
      "Tech Stack",
      "Contributing",
      "License",
      "Contact / Support",
      "Acknowledgements",
    ],
    priorityOrder: [
      "Project Title",
      "Overview",
      "Installation",
      "Usage Guide",
      "Key Features",
      "Tech Stack",
      "Folder Structure",
      "Contributing",
      "License",
    ],
  },
  {
    label: "API Documentation",
    mandatory: [
      "Introduction",
      "Base URL",
      "Authentication",
      "Endpoints Overview",
      "Request Format",
      "Response Format",
    ],
    optional: [
      "Rate Limiting / Access Rules",
      "Request Body Parameters",
      "Success Response Examples",
      "Error Response Examples",
      "Pagination / Filtering",
      "Versioning",
      "Changelog Summary",
      "Code Samples (Language Tabs)",
      "Testing APIs (Try-It Section)",
    ],
    priorityOrder: [
      "Introduction",
      "Base URL",
      "Authentication",
      "Endpoints Overview",
      "Request Format",
      "Response Format",
      "Error Response Examples",
      "Versioning",
    ],
  },
  {
    label: "Configuration Documentation",
    mandatory: [
      "Purpose of Configuration",
      "File Location / Paths",
      "Configuration Keys and Descriptions",
      "Setup and Validation Steps",
    ],
    optional: [
      "Prerequisites",
      "Environment Variables",
      "Default Values and Examples",
      "Common Mistakes / Troubleshooting",
      "Security Considerations",
    ],
    priorityOrder: [
      "Purpose of Configuration",
      "File Location / Paths",
      "Configuration Keys and Descriptions",
      "Setup and Validation Steps",
      "Security Considerations",
    ],
  },
  {
    label: "Code Architecture / Design Documentation",
    mandatory: [
      "System Overview",
      "High-Level Architecture Diagram",
      "Modules and Their Responsibilities",
      "Classes and Their Relationships",
    ],
    optional: [
      "Core Principles / Design Philosophy",
      "Data Flow / Component Interaction",
      "Dependency Graph",
      "Design Patterns Used",
      "Scalability & Performance Notes",
      "Future Enhancements / Extension Points",
    ],
    priorityOrder: [
      "System Overview",
      "High-Level Architecture Diagram",
      "Modules and Their Responsibilities",
      "Classes and Their Relationships",
      "Data Flow / Component Interaction",
      "Design Patterns Used",
    ],
  },
  {
    label: "Test Documentation",
    mandatory: ["Testing Framework", "How to Run Tests", "Test Cases"],
    optional: [
      "Test Environment Setup",
      "Test Suites / Modules Covered",
      "Mocking / Fixtures Used",
      "Expected Outputs",
      "Code Coverage Information",
      "Troubleshooting Test Failures",
    ],
    priorityOrder: [
      "Testing Framework",
      "How to Run Tests",
      "Test Cases",
      "Code Coverage Information",
    ],
  },
  {
    label: "Changelog / Version Documentation",
    mandatory: ["Version Number", "Release Date", "New Features"],
    optional: [
      "Enhancements / Improvements",
      "Bug Fixes",
      "Deprecated Features",
      "Breaking Changes",
      "Known Issues",
      "Upgrade Instructions",
      "Contributors (optional)",
    ],
    priorityOrder: [
      "Version Number",
      "Release Date",
      "New Features",
      "Bug Fixes",
      "Breaking Changes",
    ],
  },
  {
    label: "License Documentation",
    mandatory: [
      "License Name",
      "License Summary",
      "Usage Rights",
      "Restrictions",
    ],
    optional: [
      "Distribution Terms",
      "Attribution Requirements",
      "Disclaimer of Warranty",
      "Contact for Permissions / Exceptions",
    ],
    priorityOrder: [
      "License Name",
      "Usage Rights",
      "Restrictions",
      "Disclaimer of Warranty",
    ],
  },
];

const doc = `
#  Calculator Project

## Overview
A simple Python-based calculator module that supports basic arithmetic operations — addition, subtraction, multiplication, and division.  
It includes automated unit tests written using Python’s built-in \`unittest\` framework.

## Installation
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/calculator.git
   \`\`\`

2. Navigate into the project directory:
   \`\`\`bash
   cd calculator
   \`\`\`

3. (Optional) Create and activate a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate   # for Linux/Mac
   venv\\Scripts\\activate    # for Windows
   \`\`\`

4. Install dependencies (if any):
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

## Usage Guide
You can use the calculator module directly from the command line or import it into your Python scripts.

Example:
\`\`\`python
from calculator import add, subtract, multiply, divide

print(add(2, 3))        # Output: 5
print(divide(10, 2))    # Output: 5.0
\`\`\`

## Key Features
- Lightweight and modular Python design
- Includes detailed unit tests
- Follows PEP 8 standards
- Beginner-friendly structure

## Folder Structure
\`\`\`
calculator/
│
├── calculator.py         # Core calculator logic
├── sample_test.py        # Unit tests
├── README.md             # Documentation
└── requirements.txt      # Dependencies (if any)
\`\`\`

## Tech Stack
- **Language:** Python 3.10+
- **Testing:** unittest
- **Version Control:** Git & GitHub

## Contributing
1. Fork the repository  
2. Create a new branch for your feature:
   \`\`\`bash
   git checkout -b feature-name
   \`\`\`
3. Commit and push changes:
   \`\`\`bash
   git commit -m "Add new feature"
   git push origin feature-name
   \`\`\`
4. Create a pull request

## License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## Contact
📧 Email: yourname@example.com  
🐙 GitHub: [@yourusername](https://github.com/yourusername)
`;

const TemplatedEdit = () => {
  const [data, setData] = useState(useLocation().state.data);
  const [project, setProject] = useState(useLocation().state.project);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full h-full flex  justify-center ">
      <section className="flex flex-col col-span-2  border-r-2 border-r-gray-200 h-[80vh] duration-300 ease-in-out transition-all ">
        <h1 className="text-gray-500 text-md p-4 ">Templates</h1>
        <div className="flex flex-col h-full ">
          {templates.map((template, index) => (
            <button
              key={index}
              className={`w-full  px-3 text-left text-lg py-2  hover:bg-neutral-800 hover:text-white  text-neutral-800 ${
                currentIndex == index ? " bg-neutral-950 text-white" : ""
              } duration-300 ease-in-out transition-all cursor-pointer`}
              onClick={() => {
                setCurrentIndex(index);
              }}
            >
              {template.label}
            </button>
          ))}
        </div>
      </section>
      <section className="w-full  h-[90vh] overflow-auto bg-gray-50 p-10">
        <header className="flex items-center justify-between  ">
          <h1 className="text-2xl font-semibold  text-gray-700">
            {templates[currentIndex].label}
          </h1>
        </header>
        <div className="bg-[#1E1E1E] text-gray-200 p-6 rounded-xl shadow-lg overflow-auto prose prose-invert max-w-none">
          <ReactMarkdown
            children={doc}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          />
        </div>
        <main className="flex  ">
          <div className="flex flex-col w-[400px] h-fit items-center p-3 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-lg text-gray-500 w-full">
              Mandatory Components
            </h3>
            <div className="flex flex-col mt-4 gap-2 w-full items-center">
              {templates[currentIndex].mandatory.map((section, index) => (
                <button className="w-full max-w-[300px] text-gray-700 text-start bg-gray-100 p-2 rounded-xl flex items-center justify-between hover:cursor-grab active:cursor-grabbing">
                  {section} <GripVertical />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-[400px] h-fit items-center p-3 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-lg text-gray-500 w-full">
              Optional Components
            </h3>
            <div className="flex flex-col mt-4 gap-2 w-full items-center">
              {templates[currentIndex].optional.map((section, index) => (
                <button className="w-full max-w-[300px] text-gray-700 text-start bg-gray-100 p-2 rounded-xl flex items-center justify-between hover:cursor-grab active:cursor-grabbing">
                  {section} <GripVertical />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-[400px] h-fit items-center p-3 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-lg text-gray-500 w-full">
              Components Priority{" "}
            </h3>
            <div className="flex flex-col mt-4 gap-2 w-full items-center">
              {templates[currentIndex].priorityOrder.map((section, index) => (
                <button className="w-full max-w-[300px] text-gray-700 text-start bg-gray-100 p-2 rounded-xl flex items-center justify-between hover:cursor-grab active:cursor-grabbing">
                  {section} <GripVertical />
                </button>
              ))}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default TemplatedEdit;
// <div className="w-[400px]">
{
  /* <h1 className="text-lg text-gray-500  ">Edit</h1>
            <div className="mt-4 flex flex-col gap-3 ">
              <label htmlFor="label" className="">
                Component Label
              </label>
              <input type="text" name="" id="" className="input-primary" />
            </div>
            <div className="mt-4 flex flex-col gap-3 ">
              <label htmlFor="label" className="">
                Component Description
              </label>
              <textarea
                type="text"
                name=""
                id=""
                className="input-primary resize-none overflow-auto"
                rows={9}
              ></textarea>
            </div>

            <button className="button-primary mt-4  ">Edit</button>
          </div> */
}
