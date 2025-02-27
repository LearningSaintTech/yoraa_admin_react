import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../slice/authslice"
import profileReducer from "../slice/profileSlice"
import sidebarReducer from "../slice/sidebarSlice"


const RootReducer = combineReducers({
   auth:authReducer,
   profile:profileReducer,
   sidebar: sidebarReducer,

    
})

export default RootReducer