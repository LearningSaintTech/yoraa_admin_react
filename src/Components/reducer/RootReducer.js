// reducer/RootReducer.js
import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../slice/authslice"
import profileReducer from "../slice/profileSlice"
import sidebarReducer from "../slice/sidebarSlice"
import wishlistReducer from "../slice/wishlistSlice"  // New
import cartReducer from "../slice/cartSlice"          // New

const RootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    sidebar: sidebarReducer,
    wishlist: wishlistReducer,    // Added
    cart: cartReducer,           // Added
})

export default RootReducer