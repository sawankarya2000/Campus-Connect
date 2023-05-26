import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../features/api";
import Navbar from "../components/navbar";
import Card from "../components/card";

const searchResults = () => {
  const [results, setResults] = useState([]);
  const searchQuery = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      const response = await api.get(`/users/?name=${searchQuery}`);
      console.log(response.data.data.user);
      setResults(response.data.data.user);
    };

    fetchApi();
  }, [searchQuery]);

  const allResults = results.map((result) => {
    return (
      <Card key={result.id} type="result">
        <div className="card-body">
          <div className="card-header flex justify-between items-baseline  gap-5">
            <div
              className="card-author flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(`/profile/${result._id}`)}
            >
              {result.photo == "default.jpg" ? (
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
                  src={`http://127.0.0.1:3000/api/v1/files/${result.photo}`}
                  alt="profile"
                  className="h-7 rounded-full cursor-pointer"
                />
              )}
              <p className="userName font-semibold text-xl">
                {result.firstName}
              </p>
            </div>
            <p className="card-date text-xs">
              {result.createdAt.split("T")[0]}
            </p>
          </div>
        </div>
      </Card>
    );
  });
  return (
    <>
      <Navbar />
      {allResults}
    </>
  );
};

export default searchResults;
