import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthorized, setData } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthorized = useSelector((state) => state.auth.authorized);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isAuthorized) {
      navigate("/");
    }
  }, [navigate, dispatch, isAuthorized]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:3000/api/v1/users/login",
        data: {
          email,
          password,
        },
      });

      if (response.statusText === "OK") {
        const responseData = await response.data.data.user;
        const userData = {
          id: responseData._id,
          email: responseData.email,
          name: responseData.firstName + responseData.lastName,
          photo: responseData.photo,
          collegeId: responseData.collegeId,
          course: responseData.course,
          dateOfBirth: responseData.dateOfBirth,
          department: responseData.department,
          role: responseData.role,
        };

        dispatch(setAuthorized(true));
        dispatch(setData(userData));
        setError("");
        navigate("/");
      } else {
        const errorData = await response;
        setError(errorData.message || "Could Not Login Successfully");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full sm:w-96">
        <h2 className="text-3xl font-medium mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-lg animate-bounce">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg focus:outline-none focus:ring text-lg"
            >
              Login
            </button>
            <a href="#" className="text-blue-500 hover:text-blue-600 text-lg">
              Forgot password?
            </a>
          </div>
        </form>
        <p className="text-center text-lg">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            Create your account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
