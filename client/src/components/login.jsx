import { React, useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if JWT token is present in the cookie
    const token = localStorage.getItem("jwt");

    if (token) {
      console.log(token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login logic
    const response = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    // Store JWT token in the cookie or local storage
    // const token = "your-jwt-token"; // Replace with the actual JWT token
    // localStorage.setItem("token", token);
  };

  return (
    <>
      <div className="login-wrapper">
        <div>
          <h1 className="text-2xl">Campus Connect</h1>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Login;
