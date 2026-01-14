import { useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { hydrateAuth } from "../../features/auth/authThunk";
import { setToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";

type Role = "student" | "admin" | "teacher" | "";

export default function useFuncs() {
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();

  async function loginUser() {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edu_id: idRef.current?.value,
          edu_password: passRef.current?.value,
          role,
        }),
      });

      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }

      const data = await res.json(); // { token }

      // 1) store token
      dispatch(setToken({ token: data.token }));

      // 2) hydrate from backend (/me + profile)
      const result = await dispatch(hydrateAuth()).unwrap();

      // 3) must-change password force screen
      if (result.mustChangePassword) {
        navigate("/change-password");
        return;
      }
      else{
        console.log(result);
        console.log("It ccame false");
      }

      // 4) route by role
      if (result.role === "admin") navigate("/edu-admin");
      else if (result.role === "teacher") navigate("/edu-teach");
      else navigate("/edu-stud");
    } catch {
      setError("Server error");
    }
  }

  function handleLogin() {
    loginUser();
  }

  function handleRole(e: React.ChangeEvent<HTMLInputElement>) {
    setRole(e.target.value as Role);
  }

  return { idRef, passRef, role, handleRole, handleLogin, error };
}
