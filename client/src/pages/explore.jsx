import React from "react";
import { useSelector } from "react-redux";

const Explore = () => {
  const data = useSelector((state) => state.auth.data);
  console.log(data);
  return (
    <>
      <div>hi</div>
    </>
  );
};

export default Explore;
