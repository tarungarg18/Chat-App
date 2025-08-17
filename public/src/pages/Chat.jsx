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

      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser]);

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

  return (
    <Container>
      <div className="header">
        <img src={Logo} alt="MyChat Logo" />
        <h1>MyChat</h1>
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
    gap: 1rem;
    margin-top: 1rem;

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
