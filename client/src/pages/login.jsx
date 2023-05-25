import { React } from "react";
import LoginForm from "../components/loginForm";

const Login = () => {
  return (
    <>
      <div className="form-wrapper flex flex-col sm:grid sm:grid-cols-2 sm:gap-10 place-items-center min-h-screen">
        <div className="left-login flex flex-col items-start justify-center sm:gap-3 py-6 sm:py-0">
          <h1 className="text-3xl sm:text-7xl font-semibold text-blue-500">
            Campus Connect
          </h1>
          <p className="text-xl sm:text-3xl font-medium">
            Connect and Share With The Campus
          </p>
        </div>
        <div className="form-wrapper flex justify-center items-center bg-slate-100 p-6 rounded-lg shadow-lg m-2">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;
