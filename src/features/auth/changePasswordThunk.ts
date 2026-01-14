import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    payload: { oldPassword: string; newPassword: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue("NO_TOKEN");

    const res = await fetch("http://localhost:8080/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) return rejectWithValue(data?.error ?? "CHANGE_FAILED");

    return data; // { message }
  }
);
