import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { changePassword } from "../../features/auth/changePasswordThunk";

import { Section, Div, Span, Button, Input } from "../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faKey,
  faUser,
  faArrowRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { id, role, mustChangePassword } = useAppSelector((s: any) => s.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requiredEmpty = !oldPassword.trim() || !newPassword.trim();
  const weakPassword = newPassword.trim().length > 0 && newPassword.trim().length < 6;
  const canSubmit = !requiredEmpty && !weakPassword && !loading;

  const roleLabel = useMemo(() => {
    if (role === "admin") return "Admin";
    if (role === "teacher") return "Teacher";
    if (role === "student") return "Student";
    return "User";
  }, [role]);

  async function handleSubmit(e?: React.MouseEvent) {
    e?.preventDefault();
    setError("");

    if (!oldPassword.trim() || !newPassword.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (newPassword.trim().length < 6) {
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
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section cn="min-h-screen w-full bg-orange-50 flex items-center justify-center px-4 py-10">
      {/* Outer wrapper */}
      <Div cn="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Info / Illustration card */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-7 md:p-8">
          <Div cn="flex items-center gap-3 mb-4">
            <Div cn="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <FontAwesomeIcon icon={faLock} />
            </Div>
            <Div cn="">
              <Span cn="block text-xl font-bold text-amber-900">Change Password</Span>
              <Span cn="block text-xs text-amber-700 mt-0.5">
                {mustChangePassword ? "Password update required" : "Update your password securely"}
              </Span>
            </Div>
          </Div>

          <Div cn="mt-6 space-y-3">
            <Div cn="p-4 rounded-xl bg-amber-50/70 border border-amber-200/40">
              <Span cn="text-xs text-amber-700">Logged in as</Span>
              <Span cn="block font-semibold text-amber-900">{roleLabel}</Span>
            </Div>

            <Div cn="p-4 rounded-xl bg-white border border-amber-200/40">
              <Span cn="text-xs text-amber-700">Tip</Span>
              <Span cn="block text-sm text-amber-900 mt-1">
                Use at least <b>6+</b> characters. Avoid your name, roll number, or phone number.
              </Span>
            </Div>

            <Div cn="p-4 rounded-xl bg-white border border-amber-200/40">
              <Span cn="text-xs text-amber-700">Security</Span>
              <Span cn="block text-sm text-amber-900 mt-1">
                After changing password, you’ll be redirected to your dashboard automatically.
              </Span>
            </Div>
          </Div>
        </Div>

        {/* Right: Form card */}
        <div
          className="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-7 md:p-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // prevent accidental submit if any <form> exists somewhere
              e.preventDefault();
              if (canSubmit) handleSubmit();
            }
          }}
        >
          <Div cn="flex items-center justify-between mb-5">
            <Span cn="text-lg font-semibold text-amber-900">Update credentials</Span>
            <Div cn="text-xs text-amber-700 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/40">
              Secure
            </Div>
          </Div>

          {/* User ID (read-only) */}
          <Div cn="mb-4">
            <Span cn="text-xs font-semibold text-amber-800 mb-2 block">User ID</Span>
            <Div cn="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm">
              <Span cn="text-amber-700">
                <FontAwesomeIcon icon={faUser} />
              </Span>
              <input
                value={id ?? ""}
                disabled
                className="w-full bg-transparent outline-none text-amber-900 font-medium"
              />
            </Div>
          </Div>

          {/* Old password */}
          <Div cn="mb-4">
            <Input
              labelCN="hidden"
              labelTxt="Old Password"
              forName="oldPassword"
              type={showOld ? "text" : "password"}
              inpTxt="Old Password"
              inpCN="px-4 py-3 rounded-xl border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none w-full"
              value={oldPassword}
              onChange={(e: any) => setOldPassword(e.target.value)}
            />
            <Div cn="flex justify-between items-center mt-2">
              <Span cn="text-xs text-amber-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} />
                Enter your current password
              </Span>
              <button
                type="button"
                onClick={() => setShowOld((p) => !p)}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                {showOld ? "Hide" : "Show"}
              </button>
            </Div>
          </Div>

          {/* New password */}
          <Div cn="mb-2">
            <Input
              labelCN="hidden"
              labelTxt="New Password"
              forName="newPassword"
              type={showNew ? "text" : "password"}
              inpTxt="New Password"
              inpCN="px-4 py-3 rounded-xl border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none w-full"
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
            />
            <Div cn="flex justify-between items-center mt-2">
              <Span cn={`text-xs ${weakPassword ? "text-red-700" : "text-amber-700"}`}>
                {weakPassword ? "Minimum length: 6 characters" : "Looks good"}
              </Span>
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </Div>
          </Div>

          {/* Error */}
          {error && (
            <Div cn="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <Span cn="mt-0.5">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </Span>
              <Span cn="flex-1">{error}</Span>
            </Div>
          )}

          {/* Actions */}
          <Div cn="mt-6 flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              cn={`w-full px-6 py-3 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer flex items-center justify-center gap-2
                ${!canSubmit ? "opacity-60 pointer-events-none" : ""}
              `}
            >
              {loading ? "Changing..." : "Change Password"}
              {!loading && <FontAwesomeIcon icon={faArrowRight} className="text-sm" />}
            </Button>

            {/* Optional back button if not forced */}
            {!mustChangePassword && (
              <Button
                type="button"
                onClick={() => {
                  if (role === "admin") navigate("/edu-admin");
                  else if (role === "teacher") navigate("/edu-teach");
                  else navigate("/edu-stud");
                }}
                cn="w-full px-6 py-3 rounded-xl border border-amber-200/60 text-amber-800 hover:bg-amber-50 transition cursor-pointer"
              >
                Back to Dashboard
              </Button>
            )}
          </Div>
        </div>
      </Div>
    </Section>
  );
}
