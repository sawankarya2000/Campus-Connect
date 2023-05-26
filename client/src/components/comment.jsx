import React from "react";
import { Link } from "react-router-dom";
import Card from "./card";
import CommentForm from "./commentForm";

const Comment = ({ comments, postId }) => {
  console.log(postId);
  let allComments = [];
  if (comments) {
    allComments = comments.map((comment) => {
      return (
        <>
          <div className="card-header flex justify-between items-baseline  gap-5 w-full">
            <div className="card-author flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 fill-gray-300 active:fill-gray-200"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="userName ">{"Anonymous"}</p>
            </div>
            <p className="card-date text-xs">
              {comment.createdAt.split("T")[0]}
            </p>
          </div>
          <div className="card-text font-light text-sm p-1">{comment.text}</div>
        </>
      );
    });
  }
  return (
    <>
      <div className="flex flex-col">
        <div className="font-semibold text-lg mb-2">Comments</div>
        <Card type="comment">
          <CommentForm postId={postId} />
        </Card>
        {allComments.length > 0 ? (
          <Card key={Math.random} type="comment">
            {allComments}
          </Card>
        ) : null}
      </div>
    </>
  );
};

export default Comment;
