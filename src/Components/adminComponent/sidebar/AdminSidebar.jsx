import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../../css/admin/sidebar/AdminSideBar.css';

const Sidebar = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
  };

  const toggleLeads = () => {
    setShowLeads(!showLeads);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  const user = useSelector(state => state.auth.user);
  const userRoles = user.roles.map(role => role.name);
  console.log("user", user);

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {userRoles.includes('ADMIN_DASHBOARD') || userRoles.includes('ADMIN') ? (
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
        ) : null}

        {userRoles.includes('ADMIN_A1') || userRoles.includes('ADMIN') ? (
          <li className="sidebar-item">
            <div onClick={toggleUsers} className="sidebar-link">
              User Management
            </div>
            {showUsers && (
              <ul className="submenu active">
                <li><Link to="/adminHome/allUsers" className="sidebar-link">All Users</Link></li>
                {/* Add more user management links here */}
              </ul>
            )}
          </li>
        ) : null}

        {userRoles.includes('ADMIN_LEADS') || userRoles.includes('ADMIN') || userRoles.includes('MANAGER') ? (
          <li className="sidebar-item">
            <div onClick={toggleLeads} className="sidebar-link">
              Lead Management
            </div>
            {showLeads && (
              <ul className="submenu active">
                <li><Link to="/adminHome/createLeads" className="sidebar-link">Create Lead</Link></li>
                {/* Add more lead management links here */}
              </ul>
            )}
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default Sidebar;
