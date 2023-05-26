import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/navbar";
import Card from "../components/card";
import axios from "axios";
import api from "../features/api";
import Post from "../components/post";
import PostForm from "../components/postForm";

const Explore = () => {
  const data = useSelector((state) => state.auth.data);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/posts", { withCredentials: true });

        const rawData = response.data.data.posts.map((post) => {
          return {
            id: post._id,
            author: post.author,
            text: post.text,
            media: post.media,
            likes: post.totalLikes,
            comments: post.comments,
            createdAt: post.createdAt,
          };
        });
        setPosts(rawData);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const allPosts = posts.map((post) => {
    return <Post key={post.id} post={post} />;
  });
  return (
    <>
      <Navbar />
      <Card>
        <PostForm name={data.name} />
      </Card>
      {allPosts}
    </>
  );
};

export default Explore;
