# 💬 MyChat

A full-stack real-time chat application built with Node.js, Express, MongoDB, Socket.io, and React.
It supports simple email/password auth, avatars, instant one-to-one messaging, and admin panel for user management.

## 🚀 Features

🔐 **User Authentication** – Register, login, and delete accounts

🖼 **Profile Avatar** – Personalize your profile with custom avatars

👥 **User Management** – See all registered users except yourself

💬 **Real-time Messaging** – Powered by Socket.io for instant communication

📦 **Persistent Storage** – Messages and user data saved in MongoDB

📡 **RESTful API** – For authentication and messaging

⚙️ **Admin Panel** – Delete individual users or all users, manage messages

🔒 **Force Logout** – Automatic logout when users are deleted by admin

## 🛠 Tech Stack

**Frontend:** React.js, Axios, Styled Components

**Backend:** Node.js, Express.js, Socket.io

**Database:** MongoDB + Mongoose

**Authentication:** Simple local (email/password)

**Other:** dotenv, nodemon, cors

## 📂 Project Structure
```
Chat-App/
├── server/               # Backend server
│   ├── config/          # (removed) Google OAuth configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose models (User, Message)
│   ├── routes/          # Auth, Message & Admin routes
│   ├── services/        # (removed) Email service for OTP
│   └── index.js         # Backend entry point
├── public/              # Main chat app frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Main pages (Login, Chat, etc.)
│       ├── assets/      # Images and static files
│       └── utils/       # API routes and utilities
├── admin-panel/         # Admin panel frontend
│   └── src/             # React admin interface
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/tarungarg18/Chat-App.git
cd Chat-App
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/chatapp
ADMIN_KEY=change_this_admin_key
```

Start the backend:
```bash
# for development with reload
npm run dev

# for production
npm start
```

Server will run at: `http://localhost:5000`

### 3. Setup Main Chat App
```bash
cd ../public
npm install
npm start
```

Frontend will run at: `http://localhost:3000`
To point to a hosted API, set an env var before build:
```env
REACT_APP_API_URL=https://your-api.example.com
```

### 4. Setup Admin Panel
```bash
cd ../admin-panel
npm install
npm start
```

Admin panel will run at: `http://localhost:3001`

Create an `.env` file inside `admin-panel/`:
```env
REACT_APP_ADMIN_KEY=dev-admin-key
```
Use a stronger secret for production, and rebuild the admin panel after changes.

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` → Register a new user
- `POST /api/auth/login` → Login
- `POST /api/auth/send-verification` → Send email verification OTP
- `POST /api/auth/verify-otp` → Verify email OTP
- `POST /api/auth/setavatar/:id` → Set avatar
- `DELETE /api/auth/delete/:id` → Delete user

### Messaging
- `POST /api/messages/addmsg` → Send message
- `POST /api/messages/getmsg` → Fetch messages

### Admin (Protected with x-admin-key header)
- `GET /api/admin/users` → Get all users
- `DELETE /api/admin/delete-user/:userId` → Delete specific user
- `DELETE /api/admin/delete-all-users` → Delete all users
- `DELETE /api/admin/delete-all-messages` → Delete all messages

### Utility
- `GET /ping` → Quick health check

## 📡 Socket.io Events

- `add-user` – Register user as online
- `send-msg` – Send message to another user
- `msg-recieve` – Receive message from another user
- `forceLogout` – Force logout user (admin action)

## 🔐 Authentication Features

- Simple local auth (email/password)
- Automatic force logout when users are deleted

## 🧩 Development Tools

- **Nodemon** for auto-restart
- **MongoDB Compass** for DB management
- **Postman** for API testing

## 🔮 Future Improvements

- Group chats
- Online/offline indicators
- File & image sharing
- Push notifications
- Deployment on Render/Heroku + Netlify/Vercel

## 📸 Screenshots

![Login](images/login.png)
![Register](images/register.png)
![Chat](images/chat.png)
![Admin](images/admin.png)

## 📝 License

MIT