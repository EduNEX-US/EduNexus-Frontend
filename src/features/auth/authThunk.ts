import { createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "edunexus-auth";

function readToken(getState: () => any): string | null {
  const stateToken = getState()?.auth?.token;
  if (stateToken) return stateToken;

  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

export type Role = "student" | "teacher" | "admin";

export type MeResponse = {
  id: string;
  role: Role;
  mustChangePassword: boolean;
};

export const hydrateAuth = createAsyncThunk(
  "auth/hydrateAuth",
  async (_, { getState, rejectWithValue }) => {
    const token = readToken(getState);
    if (!token) return rejectWithValue("NO_TOKEN");

    // 1) /me
    const meRes = await fetch("http://localhost:8080/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) return rejectWithValue("SESSION_EXPIRED");

    const me: MeResponse = await meRes.json(); // { id, role, mustChangePassword }

    // 2) profile endpoint
    const profileUrl = me.role === "admin" ? `http://localhost:8080/admin/${me.id}` :
      me.role === "student"
        ? `http://localhost:8080/students/${me.id}`
        : `http://localhost:8080/teacher/${me.id}`;

    const profileRes = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const profile = profileRes.ok ? await profileRes.json() : null;
    return {
      token,
      id: me.id,
      role: me.role,
      mustChangePassword: me.mustChangePassword,
      profile,
    };
  }
);
