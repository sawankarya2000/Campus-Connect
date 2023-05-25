import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/navbar";

const Explore = () => {
  const data = useSelector((state) => state.auth.data);
  console.log(data);
  return (
    <>
      <Navbar />
      <div>hi</div>
    </>
  );
};

export default Explore;
