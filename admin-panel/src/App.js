import React, { useState, useEffect } from "react";
import axios from "axios";

const RAW_BACKEND_URL = process.env.REACT_APP_API_URL || "https://chat-app-1-tpn3.onrender.com";
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, "");
const API = `${BACKEND_URL}/api/admin`;
const ADMIN_KEY = "tarungarg0809";
const ADMIN_AUTH_FLAG = "ADMIN_AUTH_OK";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [authError, setAuthError] = useState("");

  const handleKeySubmit = () => {
    if (inputKey.trim() === ADMIN_KEY) {
      sessionStorage.setItem(ADMIN_AUTH_FLAG, "1");
      setAuthorized(true);
      setAuthError("");
    } else {
      setAuthorized(false);
      setAuthError("Invalid admin");
    }
  };

  const fetchUsers = async () => {
    if (!authorized) {
      alert("Invalid admin");
      return;
    }
    try {
      setLoading(true);
      console.log("Fetching users from:", `${API}/users`);
      
      const res = await axios.get(`${API}/users`, { 
        timeout: 10000
      });
      setUsers(res.data);
      console.log("Users fetched successfully:", res.data.length, "users");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Fetch users error:", { status, data, err });
      alert(
        `Error fetching users${status ? ` (HTTP ${status})` : ""}: ` +
        (data?.error || data?.msg || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAllUsers = async () => {
    if (!authorized) {
      alert("Invalid admin");
      return;
    }
    if (window.confirm("⚠️ Delete ALL users? This cannot be undone.")) {
      try {
        setLoading(true);
        const res = await axios.delete(`${API}/delete-all-users`);
        alert(`${res.data.msg} (${res.data.count} users deleted)`);
        fetchUsers();
      } catch (err) {
        alert("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteIndividualUser = async (userId, username) => {
    if (!authorized) {
      alert("Invalid admin");
      return;
    }
    if (window.confirm(`⚠️ Delete user "${username}"? This cannot be undone.`)) {
      try {
        setLoading(true);
        const res = await axios.delete(`${API}/delete-user/${userId}`);
        alert(`✅ ${res.data.msg}`);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        alert("Error deleting user: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAllMessages = async () => {
    if (!authorized) {
      alert("Invalid admin");
      return;
    }
    if (window.confirm("⚠️ Delete ALL messages? This cannot be undone.")) {
      try {
        setLoading(true);
        const res = await axios.delete(`${API}/delete-all-messages`);
        alert(`${res.data.msg} (${res.data.count} messages deleted)`);
      } catch (err) {
        alert("Error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(ADMIN_AUTH_FLAG) === "1";
    setAuthorized(isAuthed);
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchUsers();
    }
  }, [authorized]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "1200px", margin: "0 auto" }}>
      {!authorized ? (
        <div style={{ maxWidth: "480px", margin: "10vh auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
          <h1 style={{ marginTop: 0 }}>Admin Access</h1>
          <p style={{ color: "#666" }}>Enter the admin key to continue.</p>
          <input
            type="password"
            value={inputKey}
            placeholder="Enter admin key"
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleKeySubmit();
            }}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px" }}
          />
          <button
            onClick={handleKeySubmit}
            style={{ padding: "10px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Continue
          </button>
          {authError && (
            <div style={{ color: "#dc3545", marginTop: "10px" }}>{authError}</div>
          )}
        </div>
      ) : (
        <>
          <h1 style={{ color: "#333", borderBottom: "3px solid #007bff", paddingBottom: "10px" }}>
            ⚙️ Chat App Admin Panel
          </h1>

          <div style={{ marginBottom: "2rem" }}>
            <button
              onClick={deleteAllUsers}
              disabled={loading}
              style={{ 
                marginRight: "10px", 
                padding: "12px 20px", 
                background: "#dc3545", 
                color: "white", 
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "⏳ Processing..." : "🗑️ Delete All Users"}
            </button>

            <button
              onClick={deleteAllMessages}
              disabled={loading}
              style={{ 
                marginRight: "10px", 
                padding: "12px 20px", 
                background: "#fd7e14", 
                color: "white", 
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "⏳ Processing..." : "🗑️ Delete All Messages"}
            </button>

            <button
              onClick={fetchUsers}
              disabled={loading}
              style={{ 
                padding: "12px 20px", 
                background: "#28a745", 
                color: "white", 
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              🔄 Refresh Users
            </button>
          </div>

          <h2 style={{ color: "#555", marginTop: "2rem", marginBottom: "1rem" }}>
            👥 Registered Users ({users.length})
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "24px" }}>⏳ Loading...</div>
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
              <div style={{ fontSize: "18px" }}>No users found</div>
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "1rem" 
            }}>
              {users.map((user) => (
                <div 
                  key={user._id} 
                  style={{ 
                    border: "1px solid #ddd", 
                    borderRadius: "8px", 
                    padding: "1rem", 
                    background: "#f8f9fa",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "#333" }}>👤 {user.username}</strong>
                  </div>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "0.5rem" }}>
                    📧 {user.email}
                  </div>
                  <div style={{ color: "#666", fontSize: "14px", marginBottom: "1rem" }}>
                    🔐 Auth: {user.authMethod || 'local'}
                  </div>
                  
                  <button
                    onClick={() => deleteIndividualUser(user._id, user.username)}
                    disabled={loading}
                    style={{ 
                      padding: "8px 16px", 
                      background: "#dc3545", 
                      color: "white", 
                      border: "none",
                      borderRadius: "4px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    🗑️ Delete User
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
