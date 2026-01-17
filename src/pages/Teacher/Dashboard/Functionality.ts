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
  students: number,
  ptmMeetings: number
};

export default function useFuncs() {
  const token = useAppSelector((state) => state.auth.token);

  // ✅ change this based on your redux shape
  const teacherId = useAppSelector((state: any) => state.auth.id);

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!token || !teacherId) return;
    fetchTeacherProfileById(teacherId);
  }, [token, teacherId]);

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
        tClass: data.tClass ?? "",
        qualification: data.qualification ?? "",
        imageUrl: data.imageUrl ?? "",
        students: 20,
        ptmMeetings: 3
      });

      console.log(data);
    } catch {
      setTeacherProfile(null);
      setProfileError("Network error while fetching profile");
    } finally {
      setProfileLoading(false);
    }
  }

  return {
    teacherProfile,
    profileLoading,
    profileError,
    fetchTeacherProfileById,
  };
}
