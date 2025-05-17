import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  userInfo: null, 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.token = action.payload.token;
      state.userInfo = action.payload.user;
      state.isAuthenticated = true;
    },
    logoutUser(state) {
      state.token = null;
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    updateUserInfo(state, action) {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload, // accepts { name, email }
      };
    }
  },
});

export const { setUser, logoutUser, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
