// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logo from "../assets/logo.png";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!storedUser) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, [navigate]);

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      // Listen for force logout events (when user is deleted by admin)
      socket.current.on("forceLogout", (data) => {
        const reason = data?.reason || "You have been logged out";
        alert(`🚨 ${reason}`);
        localStorage.clear();
        navigate("/login");
      });

      // Admin broadcast: a user was deleted
      socket.current.on("userDeleted", ({ userId }) => {
        // If current chat is the deleted user, close it
        setContacts((prev) => prev.filter((u) => u._id !== userId));
        setCurrentChat((prev) => (prev && prev._id === userId ? undefined : prev));
      });

      // Admin broadcast: all users deleted
      socket.current.on("usersDeleted", () => {
        setContacts([]);
        setCurrentChat(undefined);
        // If desired, force logout handled by backend for online users
      });

      // Admin broadcast: messages cleared
      socket.current.on("messagesCleared", () => {
        // No need to logout; just force refresh of current chat container by resetting it
        setCurrentChat((prev) => (prev ? { ...prev } : prev));
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser, navigate]);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone!")) {
      try {
        await axios.delete(`${host}/api/auth/delete/${currentUser._id}`);
        alert("Account deleted successfully");
        localStorage.clear();
        navigate("/login");
      } catch (error) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  return (
    <Container>
      <div className="header">
        <div className="logo-section">
          <img src={Logo} alt="MyChat Logo" />
          <h1>MyChat</h1>
        </div>
        <div className="user-actions">
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
          <button onClick={handleDeleteAccount} className="delete-btn">
            🗑️ Delete Account
          </button>
        </div>
      </div>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat ? (
          <ChatContainer currentChat={currentChat} socket={socket} />
        ) : (
          <Welcome />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #131324;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 2rem;
    background-color: #232323;
    border-bottom: 1px solid #333;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;

      img {
        height: 4rem;
        transition: transform 0.3s ease, filter 0.3s ease;
      }
      img:hover {
        transform: scale(1.2) rotate(10deg);
        filter: brightness(1.2);
        cursor: pointer;
      }
      h1 {
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
    }

    .user-actions {
      display: flex;
      gap: 1rem;

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .logout-btn {
        background-color: #ff4d4d;
        color: white;
      }
      .logout-btn:hover {
        background-color: #ff3333;
      }

      .delete-btn {
        background-color: #ff9900;
        color: white;
      }
      .delete-btn:hover {
        background-color: #ff8800;
      }
    }
  }

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(0,0,0,0.5);

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
