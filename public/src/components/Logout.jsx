import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff, BiTrashAlt } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute, deleteAccountRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const userId = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )._id;

      await axios.get(`${logoutRoute}/${userId}`);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (!confirmDelete) return;

      const userId = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      )._id;

      await axios.delete(`${deleteAccountRoute}/${userId}`);
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <button onClick={handleLogout} title="Logout">
        <BiPowerOff />
      </button>
      <button onClick={handleDeleteAccount} title="Delete Account">
        <BiTrashAlt />
      </button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
    &:hover {
      background-color: #7a64c7;
    }
    svg {
      font-size: 1.3rem;
      color: #ebe7ff;
    }
  }
`;
