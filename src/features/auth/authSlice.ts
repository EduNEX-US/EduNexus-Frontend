import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { hydrateAuth } from "./authThunk";
import { changePassword } from "./changePasswordThunk";

export type Role = "student" | "teacher" | "admin" | "";

export interface AuthState {
  token: string | null;
  id: string | null;
  role: Role | null;
  profile: any | null;

  mustChangePassword: boolean;

  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  expiresAt: number | null;
}

const STORAGE_KEY = "edunexus-auth";
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function emptyState(): AuthState {
  return {
    token: null,
    id: null,
    role: null,
    profile: null,
    mustChangePassword: false,
    isAuthenticated: false,
    loading: false,
    error: null,
    expiresAt: null,
  };
}

function loadFromSession(): AuthState {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState();

  try {
    const parsed = JSON.parse(raw);
    const expiresAt = parsed?.expiresAt ?? null;

    if (expiresAt && Date.now() > expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return emptyState();
    }

    return {
      token: parsed?.token ?? null,
      id: parsed?.id ?? null,
      role: parsed?.role ?? null,
      profile: parsed?.profile ?? null,
      mustChangePassword: Boolean(parsed?.mustChangePassword),
      isAuthenticated: Boolean(parsed?.token),
      loading: false,
      error: null,
      expiresAt,
    };
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return emptyState();
  }
}

function persistToSession(state: AuthState) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      token: state.token,
      id: state.id,
      role: state.role,
      profile: state.profile,
      mustChangePassword: state.mustChangePassword,
      expiresAt: state.expiresAt,
    })
  );
}

const initialState: AuthState = loadFromSession();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = true;
      state.error = null;

      // session TTL (client-side)
      state.expiresAt = Date.now() + SESSION_TTL_MS;

      persistToSession(state);
    },

    logout(state) {
      Object.assign(state, emptyState());
      sessionStorage.removeItem(STORAGE_KEY);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.role = action.payload.role;
        state.profile = action.payload.profile;
        state.mustChangePassword = action.payload.mustChangePassword;

        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;

        // ✅ keep same expiresAt (don’t extend each hydrate)
        persistToSession(state);
      })
      .addCase(hydrateAuth.rejected, (state) => {
        Object.assign(state, emptyState());
        state.error = "Session expired";
        sessionStorage.removeItem(STORAGE_KEY);
      })
        .addCase(changePassword.fulfilled, (state) => {
      // after successful change, user is no longer forced
        state.mustChangePassword = false;
    })

  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
