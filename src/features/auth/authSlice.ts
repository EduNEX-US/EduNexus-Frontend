import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "student" | "teacher" | "admin" | "";

interface AuthState {
  id: string | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
}

const storedAuth = localStorage.getItem("edunexus-auth");
const initial: AuthState = storedAuth
  ? JSON.parse(storedAuth)
  : {
      id: null,
      role: null,
      token: null,
      isAuthenticated: false,
    };

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    loginSuccess(
      state : AuthState,
      action: PayloadAction<{ id: string; role: Role; token: string }>
    ) {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      console.log("I am being called");
      // Persist session
      localStorage.setItem("edunexus-auth", JSON.stringify(state));
    },

    logout(state : AuthState) {
      state.id = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("edunexus-auth");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
