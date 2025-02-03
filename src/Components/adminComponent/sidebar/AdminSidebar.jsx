import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../../css/admin/sidebar/AdminSideBar.css';

const Sidebar = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const toggleUsers = () => setShowUsers(!showUsers);
  const toggleLeads = () => setShowLeads(!showLeads);
  const toggleDashboard = () => setShowDashboard(!showDashboard);

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <div onClick={toggleDashboard} className="sidebar-link">
            DASHBOARD
          </div>
          {showDashboard && (
            <ul className="submenu active">
              <li><Link to="/adminHome/dashboard" className="sidebar-link">Dashboard</Link></li>
            </ul>
          )}
        </li>

        <li className="sidebar-item">
          <div onClick={toggleUsers} className="sidebar-link">
            User Management
          </div>
          {showUsers && (
            <ul className="submenu active">
              <li><Link to="/adminHome/allUsers" className="sidebar-link">All Users</Link></li>
            </ul>
          )}
        </li>

        <li className="sidebar-item">
          <div onClick={toggleLeads} className="sidebar-link">
            Lead Management
          </div>
          {showLeads && (
            <ul className="submenu active">
              <li><Link to="/adminHome/createLeads" className="sidebar-link">Create Lead</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
