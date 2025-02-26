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
import Category from './Components/adminComponent/categoryComponents/Category.jsx';
import SubCategory from './Components/adminComponent/subCategory/SubCategory.js';
import Items from './Components/adminComponent/items/Items.jsx';
import Users from './Components/adminComponent/userComponents/Users.jsx';
import Notifications from './Components/adminComponent/notifications/Notifications.jsx';
import ItemDetails from './Components/adminComponent/itemsDetails/ItemDetails.jsx';


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
          <Route path="category" element={<ProtectedRoute allowedRoles={['ADMIN']}><Category /></ProtectedRoute>} />
          <Route path="subcategory" element={<ProtectedRoute allowedRoles={['ADMIN']}><SubCategory /></ProtectedRoute>} />
          <Route path="items" element={<ProtectedRoute allowedRoles={['ADMIN']}><Items /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}>< Users/></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute allowedRoles={['ADMIN']}>< Notifications/></ProtectedRoute>} />
          <Route path="itemDetails" element={<ProtectedRoute allowedRoles={['ADMIN']}>< ItemDetails/></ProtectedRoute>} />


          {/* <Route path="/adminHome" element={<AdminHome />}>
          <Route path="dashboard" element={<AdminDashboard/>} /> */}
          
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
