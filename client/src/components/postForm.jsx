import React, { useState } from "react";
import api from "../features/api";

const PostForm = ({ name }) => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (text === "") {
      return;
    }
    // Create a new FormData object
    const formData = new FormData();
    formData.append("text", text);
    if (media) {
      formData.append("file", media);
    }

    // Make the POST request using Axios
    const response = await api.post("/posts", formData);
    console.log(response);
    // Clear the form after submission
    setText("");
    setMedia(null);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            id="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your post text"
            className="w-full h-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            id="media"
            accept="image/*, video/*"
            onChange={handleMediaChange}
            className="p-2 border w-2/3 border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;
