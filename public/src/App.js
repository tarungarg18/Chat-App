import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import socket from "./socket";

export default function App() {
	useEffect(() => {
		try {
			const raw = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
			if (raw) {
				const user = JSON.parse(raw);
				if (user?._id) {
					socket.emit("add-user", user._id);
				}
			}
		} catch {}
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/setAvatar" element={<SetAvatar />} />
				<Route path="/" element={<Chat />} />
			</Routes>
		</BrowserRouter>
	);
}
