import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./Sidebar.css";
import { FaUsers, FaUserShield, FaCogs, FaSignOutAlt, FaBars } from "react-icons/fa"; // React Icons

const Sidebar = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [details, setDetails] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false); // For collapsible sidebar
  const navigate = useNavigate(); // useNavigate for redirection

  // Fetch data on mount
  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsersCount(data.users.length);
      })
      .catch((err) => console.error("Error fetching users:", err));

    const roles = ["Admin", "Editor", "Viewer"];
    setRolesCount(roles.length);
  }, []);

  // Handle fetching details for tabs
  const fetchDetails = (type) => {
    if (type === "Users") {
      fetch("http://localhost:8080/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDetails(data.users);
            setActiveTab("Users");
          }
        })
        .catch((err) => console.error("Error fetching users:", err));
    } else if (type === "Roles") {
      const roles = ["Admin", "Editor", "Viewer"];
      setDetails(roles);
      setActiveTab("Roles");
    } else {
      setDetails([]);
      setActiveTab(type);
    }
  };

  // Toggle Sidebar Collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage (clear session)
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Toggle Button */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Sidebar Menu */}
      <ul className="menu">
        <li onClick={() => fetchDetails("Users")} className={activeTab === "Users" ? "active" : ""}>
          <FaUsers />
          {!isCollapsed && <span>Users ({usersCount})</span>}
        </li>
        <li onClick={() => fetchDetails("Roles")} className={activeTab === "Roles" ? "active" : ""}>
          <FaUserShield />
          {!isCollapsed && <span>Roles ({rolesCount})</span>}
        </li>
        <li onClick={() => fetchDetails("Settings")} className={activeTab === "Settings" ? "active" : ""}>
          <FaCogs />
          {!isCollapsed && <span>Settings</span>}
        </li>
        <li onClick={handleLogout} className={activeTab === "Logout" ? "active" : ""}>
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </li>
      </ul>

      {/* Dynamic Content */}
      <div className="details">
        {activeTab === "Users" && (
          <div>
            <h3>User List</h3>
            <ul>
              {details.map((user) => (
                <li key={user._id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Roles" && (
          <div>
            <h3>Roles List</h3>
            <ul>
              {details.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "Settings" && <p>Settings content goes here...</p>}
        {activeTab === "Logout" && <p>You have been logged out.</p>}
      </div>
    </div>
  );
};

export default Sidebar;
