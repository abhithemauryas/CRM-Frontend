import topTost from "@/utils/topTost";
import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = ({ registerPath, resetPath }) => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const fetchUser = async () => {
   try {
     const formData = {
      emailOrMobile,
      password,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      "http://localhost:4500/user/login",
      formData,
      config
    );
    const {token,userId,name,email,role}= response.data;
    console.log(role, response.data)
    localStorage.setItem("crmToken", token);
    localStorage.setItem("crmUser", JSON.stringify({ name, email, userId }));
    // localStorage.setItem("crmUser", JSON.stringify({ name, email, userId }));
    localStorage.crmRole = role;

    console.log("User logged in successfully:", response.data);
    // alert("User logged in successfully");
    topTost(response?.data?.message || "Login successful!", "success"); // on success
    
    navigate("/");
   } catch (error) {
    console.error("Error during login:", error);
    topTost(error?.response?.data?.message || "Login failed", "error"); 
   }

  };
  const submitHandler=(e)=>{
    e.preventDefault();
    if (!emailOrMobile || !password) {
      alert("Please fill in all fields");
      return;
    }
    fetchUser();
  }
  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Login</h2>
      <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
      <p className="fs-12 fw-medium text-muted">
        Thank you for get back <strong>Nelel</strong> web applications, let's
        access our the best recommendation for you.
      </p>
      <form onSubmit={submitHandler} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Email or Username"
            defaultValue="wrapcode.info@gmail.com"
            value={emailOrMobile}
            onChange={(e)=>setEmailOrMobile(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 input-group field">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            // defaultValue="123456"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            
          />
         <div
               className="input-group-text border-start bg-gray-2 c-pointer"
               data-bs-toggle="tooltip"
               title="Show/Hide Password"
               onClick={() => setShowPassword(!showPassword)} // ✅ toggle
             >
               <FiEye size={16} />
             </div>
        </div>
        
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rememberMe"
              />
              <label
                className="custom-control-label c-pointer"
                htmlFor="rememberMe"
              >
                Remember Me
              </label>
            </div>
          </div>
          <div>
            <Link to={resetPath} className="fs-11 text-primary">
              Forget password?
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100">
            Login
          </button>
        </div>
      </form>
      <div className="w-100 mt-5 text-center mx-auto">
        <div className="mb-4 border-bottom position-relative">
          <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">
            or
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <a
            href="#"
            className="btn btn-light-brand flex-fill"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            title="Login with Facebook"
          >
            <FiFacebook size={16} />
          </a>
          <a
            href="#"
            className="btn btn-light-brand flex-fill"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            title="Login with Twitter"
          >
            <FiTwitter size={16} />
          </a>
          <a
            href="#"
            className="btn btn-light-brand flex-fill"
            data-bs-toggle="tooltip"
            data-bs-trigger="hover"
            title="Login with Github"
          >
            <FiGithub size={16} className="text" />
          </a>
        </div>
      </div>
      <div className="mt-5 text-muted">
        <span> Don't have an account? </span>
        <Link to={registerPath} className="fw-bold">
          {" "}
          Create an Account
        </Link>
      </div>
    </>
  );
};

export default LoginForm;
