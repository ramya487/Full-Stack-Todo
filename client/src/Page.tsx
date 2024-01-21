import React, { useState, useEffect, useReducer } from "react";
import Header from "./Header";
import InputField from "./InputField";
import Todos from "./model";
import TodoList from "./TodoList";
import axios from "axios";


export type Action = {
  type: string;
  payload: {
    id?: string;
    data?: Todos[];
    task?: string;
  };
};

export const ACTIONS = {
  ADD_TODO: "add-todo",
  CHECK_TODO: "check-todo",
  EDIT_TODO: "edit-todo",
  DELETE_TODO: "delete-todo",
};

const reducer = (todos: Todos[], action: Action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return action.payload.data || todos;
    case ACTIONS.CHECK_TODO:
      return todos.map((item) =>
        item.id == action.payload.id
          ? {
              id: item.id,
              todo: item.todo,
              isDone: !item.isDone,
              signupid: item.signupid,
            }
          : {
              id: item.id,
              todo: item.todo,
              isDone: item.isDone,
              signupid: item.signupid,
            }
      );
    case ACTIONS.EDIT_TODO:
      return todos.map((item) =>
        item.id == action.payload.id
          ? {
              ...item,
              todo: action.payload.task || "",
            }
          : item
      );
    case ACTIONS.DELETE_TODO:
      return todos.filter((item) => item.id != action.payload.id);
    default:
      return todos;
  }
};

const Page = () => {
  const [todo, setTodo] = useState<string>("");

  const [todos, dispatch] = useReducer(reducer, []);

  const signupid = localStorage.getItem("signupid");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;
    try {
      const response = await axios.post<Todos[]>(
        `${process.env.REACT_APP_BACKEND_URL}/add/${signupid}`,
        {
          todo: todo,
        }
      );

      if (response) {
        // dispatch({ type: ACTIONS.ADD_TODO, payload: { data: response.data } });
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
          dispatch({
            type: ACTIONS.ADD_TODO,
            payload: { data: response.data },
          });
        }
      } catch (Err) {
        alert(Err);
      }
    };
    fetchData();
  }, [todo]);
  return (
    <div>
      <Header />
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} dispatch={dispatch} />
    </div>
  );
};

export default Page;
