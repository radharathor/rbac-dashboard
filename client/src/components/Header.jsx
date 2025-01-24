import React from "react";
import { Link } from "react-router-dom";
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Admin</h1>
      <nav>
        <ul>
          <li><Link to="/dashboard">Home</Link></li> {/* Home links to Dashboard */}
          <li><Link to="/login">Log In</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
