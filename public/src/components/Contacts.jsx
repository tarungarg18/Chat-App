import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>MyChat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt=""
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  border-right: 1px solid #4e0eff;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2.2rem;
      transition: transform 0.2s;
    }
    img:hover {
      transform: scale(1.1);
    }
    h3 {
      color: #ffffffcc;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 500;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 0.6rem;
    padding: 0.5rem 0;

    &::-webkit-scrollbar {
      width: 0.3rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #9a86f3;
      border-radius: 1rem;
    }

    .contact {
      background-color: #ffffff20;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;

      &:hover {
        background-color: #9a86f3;
      }

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: border 0.2s;
        }
      }

      .username {
        h3 {
          color: white;
          font-weight: 500;
          word-break: break-word;
        }
      }
    }

    .selected {
      background-color: #9a86f3;
      .avatar img {
        border: 2px solid #fff;
      }
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;
    padding: 0 1rem;

    .avatar {
      img {
        height: 4rem;
        border-radius: 50%;
        border: 2px solid #9a86f3;
      }
    }

    .username {
      h2 {
        color: #ffffffdd;
        font-weight: 600;
        font-size: 1.1rem;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 1rem;
      .username {
        h2 {
          font-size: 0.95rem;
        }
      }
    }
  }
`;
