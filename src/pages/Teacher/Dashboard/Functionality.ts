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

  useEffect(() => {
    if (!token || !teacherId) return;
    fetchTeacherProfileById(teacherId);
  }, [token, teacherId]);

  useEffect(() => {
    if (!token) return;
    fetchNotices();
    fetchStudentsCount();
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

    // ✅ update local teacherProfile immediately (same response shape as GET /teacher/{id})
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

    // ✅ If you want to re-fetch completely, uncomment:
    // if (teacherId) await fetchTeacherProfileById(teacherId);

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
    console.log(data);
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

    const res = await fetch(
      `http://localhost:8080/teacher/students/class/${classId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json().catch(() => ([]));

    if (!res.ok) {
      setStudentsCount(0);
      setStudentsError(data?.error ?? "Failed to fetch students count");
      return;
    }

    // ✅ data is already an array
    const count = Array.isArray(data) ? data.length : 0;

    setStudentsCount(count);

    // reflect into teacherProfile
    setTeacherProfile((prev) =>
      prev ? { ...prev, students: count } : prev
    );

  } catch {
    setStudentsCount(0);
    setStudentsError("Network error while fetching students count");
  } finally {
    setStudentsLoading(false);
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
  };
}
