import React, { useState } from "react";
import api from "../features/api";

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState("");

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(postId);
    const response = await api.patch(`/posts/${postId}/comment`, {
      text: comment,
    });
    console.log(response);

    // Handle the form submission, such as sending the comment to a server or performing other actions
    // You can access the comment value using the 'comment' state variable
    // Example: sendCommentData(comment);

    // Clear the form after submission
    setComment("");
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={handleInputChange}
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Add Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
