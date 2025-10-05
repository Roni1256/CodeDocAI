import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function App() {
    const navigate=useNavigate();
  return (
    <div className="bg-gray-50 text-gray-800 font-display">
      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CodeDocAI</h1>
          <nav className="hidden md:flex space-x-6 text-gray-700">
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#how" className="hover:text-gray-900">
              How It Works
            </a>
            <a href="#contact" className="hover:text-gray-900">
              Contact
            </a>
          </nav>
          <button className="button-primary" name="get-started" onClick={()=>{navigate("/auth")}}>Get Started</button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900">
            AI-Powered Code Documentation{" "}
            <span className="text-gray-600">for Modern Teams</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automatically generate clear, structured documentation for your code
            — reduce manual work and speed up onboarding.
          </p>
          <button
            onClick={()=>{navigate("/auth")}}
            className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all duration-500 ease-in-out"
          >
            Try CodeDocAI <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Built for Developers, Loved by Teams
          </h3>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Smart & Accurate",
                desc: "Our AI deeply understands your code to create meaningful documentation automatically.",
              },
              {
                title: "Language Agnostic",
                desc: "JavaScript, Python, HTML/CSS and beyond — CodeDocAI adapts to your stack.",
              },
              {
                title: "Time Saving",
                desc: "Save hours of writing docs, focus on coding and ship faster.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-xl border hover:shadow-sm transition"
              >
                <CheckCircle className="text-gray-900 h-8 w-8 mb-3" />
                <h4 className="text-xl font-semibold mb-2 text-gray-900">
                  {f.title}
                </h4>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              {
                step: "1",
                title: "Upload Code",
                desc: "Select your files or repos. We handle the parsing securely.",
              },
              {
                step: "2",
                title: "AI Processes",
                desc: "Our engine analyzes your codebase and builds context.",
              },
              {
                step: "3",
                title: "Get Documentation",
                desc: "Receive polished, structured documentation instantly.",
              },
            ].map((s, i) => (
              <div key={i} className="p-6">
                <div className="text-5xl font-bold text-gray-900">{s.step}</div>
                <h4 className="text-xl font-semibold mt-4 text-gray-900">
                  {s.title}
                </h4>
                <p className="mt-2 text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">
            Get in Touch
          </h3>
          <p className="text-gray-600 mb-8">
            Have questions or need a demo? We’re here to help.
          </p>
          <a
            href="mailto:support@codedocai.com"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CodeDocAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
