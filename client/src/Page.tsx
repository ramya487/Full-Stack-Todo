import React, { useState, useEffect } from "react";
import Header from "./Header";
import InputField from "./InputField";
import Todos from "./model";
import TodoList from "./TodoList";
import axios from "axios";

import { Router, Routes, Link, Route } from "react-router-dom";

const Page = () => {
  const [todo, setTodo] = useState<string>("");

  const [todos, setTodos] = useState<Todos[]>([]);

  const signupid = localStorage.getItem('signupid');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Todos[]>(
        `${process.env.REACT_APP_BACKEND_URL}/add/${signupid}`,
        {
          todo: todo,
        }
      );
      if (response) {
        setTodos(response.data);
        setTodo("");
      }
    } catch (Err) {
      alert(Err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(process.env.REACT_APP_BACKEND_URL);
        const response = await axios.get<Todos[]>(
          `${process.env.REACT_APP_BACKEND_URL}/fetch/${signupid}`
        );
        if (response) {
          console.log(response);
          setTodos(response.data);
        }
      } catch (Err) {
        alert(Err);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Header />
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default Page;
