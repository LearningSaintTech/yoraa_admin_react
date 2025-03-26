import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/commonComponent/ProtectedRoute';
import Login from './Components/authComponent/Login';
import AdminDashboard from "./Components/adminComponent/dashboard/AdminDashboard.jsx";
import Logout from './Components/authComponent/Logout';
import NotAccess from './Components/commonComponent/NotAccess';
import SignupForm from './Components/authComponent/SignupForm';
import AdminHome from './Components/adminComponent/adminHome/AdminHome';
import Category from './Components/adminComponent/categoryComponents/Category.jsx';
import SubCategory from './Components/adminComponent/subCategory/SubCategory.js';
import Items from './Components/adminComponent/items/Items.jsx';
import Users from './Components/adminComponent/userComponents/Users.jsx';
import Notifications from './Components/adminComponent/notifications/Notifications.jsx';
import ItemDetails from './Components/adminComponent/itemsDetails/ItemDetails.jsx';
import Order from './Components/adminComponent/order/Order.js';
import WelcomeScreen from './Components/authComponent/WelcomeScreen.jsx';
import VerifyOTP from './Components/authComponent/VerifyOtp.jsx';
import Home from './Components/userComponent/home/Home.jsx';
import Layout from './Components/userComponent/Layout.jsx';
import Collections from './Components/userComponent/collections/Page.jsx';
import ProductDetails from './Components/userComponent/productDetails/ProductDetails.jsx';
import QuickViewModal from './Components/userComponent/productDetails/QuickViewModal.jsx';
import NewArrivals from './Components/userComponent/newArrivals/Page.jsx';
import Wishlist from './Components/userComponent/Wishlist/Page.jsx';
import Cart from './Components/userComponent/cart/Cart.jsx';
import FilterPage from './Components/userComponent/FilterPage.jsx';
import PaymentPage from './Components/userComponent/PaymentPage.jsx';
import AllOrders from './Components/userComponent/orders/AllOrders.jsx';
import TrackOrders from './Components/userComponent/orders/TrackOrders.jsx';
import ReturnRefund from './Components/userComponent/orders/ReturnRefund.jsx';
import Exchange from './Components/userComponent/orders/Exchange.jsx';
import ExchangePolicy from './Components/userComponent/orders/ExchangePolicy.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/notAccess" element={<NotAccess />} />

        {/* Admin Routes */}
        <Route path="/adminHome" element={<ProtectedRoute adminOnly={true}><AdminHome /></ProtectedRoute>} >
        <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="items" element={<Items />} />
          <Route path="users" element={<Users />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="itemDetails" element={<ItemDetails />} />
          <Route path="order" element={<Order />} />
        </Route>

        {/* User Route */}
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/collections" element={<Layout><Collections /></Layout>} />
        <Route path="/productDetails/:itemId" element={<Layout><ProductDetails /></Layout>} />
        <Route path="/quickViewModal/:itemId" element={<Layout><QuickViewModal /></Layout>} />
        <Route path="/newArrivals" element={<Layout><NewArrivals /> </Layout>}/>
        <Route path="/wishlist" element={<Layout><Wishlist /> </Layout>}/>
        <Route path="/cart" element={<Layout><Cart /> </Layout>}/>
        <Route path="/filter" element={<Layout><FilterPage /> </Layout>}/>
        <Route path="/payment" element={<Layout><PaymentPage /> </Layout>}/>
        <Route path="/allOrders" element={<Layout><AllOrders /> </Layout>}/>
        <Route path="/tracking" element={<Layout><TrackOrders /> </Layout>}/>
        <Route path="/return-refund" element={<Layout><ReturnRefund /> </Layout>}/>
        <Route path="/exchange" element={<Layout><Exchange /> </Layout>}/>
        <Route path="/exchange-policy" element={<Layout><ExchangePolicy /> </Layout>}/>






     </Routes>
    </div>
  );
};

export default App;
