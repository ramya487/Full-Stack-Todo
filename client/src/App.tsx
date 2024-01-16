import React, { useState, useEffect } from "react";
import Header from "./Header";
import InputField from "./InputField";
import Todos from "./model";
import TodoList from "./TodoList";
import axios from 'axios';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");

  const [todos, setTodos] = useState<Todos[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo){
      setTodos([...todos, {id: Date.now(), todo: todo, isDone: false}]);
      setTodo("");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try{
      const response = await axios.get<Todos[]>("http://localhost:3001/");
      if (response){
        console.log(response);
        setTodos(response.data);
      }
      }catch (Err){
        alert(Err);
      }
    }
    fetchData();
  },[])
  
  return (
    <div>
      <Header />
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos}/>
    </div>
  );
};

export default App;
