import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/commonComponent/ProtectedRoute';
import Login from './Components/authComponent/Login';
import AdminDashboard from "./Components/adminComponent/dashboard/AdminDashboard.jsx";
import UserDashboard from "./Components/adminComponent/dashboard/UserDashboard";
import OAuth2RedirectHandler from './Components/googleOauth2/Oauth2RedirectHandler';
import Logout from './Components/authComponent/Logout';
import InactiveUser from './Components/commonComponent/InactiveUser';
import Header from './Components/commonComponent/Header';
import NotAccess from './Components/commonComponent/NotAccess';
import SignupForm from './Components/authComponent/SignupForm';
import CreateLeads from './Components/adminComponent/manageLeads/CreateLeads.jsx';
import AllUsers from './Components/adminComponent/manageUsers/AllUsers.jsx';
import AdminHome from './Components/adminComponent/adminHome/AdminHome';

const App = () => {
  return (
      <div>
        <Header />
        <Routes>
          {/* for auth routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          {/* for common routes */}
          <Route path="/notAccess" element={<NotAccess />} />
          <Route path="/inactiveuser" element={<InactiveUser />} />

          {/* for admin routes */}
          <Route path="/adminHome" element={<ProtectedRoute allowedRoles={['ADMIN','ADMIN_DASHBOARD' ,'ADMIN_LEADS', 'ADMIN_USERS', 'ADMIN_A1', 'MANAGER']}><AdminHome /></ProtectedRoute>}>
            <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN','ADMIN_DASHBOARD']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="user" element={<ProtectedRoute allowedRoles={['ADMIN_A1', 'ADMIN']}><UserDashboard /></ProtectedRoute>} />
            <Route path="createLeads" element={<ProtectedRoute allowedRoles={['ADMIN_LEADS', 'ADMIN', 'MANAGER']}><CreateLeads /></ProtectedRoute>} />
            <Route path="allUsers" element={<ProtectedRoute allowedRoles={['ADMIN_USERS', 'ADMIN']}><AllUsers /></ProtectedRoute>} />
          </Route>

          {/* for user routes */}
          <Route path="/user" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
  );
};

export default App;
