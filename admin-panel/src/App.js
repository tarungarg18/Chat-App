import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_API_URL || "https://chat-app-1-tpn3.onrender.com";
const API = `${BACKEND_URL}/api/admin`;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Testing connection...");
  const [adminKey, setAdminKey] = useState(process.env.REACT_APP_ADMIN_KEY || "dev-admin-key");

  // Generate a secure random admin key
  const generateAdminKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create default admin key on backend
  const createDefaultAdmin = async () => {
    try {
      const newAdminKey = generateAdminKey();
      console.log("Creating default admin key:", newAdminKey);
      
      // Try to set the admin key via a special endpoint (we'll need to add this to backend)
      const res = await axios.post(`${BACKEND_URL}/api/admin/setup`, {
        adminKey: newAdminKey
      });
      
      if (res.data.success) {
        setAdminKey(newAdminKey);
        alert(`✅ Default admin key created: ${newAdminKey}\n\nPlease save this key for future use!`);
        return newAdminKey;
      }
    } catch (err) {
      console.error("Failed to create default admin:", err);
      // If backend doesn't support auto-setup, just use a default key
      const defaultKey = "default-admin-key-2024";
      setAdminKey(defaultKey);
      alert(`⚠️ Using fallback admin key: ${defaultKey}\n\nPlease set ADMIN_KEY=${defaultKey} in your backend environment variables.`);
      return defaultKey;
    }
  };

  // Test connection to backend
  const testConnection = async () => {
    try {
      console.log("Testing connection to:", BACKEND_URL);
      console.log("API base:", API);
      console.log("Admin key:", adminKey);
      
      // First test basic backend connectivity
      const res = await axios.get(`${BACKEND_URL}/ping`);
      setConnectionStatus(`✅ Backend connected: ${res.data.msg}`);
      
      // Test admin endpoint
      const adminRes = await axios.get(`${API}/users`, { 
        headers: { "x-admin-key": adminKey } 
      });
      setConnectionStatus(`✅ Admin API working: ${adminRes.data.length} users found`);
    } catch (err) {
      console.error("Connection test failed:", err);
      if (err.response?.status === 404) {
        setConnectionStatus(`❌ 404: Admin endpoint not found at ${API}/users`);
      } else if (err.response?.status === 401) {
        setConnectionStatus(`❌ 401: Unauthorized - Admin key mismatch. Creating default admin...`);
        // Automatically try to create default admin
        const newKey = await createDefaultAdmin();
        if (newKey) {
          // Retry with new key
          setTimeout(() => testConnection(), 1000);
        }
      } else {
        setConnectionStatus(`❌ Connection failed: ${err.message}`);
      }
    }
  };

  // Simple backend connectivity test
  const testBackendOnly = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/ping`);
      alert(`✅ Backend is accessible: ${res.data.msg}`);
    } catch (err) {
      alert(`❌ Backend not accessible: ${err.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users from:", `${API}/users`);
<<<<<<< HEAD
      
      const res = await axios.get(`${API}/users`, { 
        timeout: 10000
=======
      console.log("Using admin key:", adminKey);
      
      const res = await axios.get(`${API}/users`, { 
        headers: { "x-admin-key": adminKey },
        timeout: 10000 // 10 second timeout
>>>>>>> 17b4ec35791060dda79f95122a7b1b7b9e6d4c9b
      });
      setUsers(res.data);
      console.log("Users fetched successfully:", res.data.length, "users");
    } catch (err) {
<<<<<<< HEAD
      console.error("Fetch users error:", err);
      alert("Error fetching users: " + err.message);
=======
      console.error("Fetch users error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        headers: err.config?.headers
      });
      
      let errorMsg = "Error fetching users: " + err.message;
      if (err.response?.status === 404) {
        errorMsg = "404 Error: Admin endpoint not found. Check if backend is running and admin routes are configured.";
      } else if (err.response?.status === 401) {
        errorMsg = "401 Error: Unauthorized. Creating default admin key...";
        // Automatically try to create default admin
        const newKey = await createDefaultAdmin();
        if (newKey) {
          // Retry with new key
          setTimeout(() => fetchUsers(), 1000);
          return;
        }
      } else if (err.response?.status === 403) {
        errorMsg = "403 Error: Forbidden. Check CORS configuration on backend.";
      }
      
      alert(errorMsg);
>>>>>>> 17b4ec35791060dda79f95122a7b1b7b9e6d4c9b
    } finally {
      setLoading(false);
    }
  };

  const deleteAllUsers = async () => {
    if (window.confirm("⚠️ Delete ALL users? This cannot be undone.")) {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await axios.delete(`${API}/delete-all-users`);
=======
        const res = await axios.delete(`${API}/delete-all-users`, { headers: { "x-admin-key": adminKey } });
>>>>>>> 17b4ec35791060dda79f95122a7b1b7b9e6d4c9b
        alert(`${res.data.msg} (${res.data.count} users deleted)`);
        fetchUsers();
      } catch (err) {
        if (err.response?.status === 401) {
          alert("401 Error: Admin key mismatch. Creating default admin key...");
          const newKey = await createDefaultAdmin();
          if (newKey) {
            setTimeout(() => deleteAllUsers(), 1000);
            return;
          }
        } else {
          alert("Error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteIndividualUser = async (userId, username) => {
    if (window.confirm(`⚠️ Delete user "${username}"? This cannot be undone.`)) {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await axios.delete(`${API}/delete-user/${userId}`);
=======
        const res = await axios.delete(`${API}/delete-user/${userId}`, { headers: { "x-admin-key": adminKey } });
>>>>>>> 17b4ec35791060dda79f95122a7b1b7b9e6d4c9b
        alert(`✅ ${res.data.msg}`);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        if (err.response?.status === 401) {
          alert("401 Error: Admin key mismatch. Creating default admin key...");
          const newKey = await createDefaultAdmin();
          if (newKey) {
            setTimeout(() => deleteIndividualUser(userId, username), 1000);
            return;
          }
        } else {
          alert("Error deleting user: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteAllMessages = async () => {
    if (window.confirm("⚠️ Delete ALL messages? This cannot be undone.")) {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await axios.delete(`${API}/delete-all-messages`);
=======
        const res = await axios.delete(`${API}/delete-all-messages`, { headers: { "x-admin-key": adminKey } });
>>>>>>> 17b4ec35791060dda79f95122a7b1b7b9e6d4c9b
        alert(`${res.data.msg} (${res.data.count} messages deleted)`);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("401 Error: Admin key mismatch. Creating default admin key...");
          const newKey = await createDefaultAdmin();
          if (newKey) {
            setTimeout(() => deleteAllMessages(), 1000);
            return;
          }
        } else {
          alert("Error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    testConnection();
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#333", borderBottom: "3px solid #007bff", paddingBottom: "10px" }}>
        ⚙️ Chat App Admin Panel
      </h1>

      <div style={{ 
        marginBottom: "1rem", 
        padding: "10px", 
        backgroundColor: connectionStatus.includes("✅") ? "#d4edda" : "#f8d7da",
        border: `1px solid ${connectionStatus.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
        borderRadius: "5px",
        color: connectionStatus.includes("✅") ? "#155724" : "#721c24"
      }}>
        <strong>Status:</strong> {connectionStatus}
      </div>

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

        <button
          onClick={testConnection}
          style={{ 
            marginLeft: "10px",
            padding: "12px 20px", 
            background: "#17a2b8", 
            color: "white", 
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔍 Test Connection
        </button>

        <button
          onClick={testBackendOnly}
          style={{ 
            marginLeft: "10px",
            padding: "12px 20px", 
            background: "#6c757d", 
            color: "white", 
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🌐 Test Backend Only
        </button>

        <button
          onClick={createDefaultAdmin}
          style={{ 
            marginLeft: "10px",
            padding: "12px 20px", 
            background: "#28a745", 
            color: "white", 
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔑 Create Admin Key
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
    </div>
  );
}

export default App;
