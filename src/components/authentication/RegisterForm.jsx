import topTost from "@/utils/topTost";
import axios from "axios";
import React, { useState } from "react";
import { FiEye, FiHash } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = ({ path }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    const navigate =useNavigate();

  const fetchUser = async () => {
    try {
      const formData = {
        name,
        email,
        mobileNumber,
        address,
        dob,
        role,
        password,
      };
      console.log("Submitting form data:", formData);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(process.env.VITE_BASE_API_URL+ "/user/register", formData, config);
      console.log("Response from registration:", response.data);
      response.data;
      console.log("User registered successfully:", response.data);
      topTost(response?.data?.message || "Login successful!", "success");
      // alert("User registered successfully");
      navigate("/authentication/login/creative");

    } catch (error) {
        console.error("Error during registration:", error);

        topTost(error?.response?.data?.message||"Error during registration","error");
        // alert("Error during registration");
    }

  };
  const submitHandler=(e)=>{
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
     
    }
    
    fetchUser();
  }

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Register</h2>
      {/* <h4 className="fs-13 fw-bold mb-2">Manage all your Duralux crm</h4> */}
      <p className="fs-12 fw-medium text-muted">
        Let's get you all setup, so you can verify your personal account and
        begine setting up your profile.
      </p>
      <form onSubmit={submitHandler} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}

            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            className="form-control"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e)=>setMobileNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" required value={dob} onChange={(e)=>setDob(e.target.value)}/>
        </div>
        <div className="mb-4" >
          <label className="form-label">Select Role</label>
          <select className="form-control" required 
            value={role}
            onChange={(e) => setRole(e.target.value)} >
            <option value="">-- Select Role --</option>
            {/* <option value="admin">Admin</option> */}
            <option value="employee">Employee</option>
            <option value="salesman">Salesman</option>
          </select>
        </div>

        <div className="mb-4 generate-pass">
          <div className="input-group field">
            <input
              type="password"
              className="form-control password"
              id="newPassword"
              placeholder="Password Confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="input-group-text c-pointer gen-pass"
              data-bs-toggle="tooltip"
              title="Generate Password"
            >
              <FiHash size={16} />
            </div>
            <div
              className="input-group-text border-start bg-gray-2 c-pointer"
              data-bs-toggle="tooltip"
              title="Show/Hide Password"
            >
              <FiEye size={16} />
            </div>
          </div>
          <div className="progress-bar mt-2">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <div className="custom-control custom-checkbox mb-2">
            <input
              type="checkbox"
              className="custom-control-input"
              id="receiveMial"
              required
            />
            <label
              className="custom-control-label c-pointer text-muted"
              htmlFor="receiveMial"
              style={{ fontWeight: "400 !important" }}
            >
              Yes, I wnat to receive Duralux community emails
            </label>
          </div>
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="termsCondition"
              required
            />
            <label
              className="custom-control-label c-pointer text-muted"
              htmlFor="termsCondition"
              style={{ fontWeight: "400 !important" }}
            >
              I agree to all the <a href="#">Terms &amp; Conditions</a> and{" "}
              <a href="#">Fees</a>.
            </label>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100">
            Create Account
          </button>
        </div>
      </form>
      <div className="mt-5 text-muted">
        <span>Already have an account?</span>
        <Link to={path} className="fw-bold">
          {" "}
          Login
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
