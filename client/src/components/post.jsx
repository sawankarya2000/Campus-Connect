import React, { useState } from "react";
import Card from "./card";
import Comment from "./comment";
import api from "../features/api";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [clickedComment, setClickedComment] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const handleLike = async () => {
    setLiked(true);
    setLikeCount((lastCount) => lastCount + 1);
    const response = await api.patch(`/posts/${post.id}/like`);
    console.log(response);
  };

  const navigate = useNavigate();

  const handleComment = () => {
    setClickedComment((lastState) => !lastState);
  };
  return (
    <>
      <Card>
        <div className="card-content flex flex-col gap-2">
          <div className="card-header flex justify-between items-baseline  gap-5">
            <div
              className="card-author flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(`/profile/${post.author._id}`)}
            >
              {post.author.photo == "default.jpg" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-gray-300 active:fill-gray-200"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <img
                  src={`http://127.0.0.1:3000/api/v1/files/${post.author.photo}`}
                  alt="profile"
                  className="h-7 rounded-full cursor-pointer"
                />
              )}
              <p className="userName font-semibold text-xl">
                {post.author.firstName}
              </p>
            </div>
            <p className="card-date text-xs">{post.createdAt.split("T")[0]}</p>
          </div>
          <div className="card-text font-light">{post.text}</div>
          {post.media ? (
            <div className="card-media">
              <img
                src={`http://127.0.0.1:3000/api/v1/files/${post.media}`}
                alt="photo"
                className=" max-w-full max-h-full"
              />
            </div>
          ) : null}
          <div className="card-options grid grid-cols-2">
            <div
              className="like-icon flex items-center justify-start p-2 gap-2 cursor-pointer"
              onClick={handleLike}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 stroke-blue-500 active:fill-blue-500 ${
                  liked && "fill-blue-500"
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
              <span className=" font-medium">Like</span>
              <span>{likeCount}</span>
            </div>
            <div
              className="comment-icon flex items-center justify-start p-2 gap-2 cursor-pointer"
              onClick={handleComment}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-blue-500 active:fill-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              <span className=" font-medium">Comment</span>
            </div>
          </div>
          {clickedComment && (
            <div className="card-comments ">
              <Comment comments={post.comments} postId={post.id} />
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default Post;
