import React, { useState } from "react";
import { Router, Routes, Link, Route, useNavigate } from "react-router-dom";
import axios from 'axios';


const Signup = () => {
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  
  const navigate = useNavigate();

  // axios.defaults.withCredentials = true;

  interface Response {
    Status: string;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
        const response = await axios.post<Response>(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
            signupEmail: signupEmail,
            signupPassword: signupPassword
        });
        if (response.data.Status == "Email Exists"){
            alert("Email Already Exists..Login");
        } else if (response.data.Status == "Data Inserted"){
            navigate("/", {replace:true});
        }
    }catch (Err){
        alert(Err);
    }
  }
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <form className="w-1/2 flex flex-col gap-4" onSubmit={(e) => handleSignup(e)}>
        <h1 className="text-4xl font-bold">Signup</h1>
        <p className="text-lg">
            Already have an account? <Link to='/' className="hover:text-blue-900">Login</Link></p>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-1/2 p-2"
          onChange={(e) => setSignupEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-1/2 p-2"
          onChange={(e) => setSignupPassword(e.target.value)}
        />
        <button className="w-1/2" type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
