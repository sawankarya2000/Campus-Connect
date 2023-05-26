import React, { useState } from "react";
import api from "../features/api";
import Card from "./card";

const AssignmentForm = ({ name }) => {
  const [info, setInfo] = useState({
    title: "",
    deadline: "",
    course: "",
    batch: "",
  });
  const [media, setMedia] = useState(null);

  const handleInfoChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      info.title === "" ||
      info.deadline === "" ||
      info.course === "" ||
      info.batch === ""
    ) {
      return;
    }
    // Create a new FormData object
    const formData = new FormData();
    formData.append("title", info.title);
    formData.append("deadline", info.deadline);
    formData.append("course", info.course);
    formData.append("batch", info.batch);
    if (media) {
      formData.append("file", media);
    } else {
      return;
    }

    // Make the POST request using Axios
    const response = await api.post("/assignments/", formData);

    // Clear the form after submission
    setInfo("");
    setMedia(null);
  };

  return (
    <Card type="assignment">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">{name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              id="text"
              name="title"
              value={info.title}
              onChange={handleInfoChange}
              placeholder="Assignment Title"
              className="w-full border border-gray-300 p-3 mb-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
            />
            <input
              type="date"
              id="deadline"
              className="w-full border border-gray-300 p-3 mb-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
              placeholder="Enter your date of birth"
              name="deadline"
              value={info.deadline}
              onChange={handleInfoChange}
            />
            <select
              id="course"
              className="w-full border border-gray-300 mb-4 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
              name="course"
              value={info.course}
              onChange={handleInfoChange}
            >
              <option value="">Select a course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="M.Sc">M.Sc</option>
              <option value="BA">BA</option>
              <option value="MA">MA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
            </select>
            <input
              id="text"
              name="batch"
              value={info.batch}
              onChange={handleInfoChange}
              placeholder="Enter your Batch"
              className="w-full border border-gray-300 p-3 mb-2 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              id="media"
              accept=".pdf"
              onChange={handleMediaChange}
              className="p-2 border w-2/3 border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Create Assignment
          </button>
        </form>
      </div>
    </Card>
  );
};

export default AssignmentForm;
