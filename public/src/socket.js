import { io } from "socket.io-client";

// Connect to backend socket server
const socket = io("http://localhost:5000");

// Listen for forceLogout event
socket.on("forceLogout", (data) => {
  const reason = data?.reason || "You have been logged out";
  alert(`🚨 ${reason}`);
  localStorage.clear();
  window.location.href = "/login";
});

export default socket;
