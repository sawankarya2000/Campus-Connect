import React from "react";

const Card = ({ children, type }) => {
  return (
    <div
      className={`${
        type == "comment" ? "w-full bg-violet-200" : "w-full md:w-1/3"
      } bg-gray-100 rounded-md drop-shadow-md p-4 mx-auto my-3`}
    >
      {children}
    </div>
  );
};

export default Card;
