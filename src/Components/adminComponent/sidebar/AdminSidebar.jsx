import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/admin/sidebar/AdminSideBar.css';

const Sidebar = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
  };

  const toggleLeads = () => {
    setShowLeads(!showLeads);
  };

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/adminHome/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className="sidebar-item" onClick={toggleUsers}>
          User Management
          <ul className={`submenu ${showUsers ? 'active' : ''}`}>
            <li><Link to="/adminHome/allUsers" className="sidebar-link">All Users</Link></li>
            {/* Add more user management links here */}
          </ul>
        </li>
        <li className="sidebar-item" onClick={toggleLeads}>
          Lead Management
          <ul className={`submenu ${showLeads ? 'active' : ''}`}>
            <li><Link to="/adminHome/createLeads" className="sidebar-link">Create Lead</Link></li>
            {/* Add more lead management links here */}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
