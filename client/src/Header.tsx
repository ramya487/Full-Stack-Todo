import React from "react";
import Dropdown_ from "./Dropdown";

const Header = () => {
  return (
    <div className="p-5 flex justify-center flex-col gap-3 items-center text-3xl">
      <div className="self-end">
        <Dropdown_ />
      </div>
      <div>Taskify</div>
    </div>
  );
};

export default Header;
