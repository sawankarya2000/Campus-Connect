import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthorized, setData } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Validator from "validatorjs";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    role: "",
    collegeId: "",
    joiningYear: "",
    course: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validationSuccess = (e) => {
    if (!Validator.isEmail(formData.email)) return false;
    if (formData.password.length < 8) return false;
    if (formData.password !== formData.confirmPassword) return false;
    if (formData.firstName === "") return false;
    if (formData.lastName === "") return false;
    if (formData.role === "") return false;
    if (formData.collegeId === "") return false;
    if (formData.joiningYear === "") return false;
    if (formData.course === "") return false;
    if (formData.department === "") return false;
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validationSuccess) {
        const response = await axios.post(
          "http://127.0.0.1:3000/api/v1/users/signup",
          formData
        );
        //Logging response data
        console.log(response);
        if (response.statusText === "Created") {
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
          navigate("/");
          setError("");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: "",
            role: "",
            collegeId: "",
            joiningYear: "",
            course: "",
            department: "",
          });
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            // Redirect to home page
            navigate("/");
          }, 2000);
        } else {
          const errorData = await response;
          setError(errorData.message || "Could Not Login Successfully");
        }
      } else {
        setError("Rquired Fields incorrect or missing");
      }
    } catch (error) {
      setError("An error occurred while signing up.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        <h2 className="text-3xl font-medium mb-3 md:mb-6">Sign Up</h2>
        {success && (
          <div className="mb-4 text-green-500 text-lg animate-bounce">
            Account Created Successfully
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3 md:mb-6">
            <div className="flex mb-2">
              <div className="mr-2 w-full md:w-1/2">
                <label htmlFor="firstName" className="block mb-2 text-lg">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                  placeholder="Enter your first name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-2 w-full md:w-1/2">
                <label htmlFor="lastName" className="block mb-2 text-lg">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                  placeholder="Enter your last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="email" className="block mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-3 md:mb-6">
              <label htmlFor="password" className="block mb-2 text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 md:mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 text-lg">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex mb-3 md:mb-6 md:justify-between">
            <div className="mr-2 w-1/3">
              <label htmlFor="role" className="block mb-2 text-lg">
                Role
              </label>
              <select
                id="role"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select a role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="director">Director</option>
                <option value="hod">Head Of Department</option>
                <option value="alumini">Alumini</option>
              </select>
            </div>
            <div className="mr-2 w-1/3">
              <label htmlFor="collegeId" className="block mb-2 text-lg">
                College ID
              </label>
              <input
                type="text"
                id="collegeId"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Enter your college ID"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
              />
            </div>
            <div className="ml-2 w-1/3">
              <label htmlFor="joiningYear" className="block mb-2 text-lg">
                Joining Year
              </label>
              <input
                type="text"
                id="joiningYear"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Enter your joining year"
                name="joiningYear"
                value={formData.joiningYear}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex mb-3 md:mb-6 md:justify-between">
            <div className="mr-2 w-1/3">
              <label htmlFor="dateOfBirth" className="block mb-2 text-lg">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Enter your date of birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="mr-2 w-1/3">
              <label htmlFor="course" className="block mb-2 text-lg">
                Course
              </label>
              <select
                id="course"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                name="course"
                value={formData.course}
                onChange={handleChange}
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
            </div>
            <div className="ml-2 w-1/3">
              <label htmlFor="department" className="block mb-2 text-lg">
                Department
              </label>
              <input
                type="text"
                id="department"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-lg"
                placeholder="Enter your department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-lg animate-bounce">
              {error}
            </div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg focus:outline-none focus:ring text-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
