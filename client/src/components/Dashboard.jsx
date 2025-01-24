import React, { useEffect, useState } from "react";
import "./Dashboard.css";


const Dashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  // Fetch users from the server
  useEffect(() => {
    if (!user) {
      window.location.href = "/login"; // Redirect if not logged in
      return;
    }
    fetch("http://localhost:8080/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        if (data.success) setUsers(data.users || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:8080/api/users/${editUserId}`
      : "http://localhost:8080/api/users";
  
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(errorData.message || "An error occurred");
        return;
      }
  
      const data = await response.json();
      if (isEditing) {
        setUsers(users.map((user) => (user._id === editUserId ? data.user : user)));
        setIsEditing(false);
        setEditUserId(null);
      } else {
        setUsers([...users, data.user]);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while adding/updating the user");
    }
  
    setFormData({
      name: "",
      email: "",
      role: "Viewer",
      status: "Active",
      password: "", // Reset password
    });
  };
  

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
    setEditUserId(user._id);  // Use _id here
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUsers(users.filter((user) => user._id !== id));  // Use _id here
      alert("User deleted successfully!");
    } else {
      alert("Error deleting user");
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Responsive Form */}
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="Viewer">Viewer</option>
          <option value="Editor">Editor</option>
          <option value="Admin">Admin</option>
        </select>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit">{isEditing ? "Update User" : "Add User"}</button>
      </form>

      {/* Responsive Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} style={{ marginRight: "1rem" }}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr> // No space or newlines between <tr> and <td>
              ))}
         </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
