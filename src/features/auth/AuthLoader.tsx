import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { hydrateAuth } from "./authThunk";
import { logout } from "./authSlice";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { loading, expiresAt } = useAppSelector((s) => s.auth);

  // Hydrate once if token exists
  useEffect(() => {
    let token: string | null = null;

    try {
      const raw = sessionStorage.getItem("edunexus-auth");
      token = raw ? JSON.parse(raw)?.token ?? null : null;
    } catch {
      token = null;
    }

    if (token) dispatch(hydrateAuth());
  }, [dispatch]);

  // Auto logout when client expiry hits
  useEffect(() => {
    if (!expiresAt) return;

    const msLeft = expiresAt - Date.now();
    if (msLeft <= 0) {
      dispatch(logout());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(logout());
    }, msLeft);

    return () => clearTimeout(timer);
  }, [dispatch, expiresAt]);

  if (loading) return <div style={{ padding: 24 }}>Loading session...</div>;

  return <>{children}</>;
}
