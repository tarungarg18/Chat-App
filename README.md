# 💬 MyChat
Full-stack real-time chat app built with Node.js, Express, MongoDB, Socket.io, and React.
Supports email/password auth, avatars, one-to-one messaging, and an Admin Panel.

# Live Demo:

Frontend: https://chat-app-frontend-kag8.onrender.com

Admin Panel: https://admin-panel-67kf.onrender.com/

# 🚀 Features

### 🔐 Auth: Register, login, delete accounts

### 🖼 Avatars: Personalize profiles

### 💬 Real-time Messaging: Powered by Socket.io. Refresh chat to get new messages

### 👥 User Management: View all users

### ⚙️ Admin Panel: Manage users/messages, force logout

### 📦 Persistence: Data stored in MongoDB

# 🛠 Tech Stack

Frontend: React.js, Axios, Styled Components
Backend: Node.js, Express.js, Socket.io
Database: MongoDB + Mongoose
Other: dotenv, nodemon, cors

# 📂 Project Structure
Chat-App/
<br>
├── server/          # Backend
<br>
├── public/          # Chat app frontend
<br>
├── admin-panel/     # Admin frontend
<br>
└── README.md

# ⚙️ Setup
### 1. Clone & Backend
  git clone https://github.com/tarungarg18/Chat-App.git
  cd Chat-App/server

  npm install

  .env example:
  PORT=5000
  MONGO_URL=mongodb://127.0.0.1:27017/chatapp
  ADMIN_KEY=your_admin_key

  npm run dev   # development

  npm start     # production

### 2. Frontend
cd ../public
npm install
npm start

### 3. Admin Panel
cd ../admin-panel
npm install
npm start

# 🔗 API Overview

Auth: /api/auth/*

Messaging: /api/messages/*

Admin: /api/admin/* (requires x-admin-key)

Socket.io Events: add-user, send-msg, msg-recieve, forceLogout

#### Tip: Refresh chat to see new messages.

# 📸 Screenshots
### 1. Login:
<img width="645" height="640" alt="image" src="https://github.com/user-attachments/assets/437e9841-7faf-4aad-8713-0ee5affca8cb" />

### 2. Register:
<img width="589" height="801" alt="image" src="https://github.com/user-attachments/assets/0fa19225-6a12-403d-8cc8-c1eb24b03b74" />

### 3. Avatar Selection:
<img width="1891" height="656" alt="image" src="https://github.com/user-attachments/assets/e187f1b4-ec95-40a4-939b-5a9b7f2f05f0" />

### 4. User Interface:
<img width="1905" height="895" alt="image" src="https://github.com/user-attachments/assets/7e42fe44-5c46-441d-b965-dfdbdb2f000b" />

### 5. Admin Panel:
<img width="1680" height="504" alt="image" src="https://github.com/user-attachments/assets/9eb2ac3c-91f2-4092-8bfc-d4c42fc769c3" />










