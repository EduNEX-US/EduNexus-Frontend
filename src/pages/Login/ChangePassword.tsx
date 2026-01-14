import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { changePassword } from "../../features/auth/changePasswordThunk";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id, role, mustChangePassword } = useAppSelector((s) => s.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    if (!oldPassword || !newPassword) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();

      // Route after success
      if (role === "admin") navigate("/edu-admin");
      else if (role === "teacher") navigate("/edu-teach");
      else navigate("/edu-stud");
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  // If for some reason user is here but not forced anymore, send them to their view
  if (mustChangePassword === false && role) {
    // optional: don't auto redirect if you want
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Change Password</h2>

      <label>User ID</label>
      <input
        value={id ?? ""}
        disabled
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <label>Old Password</label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      <label>New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: 12, cursor: "pointer" }}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );
}
