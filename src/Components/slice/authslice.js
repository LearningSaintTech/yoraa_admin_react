import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    user:  null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
            console.log("inside the set token", state.token);
            localStorage.setItem("ACCESS_TOKEN", JSON.stringify(action.payload));
        },
        setUser(state, action) {
            state.user = action.payload;
            console.log("inside the set user", state.user);
            localStorage.setItem("USER_DATA", JSON.stringify(action.payload));
        },
        logout(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("USER_DATA");
        },
    },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
