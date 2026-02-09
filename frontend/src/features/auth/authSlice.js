import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely parse user data
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from storage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token, role } = action.payload;
      
      state.user = user;
      state.token = token;
      state.role = role || user?.role || "user";
      state.isAuthenticated = true;

      // Save to localStorage
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("role", state.role);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      try {
        localStorage.setItem("user", JSON.stringify(state.user));
      } catch (error) {
        console.error("Error updating user in localStorage:", error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.clear();
    },
  },
});

export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;