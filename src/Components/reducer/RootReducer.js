import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../slice/authslice"
import profileReducer from "../slice//profileSlice"


const RootReducer = combineReducers({
   auth:authReducer,
   profile:profileReducer,
    
    
})

export default RootReducer