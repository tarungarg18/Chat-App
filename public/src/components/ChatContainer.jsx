import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      const data = JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });

      const messagesWithTime = response.data.map(msg => ({
        ...msg,
        time: new Date(msg.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      setMessages(messagesWithTime);
    };
    fetchMessages();
  }, [currentChat]);

  // Handle sending message
  const handleSendMsg = async (msg) => {
    const data = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg, time: formattedTime }]);
  };

  useEffect(() => {
    if (!socket.current) return;
    const handleSent = ({ to, msg }) => {
      if (!currentChat || currentChat._id !== to) return;
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { fromSelf: true, message: msg, time: formattedTime }]);
    };
    socket.current.off("msg-sent");
    socket.current.on("msg-sent", handleSent);
    return () => {
      socket.current.off("msg-sent", handleSent);
    };
  }, [socket, currentChat]);

  useEffect(() => {
    if (!socket.current) return;
    const handleReceive = (msg) => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setArrivalMessage({ fromSelf: false, message: msg, time: formattedTime });
    };
    socket.current.off("msg-recieve");
    socket.current.on("msg-recieve", handleReceive);
    return () => {
      socket.current.off("msg-recieve", handleReceive);
    };
  }, [socket, currentChat]);


  useEffect(() => {
    if (arrivalMessage) setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
                <span className="time">{message.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #1e1e2f;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #0d0d1a;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar img {
        height: 3rem;
        border-radius: 50%;
        border: 2px solid #4f04ff;
      }

      .username h3 {
        color: #ffffff;
        font-weight: 500;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow-y: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #4f04ff88;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 45%;
        padding: 0.9rem 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #e0e0e0;
        word-wrap: break-word;
        background-color: #2b2b3a;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        position: relative;
      }

      .content:hover {
        transform: scale(1.02);
      }

      .time {
        display: block;
        font-size: 0.7rem;
        color: #b0b0b0;
        text-align: right;
        margin-top: 0.3rem;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff44;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff44;
      }
    }
  }
`;
