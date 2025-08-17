import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      const storedUser = localStorage.getItem(
        process.env.REACT_APP_LOCALHOST_KEY
      );
      if (storedUser) {
        const { username } = JSON.parse(storedUser);
        setUserName(username);
      }
    };
    fetchUser();
  }, []);

  return (
    <Container>
      <RobotImg src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{userName || "User"}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

// Optional animation for robot
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;

  h1 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 400;
    color: #b0b0b0;
  }

  span {
    color: #4e0eff;
  }
`;

const RobotImg = styled.img`
  height: 20rem;
  animation: ${float} 3s ease-in-out infinite;
`;
