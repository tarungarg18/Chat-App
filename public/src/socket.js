import { io } from "socket.io-client";
import { host } from "./utils/APIRoutes";

const socket = io(host, { withCredentials: true });

socket.on("forceLogout", (data) => {
  const reason = data?.reason || "You have been logged out";
  alert(`🚨 ${reason}`);
  localStorage.clear();
  window.location.href = "/login";
});

export default socket;
