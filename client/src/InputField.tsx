import React from "react";

interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

const InputField: React.FC<Props> = ({ todo, setTodo, handleAdd }) => {
  return (
    <form className="w-full flex justify-center items-center" onSubmit={(e) => handleAdd(e)}>
      <input
        type="text"
        className="p-5 m-6 bg-slate-200 w-80 focus:bg-slate-400 text-white rounded"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded hover:bg-slate-400" type="submit">
          Go
        </button>
      </div>
    </form>
  );
};

export default InputField;
