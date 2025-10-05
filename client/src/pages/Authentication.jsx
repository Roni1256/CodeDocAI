import axios from "axios";
import { Code } from "lucide-react";
import React, { useContext, useState } from "react";
import { FaStarOfLife } from "react-icons/fa";
import { data, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance.js";
import { UserContext } from "../App.jsx";

export default function Authentication() {
  const [formStatus, setFormStatus] = useState("register");
  const [inputDetails, setInputDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [processStatus, setProcessStatus] = useState({
    state: "idle",
    message: "",
  });
  const [user,setUser]=useContext(UserContext)
  const navigate = useNavigate();
  function handleChange(e) {
    setInputDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function changeStatus() {
    setFormStatus((prev) => (prev === "login" ? "register" : "login"));
  }

  async function authenticate(e) {
    e.preventDefault()
    if (
      formStatus === "register" &&
      inputDetails.password !== inputDetails.confirmPassword
    ) {
      return setProcessStatus({ state: "error", message: "Password Mismatch" });
    }

    try {
      if (formStatus === "register") {
        const registerData = {
          username: inputDetails.username,
          email: inputDetails.email,
          password: inputDetails.password,
        };
        const response = await axiosInstance.post(
          "/authentication/register",
          registerData
        );
        console.log(response.data);
        navigate("/verification", { state: { email: response.data.email,username:response.data.username } });
      }else{
        const loginDataObj={
          email:inputDetails.email,
          password:inputDetails.password
        }
        const resp=await axiosInstance.post('/authentication/login',loginDataObj);
        console.log(resp.data);
        setUser(resp.data.returningObj)
        navigate('/dashboard')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-100 flex flex-col gap-10 items-center justify-center p-20 w-full">
      <div className="bg-white px-5 py-10 h-fit rounded-lg border border-gray-300 shadow-lg w-[500px]">
        <div className="flex flex-col items-center gap-2 ">
          <div className="bg-gray-200 rounded-xl p-3 text-neutral-800">
            <Code size={30} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mt-2">
            Let's get Started!
          </h2>
          <p className="text-md text-neutral-700 ">
            Sign in to access your documents.
          </p>
        </div>
        <form  className="mt-10  px-4 flex flex-col gap-4 ">
          {formStatus === "register" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="flex items-center text-neutral-800 text-sm font-semibold gap-1"
              >
                Username <FaStarOfLife className="text-red-600" size={8} />
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="input-primary"
                placeholder="CodeDoc-AI"
                required
                onChange={handleChange}
                value={inputDetails.username}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="flex items-center text-neutral-800 text-sm font-semibold gap-1"
            >
              Email <FaStarOfLife className="text-red-600" size={8} />
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="input-primary"
              placeholder="codedoc@gmail.com"
              required
              onChange={handleChange}
              value={inputDetails.email}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="Password"
              className="flex items-center text-neutral-800 text-sm font-semibold gap-1"
            >
              Password <FaStarOfLife className="text-red-600" size={8} />
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-primary"
              placeholder="********"
              required
              onChange={handleChange}
              value={inputDetails.password}
            />
          </div>
          {formStatus === "register" && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="flex items-center text-neutral-800 text-sm font-semibold gap-1"
              >
                Confirm Password{" "}
                <FaStarOfLife className="text-red-600" size={8} />
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="input-primary"
                placeholder="********"
                required
                onChange={handleChange}
                value={inputDetails.confirmPassword}
              />
            </div>
          )}
          {formStatus === "login" ? (
            <span className="text-sm hover:text-blue-600 cursor-pointer hover:underline self-end">
              Forgot Password?
            </span>
          ) : (
            <span className="text-sm   self-start">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                checked={inputDetails.terms}
              />{" "}
              I agree to the{" "}
              <span className="text-blue-600 font-semibold hover:underline cursor-pointer ">
                Terms and Conditions
              </span>
            </span>
          )}
          <button
            className="button-primary mt-2 "
            name="register"
            onClick={(e) => authenticate(e)}
          >
            {formStatus === "register" ? "Register" : "Login"}
          </button>
          <span className="text-gray-600 self-center mt-3 ">
            {formStatus === "register"
              ? "Already Have Account! "
              : "Don't have account?"}
            <button
              className="text-gray-900 font-bold hover:underline cursor-pointer"
              onClick={changeStatus}
            >
              {formStatus === "login" ? "Register" : "Login"}
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}
