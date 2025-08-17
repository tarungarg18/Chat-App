# 💬 Chat-App

A full-stack real-time chat application built with Node.js, Express, MongoDB, Socket.io, and React.
It supports authentication, avatars, and instant one-to-one messaging.

## 🚀 Features

🔐 User Authentication – Register, login, and delete accounts

🖼 Set Profile Avatar – Personalize your profile

👥 User List – See all registered users except yourself

💬 Real-time Messaging – Powered by Socket.io

📦 Persistent Chat Storage – Messages saved in MongoDB

📡 RESTful API – For authentication and messaging

🗑 Admin Option – Delete all users (for testing/dev cleanup)

## 🛠 Tech Stack

Frontend: React.js, Axios

Backend: Node.js, Express.js, Socket.io

Database: MongoDB + Mongoose

Other: dotenv, nodemon, cors

## 📂 Project Structure
Chat-App/
│── server/               # Backend
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose models (User, Message)
│   ├── routes/           # Auth & Message routes
│   ├── index.js          # Backend entry point
│   ├── .env              # Environment variables
│── public/src/           # Frontend React app
│   ├── App.js
│   ├── index.js
│   ├── components/
│── package.json
│── README.md

## ⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/tarungarg18/Chat-App.git
cd Chat-App

2. Setup backend
cd server
npm install


Create a .env file inside server/:

PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/chatapp


Start the backend:

nodemon index.js


Server will run at:

http://localhost:5000

3. Setup frontend
cd ../public
npm install
npm start


Frontend will run at:

http://localhost:3000

## 🔗 API Endpoints
Authentication

POST /api/auth/register → Register a new user

POST /api/auth/login → Login

POST /api/auth/setavatar/:id → Set avatar

DELETE /api/auth/delete/:id → Delete user

Messaging

POST /api/messages/addmsg → Send message

POST /api/messages/getmsg → Fetch messages

Utility

GET /ping → Quick health check

## 📡 Socket.io Events

add-user – Register user as online

send-msg – Send message to another user

msg-recieve – Receive message from another user

## 🧩 Development Tools

Nodemon for auto-restart

MongoDB Compass for DB management

Postman for API testing

## 🔮 Future Improvements

Group chats

Online/offline indicators

File & image sharing

Deployment on Render/Heroku + Netlify/Vercel

## 👤 Author

This project was created by Tarun Garg.