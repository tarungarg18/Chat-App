import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };


  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be at least 8 characters.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      setLoading(true);
      try {
        const { data } = await axios.post(registerRoute, {
          username: values.username,
          email: values.email,
          password: values.password
        });

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          toast.success("Account created successfully! 🎉", toastOptions);
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          navigate("/");
        }
      } catch (error) {
        const serverMsg = error?.response?.data?.msg;
        toast.error(serverMsg || "Registration failed. Please try again.", toastOptions);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>MyChat</h1>
          </div>
          
          <p className="tagline">Create your account and start chatting 🎉</p>
          
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const glow = keyframes`
  0% { box-shadow: 0 0 5px #4e0eff, 0 0 10px #4e0eff; }
  50% { box-shadow: 0 0 20px #4e0eff, 0 0 30px #4e0eff; }
  100% { box-shadow: 0 0 5px #4e0eff, 0 0 10px #4e0eff; }
`;

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 4rem;
      animation: ${glow} 2s infinite alternate;
      border-radius: 50%;
    }
    h1 {
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }

  .tagline {
    color: #ddd;
    text-align: center;
    margin-top: -1rem;
    font-size: 0.9rem;
    font-style: italic;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2rem;
    padding: 3rem 4rem;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.02);
    }
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    transition: all 0.3s ease;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
      animation: ${glow} 1.5s infinite alternate;
    }
  }

  button {
    background: linear-gradient(90deg, #4e0eff, #997af0);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-3px);
      background: linear-gradient(90deg, #997af0, #4e0eff);
    }
    &:disabled {
      background: #555;
      cursor: not-allowed;
      color: #888;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
