import React, { useEffect, useRef } from "react";
import Todos from "./model";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface Props {
  id: string;
  todo: string;
  isDone: boolean;
  handleCheck: (id: string) => void;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  editState: boolean;
  editId: string;
  edit: string;
  setEdit: React.Dispatch<React.SetStateAction<string>>;
  handleEditSubmit: (e: React.FormEvent, id: string) => void;
}

const SingleTodo: React.FC<Props> = ({
  id,
  todo,
  isDone,
  handleCheck,
  handleDelete,
  handleEdit,
  editState,
  editId,
  edit,
  setEdit,
  handleEditSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [editState]);
 
  return (
    <div className="w-full p-3 bg-slate-300 rounded flex justify-between">
      {editState && editId == id ? (
        <form onSubmit={(e) => handleEditSubmit(e, id)}>
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setEdit(e.target.value)}
            value={edit}
            className="p-2 rounded"
          />
        </form>
      ) : (
        <div className={`text-lg ${isDone && `line-through`}`}>{todo}</div>
      )}
      <div className="flex gap-2">
        <FaCheck
          size={20}
          onClick={() => handleCheck(id)}
          className="cursor-pointer"
        />
        <MdDelete
          size={20}
          className="cursor-pointer"
          onClick={() => handleDelete(id)}
        />
        <FaEdit
          size={20}
          className="cursor-pointer"
          onClick={() => handleEdit(id)}
        />
      </div>
    </div>
  );
};

export default SingleTodo;
