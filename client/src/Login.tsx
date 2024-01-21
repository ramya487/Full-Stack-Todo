import React, { useState } from "react";
import { Router, Routes, Link, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  interface Response {
    Status: string;
    email: string;
    signupid: number;
  }

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Response>(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          email: email,
          password: password,
        }
      );
      // console.log(response);
      if (response.data.Status == "Login Success") {
        localStorage.setItem("signupid", response.data.signupid.toString());
        localStorage.setItem("email", response.data.email);
        navigate("/app", { replace: true });
      } else if (response.data.Status == "Email doesn't exists") {
        alert("Email doesn't exists..Signup");
      } else if (response.data.Status == "Incorrect Password") {
        alert("Incorrect Password");
      }
    } catch (Err) {
      alert(Err);
    }
  };
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <form
        className="w-1/2 flex flex-col gap-4"
        onSubmit={(e) => handleLogin(e)}
      >
        <h1 className="text-4xl font-bold">Login</h1>
        <p className="text-lg">
          Don't have an account?{" "}
          <Link to="/signup" className="hover:text-blue-900">
            Signup
          </Link>
        </p>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-1/2 p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-1/2 p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-1/2" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
