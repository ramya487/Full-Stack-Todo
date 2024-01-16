import React, { useState } from "react";
import Header from "./Header";
import InputField from "./InputField";
import Todos from "./model";
import TodoList from "./TodoList";

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
  return (
    <div>
      <Header />
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos}/>
    </div>
  );
};

export default App;
