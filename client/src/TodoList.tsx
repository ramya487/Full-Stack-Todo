import React, { useRef, useState } from 'react'
import Todos from "./model";
import SingleTodo from './SingleTodo';
import axios from 'axios';
import {ACTIONS} from "./Page";
import { Action } from './Page';

interface Todos_ {
    todos: Todos[];
    dispatch: React.Dispatch<Action>;
}

interface Response {
  Status: string;
}

const TodoList: React.FC<Todos_> = ({todos, dispatch}) => {
    const handleCheck = async (id: number) => {
        dispatch({type: ACTIONS.CHECK_TODO, payload: {id: id}});
        try{
          const response = await axios.put<Response>(`${process.env.REACT_APP_BACKEND_URL}/check/${id}`);
        }catch (Err){
          alert(Err);
        }
    }

    const handleDelete = async (id: number) => {
      dispatch({type: ACTIONS.DELETE_TODO, payload: {id: id}});
        try {
          const response = await axios.delete<Response>(`${process.env.REACT_APP_BACKEND_URL}/delete/${id}`);
        } catch (Err){
          alert(Err);
        }
    }

    const [edit, setEdit] = useState<string>("");
    const [editState, setEditState] =useState<boolean>(false);
    const [editId, setEditId] = useState<number>(-1);

    const handleEdit = (id: number) => {
      setEditState(!editState);
      setEditId(id);
      setEdit((todos.filter(item => item.id == id))[0].todo);
    }

    const handleEditSubmit = async (e:React.FormEvent, id: number) => {
      e.preventDefault();
      try {
        const response = await axios.post<Response>(`${process.env.REACT_APP_BACKEND_URL}/edit/${id}`, {
          edit: edit
        });
      } catch (Err){
        alert(Err);
      }
      dispatch({type: ACTIONS.EDIT_TODO, payload: {id: id, task: edit}});
      setEditState(false);
      setEditId(-1);
      setEdit("");
    }
  return (
    <div className='flex flex-col p-5 m-6 gap-3'>{todos.map((item) => <SingleTodo key={item.id} id={item.id}  todo={item.todo} isDone={item.isDone} handleCheck={handleCheck} handleDelete={handleDelete} handleEdit={handleEdit} editState={editState} editId={editId} edit={edit} setEdit={setEdit} handleEditSubmit={handleEditSubmit} />)}</div>
  )
}

export default TodoList