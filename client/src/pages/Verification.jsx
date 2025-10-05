import {  Mail, RefreshCcw, RotateCcw } from "lucide-react";
import React, { useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { UserContext } from "../App";

const Verification = () => {
  const email = useLocation().state.email||"";
  const username=useLocation().state.username||""
  const [user ,setUser]=useContext(UserContext)
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const navigate=useNavigate()

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
    const newCode = [...code];

    if (value.length === 0) {
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    // if user pastes multiple digits
    if (value.length > 1) {
      value.split("").forEach((num, i) => {
        if (index + i < 6) newCode[index + i] = num;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + value.length, 5);
      inputsRef.current[nextIndex].focus();
      return;
    }

    // single digit input
    newCode[index] = value;
    setCode(newCode);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index] === "") {
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const enteredCode = code.join("");
    console.log("Verification code:", enteredCode);
    try {
      const resp=await axiosInstance.post('/authentication/verification',{
        email:email,
        code:enteredCode
      })
      console.log(resp);
      setUser(resp.data)
      navigate('/dashboard')
      
      
    } catch (error) {
      console.log(error);
      
    }
  };

  const resendCode=async()=>{

  }
  return (
    <div className="bg-gray-100 flex flex-col gap-10 items-center justify-center p-20 w-full h-screen">
      <div className="bg-white px-5 py-10 rounded-lg border border-gray-300 shadow-lg w-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-200 rounded-xl p-3 text-neutral-800">
            <Mail size={30} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mt-2">
            Verify Your Email
          </h2>
          <p className="text-md text-neutral-700">
            Verification Code sent to{" "}
            <span className="text-gray-900 font-semibold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 px-4 flex flex-col gap-6">
          <label className="flex items-center text-neutral-800 text-sm font-semibold gap-1">
            Enter Code
          </label>
          <div className="flex items-center justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="input-primary max-w-[50px] text-3xl text-center"
              />
            ))}
          </div>
          <button className="self-start flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer mt-3" onClick={()=>resendCode()}>Resend Code <RotateCcw /></button>
          <button
            type="submit"
            className="button-primary "
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
