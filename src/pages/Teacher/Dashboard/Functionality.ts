import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export type TeacherProfile = {
  id: string;
  name: string;
  email: string;
  mobile: string | number;
  exp: number;
  address: string;
  tClass: string;
  qualification: string;
  imageUrl: string;

  students: number;
  ptmMeetings: number;
};

// ✅ claim types (based on backend LostFoundClaim)
export type LostFoundItem = {
  itemId: string;
  itemName: string;
  itemDescription: string;
  delivered: boolean;
  date: string;
  assignedTo: string;
  imageUrl: string;
};

export type LostFoundClaim = {
  id: number;
  studentId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;

  item: LostFoundItem;
};

export default function useFuncs() {
  const token = useAppSelector((state) => state.auth.token);
  const teacherId = useAppSelector((state: any) => state.auth.id);

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // ✅ Notices state
  const [notices, setNotices] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState("");

  // ✅ Students count state
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  // ✅ Lost & Found claims state (for THIS teacher only)
  const [claims, setClaims] = useState<LostFoundClaim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState("");
  const [actingClaimId, setActingClaimId] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !teacherId) return;
    fetchTeacherProfileById(teacherId);
  }, [token, teacherId]);

  useEffect(() => {
    if (!token) return;
    fetchNotices();
    fetchStudentsCount();
    fetchPendingClaims(); // ✅ claims for this teacher
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, teacherProfile?.tClass]);

  async function fetchTeacherProfileById(id: string) {
    try {
      setProfileLoading(true);
      setProfileError("");

      const res = await fetch(`http://localhost:8080/teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setTeacherProfile(null);
        setProfileError(data?.error ?? "Failed to fetch profile");
        return;
      }

      setTeacherProfile({
        id: String(data.id ?? ""),
        name: data.name ?? "",
        email: data.email ?? "",
        mobile: data.mobile ?? "",
        exp: Number(data.exp ?? 0),
        address: data.address ?? "",
        tClass: String(data.tClass ?? ""),
        qualification: data.qualification ?? "",
        imageUrl: data.imageUrl ?? "",

        students: 0,
        ptmMeetings: Number(data.ptmMeetings ?? 0),
      });
    } catch {
      setTeacherProfile(null);
      setProfileError("Network error while fetching profile");
    } finally {
      setProfileLoading(false);
    }
  }

  // ✅ Update teacher profile (multipart) -> updates local state after save
  async function updateTeacherProfile(
    payload: { name?: string; email?: string; mobile?: string; address?: string },
    imageFile?: File | null
  ) {
    if (!token) throw new Error("NO_TOKEN");

    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) fd.append("image", imageFile);

    const res = await fetch("http://localhost:8080/teacher/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "UPDATE_FAILED");

    setTeacherProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        name: data.name ?? prev.name,
        email: data.email ?? prev.email,
        mobile: data.mobile ?? prev.mobile,
        address: data.address ?? prev.address,
        imageUrl: data.imageUrl ?? prev.imageUrl,
      };
    });

    return data;
  }

  async function fetchNotices() {
    try {
      setNoticesLoading(true);
      setNoticesError("");

      const res = await fetch(`http://localhost:8080/notice`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));

      if (!res.ok) {
        setNotices([]);
        setNoticesError((data as any)?.error ?? "Failed to fetch notices");
        return;
      }

      setNotices(Array.isArray(data) ? data : []);
    } catch {
      setNotices([]);
      setNoticesError("Network error while fetching notices");
    } finally {
      setNoticesLoading(false);
    }
  }

  // ✅ Fetch Students Count
  async function fetchStudentsCount() {
    try {
      if (!token) return;

      const clsRaw = teacherProfile?.tClass ?? "";
      if (!clsRaw) return;

      setStudentsLoading(true);
      setStudentsError("");

      const classId = encodeURIComponent(String(clsRaw));

      const res = await fetch(`http://localhost:8080/teacher/students/class/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));

      if (!res.ok) {
        setStudentsCount(0);
        setStudentsError((data as any)?.error ?? "Failed to fetch students count");
        return;
      }

      const count = Array.isArray(data) ? data.length : 0;
      setStudentsCount(count);

      setTeacherProfile((prev) => (prev ? { ...prev, students: count } : prev));
    } catch {
      setStudentsCount(0);
      setStudentsError("Network error while fetching students count");
    } finally {
      setStudentsLoading(false);
    }
  }

  // ===================== LOST & FOUND CLAIMS =====================

  // ✅ Only returns claims assigned to THIS teacher (backend must filter)
  async function fetchPendingClaims() {
    try {
      if (!token) return;

      setClaimsLoading(true);
      setClaimsError("");

      const res = await fetch("http://localhost:8080/lostfound/claims/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));

      if (!res.ok) {
        setClaims([]);
        setClaimsError((data as any)?.error ?? "Failed to fetch claims");
        return;
      }

      setClaims(Array.isArray(data) ? data : []);
    } catch {
      setClaims([]);
      setClaimsError("Network error while fetching claims");
    } finally {
      setClaimsLoading(false);
    }
  }

  async function approveClaim(claimId: number) {
    if (!token) throw new Error("NO_TOKEN");

    try {
      setActingClaimId(claimId);

      const res = await fetch(`http://localhost:8080/lostfound/claims/${claimId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "APPROVE_FAILED");

      // ✅ remove from list instantly
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      return data;
    } finally {
      setActingClaimId(null);
    }
  }

  async function rejectClaim(claimId: number) {
    if (!token) throw new Error("NO_TOKEN");

    try {
      setActingClaimId(claimId);

      const res = await fetch(`http://localhost:8080/lostfound/claims/${claimId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "REJECT_FAILED");

      // ✅ remove from list instantly
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      return data;
    } finally {
      setActingClaimId(null);
    }
  }

  return {
    teacherProfile,
    profileLoading,
    profileError,
    fetchTeacherProfileById,

    notices,
    noticesLoading,
    noticesError,
    fetchNotices,

    updateTeacherProfile,

    studentsCount,
    studentsLoading,
    studentsError,
    fetchStudentsCount,

    // ✅ claims
    claims,
    claimsLoading,
    claimsError,
    fetchPendingClaims,
    approveClaim,
    rejectClaim,
    actingClaimId,
  };
}
