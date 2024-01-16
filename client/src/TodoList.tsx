import React, { useRef, useState } from 'react'
import Todos from "./model";
import SingleTodo from './SingleTodo';

interface Todos_ {
    todos: Todos[];
    setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
}

const TodoList: React.FC<Todos_> = ({todos, setTodos}) => {
    const handleCheck = (id: number) => {
        setTodos(todos.map(item => item.id == id ? {id:item.id, todo: item.todo, isDone: !item.isDone} : {id:item.id, todo: item.todo, isDone: item.isDone}))
    }

    const handleDelete = (id: number) => {
        setTodos(todos.filter(item => item.id != id))
    }

    const [edit, setEdit] = useState<string>("");
    const [editState, setEditState] =useState<boolean>(false);
    const [editId, setEditId] = useState<number>(-1);

    const handleEdit = (id: number) => {
      setEditState(!editState);
      setEditId(id);
      setEdit((todos.filter(item => item.id == id))[0].todo);
    }

    const handleEditSubmit = (e:React.FormEvent, id: number) => {
      e.preventDefault();
      setTodos(todos.map(item => item.id == id ? {id: item.id, todo: edit, isDone: item.isDone} : item));
      setEditState(false);
      setEditId(-1);
      setEdit("");
    }
  return (
    <div className='flex flex-col p-5 m-6 gap-3'>{todos.map((item) => <SingleTodo key={item.id} id={item.id}  todo={item.todo} isDone={item.isDone} handleCheck={handleCheck} handleDelete={handleDelete} handleEdit={handleEdit} editState={editState} editId={editId} edit={edit} setEdit={setEdit} handleEditSubmit={handleEditSubmit} />)}</div>
  )
}

export default TodoList