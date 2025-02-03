import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/commonComponent/ProtectedRoute';
import Login from './Components/authComponent/Login';
import AdminDashboard from "./Components/adminComponent/dashboard/AdminDashboard.jsx";

import Logout from './Components/authComponent/Logout';
import Header from './Components/commonComponent/Header';
import NotAccess from './Components/commonComponent/NotAccess';
import SignupForm from './Components/authComponent/SignupForm';
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
        {/* <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/otp-verification" element={<OtpVerification />} /> OTP Verification route */}

        {/* for common routes */}
        <Route path="/notAccess" element={<NotAccess />} />
        {/* <Route path="/inactiveuser" element={<InactiveUser />} /> */}

        {/* for admin routes */}
        <Route path="/adminHome" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminHome /></ProtectedRoute>}>
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          
        </Route>

        {/* for user routes */}
        {/* <Route path="/user" element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} /> */}
      </Routes>
      <Routes>
        {/* <Route path="/chat" element={<ChatPage />} /> */}
      </Routes>

    </div>
  );
};

export default App;
