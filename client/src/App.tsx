import React, { useState, useEffect } from "react";
import Login from "./Login";
import Page from "./Page";
import axios from "axios";

import { Router, Routes, Link, Route, useNavigate } from "react-router-dom";
import Signup from "./Signup";

const App: React.FC = () => {
  const navigate = useNavigate();
  interface Response {
    Status: string;
    signupid: number;
    email: string;
  }
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get<Response>(
          `${process.env.REACT_APP_BACKEND_URL}/`
        );
        if (response.data.Status == "Authenticated") {
          // find an alternative to local storage
          localStorage.setItem('signupid', response.data.signupid.toString());
          localStorage.setItem('email', response.data.email);
          navigate("/app");
        }
      } catch (error) {
        alert(error);
      }
    };
    checkAuth();
  },[]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Page />} />
      </Routes>
    </div>
  );
};

export default App;
