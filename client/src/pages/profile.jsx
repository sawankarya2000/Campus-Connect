import React, { useEffect, useState } from "react";
import Card from "../components/card";
import Navbar from "../components/navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../features/api";
import { useSelector } from "react-redux";
import Post from "../components/post";

const Profile = () => {
  const savedUserData = useSelector((state) => state.auth.data);

  const [self, setSelf] = useState(false);
  const [id, setId] = useState(useParams().id);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    role: "",
    joiningYear: "",
    course: "",
    department: "",
    photo: "",
  });
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = (await api.get(`/users/${id}`)).data.data.user;
      console.log(response);
      setUserData({
        name: response.firstName + " " + response.lastName,
        email: response.email,
        dateOfBirth: response.dateOfBirth,
        role: response.role,
        joiningYear: response.joiningYear,
        department: response.department,
        photo: response.photo,
      });
      if (response._id === savedUserData.id) setSelf(true);

      const responsePosts = await api.get(`/users/getPost/${id}`);

      setUserPosts(responsePosts.data.data.post);
    };
    fetchData();
  }, [useParams().id]);

  const navigate = useNavigate();
  const handleEditProfile = () => {
    navigate("/edit-profile");
  };
  console.log(userData);

  const allPosts = userPosts.map((post) => {
    return <Post key={post._id} post={post} />;
  });
  return (
    <>
      <Navbar />
      <Card type="profileCard">
        <div className="profile=wrapper flex flex-col gap-4">
          <div className="profile-image-name-batch flex items-center gap-4">
            <Link to={`/profile/${id}`}>
              {userData.photo === "default.jpg" ? (
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
                  src={`http://127.0.0.1:3000/api/v1/files/${userData.photo}`}
                  alt="profile-image"
                  className=" h-28 rounded-full cursor-pointer"
                />
              )}
            </Link>
            <div className="profile-name-batch">
              <h1 className="font-semibold text-4xl text-slate-800">
                {userData.name}
              </h1>
              <h1 className="font-semibold text-xl text-slate-800">
                {userData.department}
                <span>
                  {" "}
                  {userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)}
                </span>
                <span className="font-semibold text-xl text-slate-800">
                  {" "}
                  Joining Year: {userData.joiningYear}
                </span>
              </h1>
            </div>
          </div>
          <div className="profile-buttons-wrapper flex items-center gap-4">
            {self && (
              <div className="profile-edit-button flex items-center gap-4 w-full">
                <button
                  className="w-full bg-blue-500 text-white p-2 rounded-md"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              </div>
            )}
            <div className="profile-edit-button flex items-center gap-4 w-full">
              <button
                className=" w-full bg-blue-500 text-white p-2 rounded-md"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </Card>
      {allPosts}
    </>
  );
};

export default Profile;
