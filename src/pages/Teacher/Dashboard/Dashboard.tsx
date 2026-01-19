import type { HandleTab } from "../../../Components/Sidebar/Functionality";
import { useEffect, useMemo, useState } from "react";
import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBookOpen,
  faAward,
  faBullhorn,
  faPenToSquare,
  faPhone,
  faEnvelope,
  faLocationDot,
  faIdCard,
  faImage,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import useFuncs from "./Functionality";

export default function Dashboard(props: HandleTab) {
  const {
    teacherProfile,
    profileLoading,
    profileError,

    // ✅ notices
    notices,
    noticesLoading,
    noticesError,
    fetchNotices,

    updateTeacherProfile,

    // ✅ students count
    studentsCount,

    // ✅ claims
    claims,
    claimsLoading,
    claimsError,
    fetchPendingClaims,
    approveClaim,
    rejectClaim,
    actingClaimId,
  } = useFuncs();

  // ---------- Safe values ----------
  const classNumber = teacherProfile?.tClass ?? "-";
  const exp = teacherProfile?.exp ?? 0;

  const teacherId = teacherProfile?.id || "-";
  const phone = teacherProfile?.mobile || "";
  const email = teacherProfile?.email || "";
  const address = teacherProfile?.address || "";

  // ---------- Edit state ----------
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  // ✅ image file + preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fill form when profile loads
  useEffect(() => {
    setForm({
      name: teacherProfile?.name ?? "",
      mobile: String(phone ?? ""),
      email: email ?? "",
      address: address ?? "",
    });

    setImageFile(null);
    setImagePreview("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherProfile?.name, phone, email, address]);

  const initials = useMemo(() => {
    const n = teacherProfile?.name ?? "T";
    return n?.[0]?.toUpperCase?.() ?? "T";
  }, [teacherProfile?.name]);

  function openEdit() {
    setShowEdit(true);
  }

  function closeEdit() {
    if (saving) return;
    setShowEdit(false);
  }

  function onPickImage(file?: File) {
    if (!file) return;

    const ok = file.type.startsWith("image/") && file.size <= 3 * 1024 * 1024;
    if (!ok) {
      alert("Please select an image file (max 3MB).");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  async function handleSave() {
    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
      };

      await updateTeacherProfile(payload, imageFile);
      setShowEdit(false);
    } catch (e: any) {
      alert(e?.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section cn="bg-orange-50 md:w-[95%] flex flex-col items-center p-6 overflow-y-auto">
      {/* ===== HEADER ===== */}
      <Div cn="w-[95%] flex items-center justify-between mb-6">
        <Div cn="flex flex-col">
          <Span cn="text-2xl font-bold text-amber-900">
            {profileLoading ? "Loading..." : `Welcome, ${teacherProfile?.name ?? "Teacher"}`}
          </Span>
          <Span cn="text-sm text-amber-700">Dashboard • Profile & approvals</Span>
        </Div>

        <Div cn="flex items-center gap-3">
          <Button
            cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer flex items-center gap-2"
            onClick={openEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit Profile
          </Button>

          <Div cn="bg-white rounded-full size-12 flex items-center justify-center shadow border border-amber-200/40 overflow-hidden">
            {teacherProfile?.imageUrl ? (
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:8080${teacherProfile.imageUrl}`}
                alt="profile"
              />
            ) : (
              <Span cn="text-amber-800 font-bold">{initials}</Span>
            )}
          </Div>
        </Div>
      </Div>

      {/* ===== ERROR STATES ===== */}
      {(profileError || noticesError) && (
        <Div cn="w-[95%] mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          <Span cn="font-semibold">Something went wrong.</Span>
          <Span cn="block text-sm mt-1">{profileError || noticesError}</Span>
        </Div>
      )}

      {/* ================== STATS: only these 3 ================== */}
      <Div cn="grid grid-cols-1 md:grid-cols-3 gap-6 w-[95%] mb-8">
        <Div cn="bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30 flex items-center justify-between">
          <Div>
            <Span cn="text-sm font-semibold text-amber-800">Students</Span>
            <Span cn="block text-4xl font-bold text-amber-900 mt-1">
              {profileLoading ? "-" : studentsCount}
            </Span>
          </Div>
          <Div cn="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-amber-600 text-xl" />
          </Div>
        </Div>

        <Div cn="bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30 flex items-center justify-between">
          <Div>
            <Span cn="text-sm font-semibold text-amber-800">Class</Span>
            <Span cn="block text-4xl font-bold text-amber-900 mt-1">
              {profileLoading ? "-" : classNumber}
            </Span>
          </Div>
          <Div cn="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-amber-600 text-xl" />
          </Div>
        </Div>

        <Div cn="bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30 flex items-center justify-between">
          <Div>
            <Span cn="text-sm font-semibold text-amber-800">Experience</Span>
            <Span cn="block text-4xl font-bold text-amber-900 mt-1">
              {profileLoading ? "-" : exp}
              <Span cn="text-base font-semibold text-amber-700 ml-2">yrs</Span>
            </Span>
          </Div>
          <Div cn="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faAward} className="text-amber-600 text-xl" />
          </Div>
        </Div>
      </Div>

      {/* ================== MAIN ROW: LEFT Claims | RIGHT Details bricks ================== */}
      <Div cn="w-[95%] grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* LEFT: Claims (take 2 columns) */}
        <Div cn="lg:col-span-2 bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30">
          <Div cn="flex items-center justify-between mb-4">
            <Span cn="text-xl font-bold text-amber-900">Lost & Found Claims</Span>
            <Button
              cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer"
              onClick={fetchPendingClaims}
            >
              Refresh
            </Button>
          </Div>

          {claimsError && (
            <Div cn="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
              {claimsError}
            </Div>
          )}

          {claimsLoading ? (
            <Div cn="p-6 text-center text-amber-700">Loading claims...</Div>
          ) : !claims || claims.length === 0 ? (
            <Div cn="p-10 text-center text-amber-600 opacity-70">No pending claims for you</Div>
          ) : (
            <Div cn="space-y-3">
              {claims.map((c) => (
                <Div
                  key={c.id}
                  cn="p-4 rounded-xl bg-amber-50/80 border border-amber-200/40 shadow-sm"
                >
                  <Div cn="flex items-start justify-between gap-4">
                    <Div cn="flex-1">
                      <Span cn="font-semibold text-amber-900">
                        {c.item?.itemName ?? "Item"} • ID: {c.item?.itemId ?? "-"}
                      </Span>

                      <Span cn="block text-sm text-amber-700 mt-1">
                        Claimed by: <span className="font-semibold">{c.studentId}</span>
                      </Span>

                      <Span cn="block text-sm text-amber-700 mt-1">
                        {c.item?.itemDescription ?? "-"}
                      </Span>

                      <Span cn="block text-xs text-amber-700 mt-2">
                        Date: {c.item?.date ?? "-"}
                      </Span>
                    </Div>

                    <Div cn="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        cn={`px-4 py-2 rounded-lg text-white transition ${
                          actingClaimId === c.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-500 hover:bg-teal-600 cursor-pointer"
                        }`}
                        disabled={actingClaimId === c.id}
                        onClick={async () => {
                          try {
                            await approveClaim(c.id);
                          } catch (e: any) {
                            alert(e?.message ?? "Approve failed");
                          }
                        }}
                      >
                        {actingClaimId === c.id ? "Processing..." : "Approve"}
                      </Button>

                      <Button
                        cn={`px-4 py-2 rounded-lg text-white transition ${
                          actingClaimId === c.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 cursor-pointer"
                        }`}
                        disabled={actingClaimId === c.id}
                        onClick={async () => {
                          try {
                            await rejectClaim(c.id);
                          } catch (e: any) {
                            alert(e?.message ?? "Reject failed");
                          }
                        }}
                      >
                        {actingClaimId === c.id ? "Processing..." : "Reject"}
                      </Button>
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
          )}
        </Div>

        {/* RIGHT: Teacher details bricks (ONLY these) */}
        <Div cn="bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30">
          <Span cn="text-xl font-bold text-amber-900">Your Details</Span>

          <Div cn="grid grid-cols-1 gap-4 mt-4">
            <Div cn="flex items-center gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/40">
              <FontAwesomeIcon icon={faIdCard} className="text-amber-600" />
              <Div>
                <Span cn="text-xs text-amber-700">Teacher ID</Span>
                <Span cn="block font-semibold text-amber-900">{teacherId}</Span>
              </Div>
            </Div>

            <Div cn="flex items-center gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/40">
              <FontAwesomeIcon icon={faPhone} className="text-amber-600" />
              <Div>
                <Span cn="text-xs text-amber-700">Mobile</Span>
                <Span cn="block font-semibold text-amber-900">{String(phone) || "-"}</Span>
              </Div>
            </Div>

            <Div cn="flex items-center gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/40">
              <FontAwesomeIcon icon={faEnvelope} className="text-amber-600" />
              <Div>
                <Span cn="text-xs text-amber-700">Email</Span>
                <Span cn="block font-semibold text-amber-900">{email || "-"}</Span>
              </Div>
            </Div>

            <Div cn="flex items-center gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/40">
              <FontAwesomeIcon icon={faLocationDot} className="text-amber-600" />
              <Div>
                <Span cn="text-xs text-amber-700">Address</Span>
                <Span cn="block font-semibold text-amber-900">{address || "-"}</Span>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>

      {/* ================== NOTICES UI (keep as is) ================== */}
      <Div cn="w-[95%] bg-white/80 rounded-2xl p-6 border border-orange-200/40 shadow-sm shadow-orange-200/30">
        <Div cn="flex items-center justify-between mb-4">
          <Div cn="flex items-center gap-2">
            <FontAwesomeIcon icon={faBullhorn} className="text-amber-600" />
            <Span cn="text-xl font-bold text-amber-900">Notices</Span>
          </Div>

          <Button
            cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer"
            onClick={fetchNotices}
          >
            Refresh
          </Button>
        </Div>

        {noticesLoading ? (
          <Div cn="p-6 text-center text-amber-700">Loading notices...</Div>
        ) : !notices || notices.length === 0 ? (
          <Div cn="p-10 text-center text-amber-600 opacity-70">No notices available</Div>
        ) : (
          <Div cn="space-y-3">
            {notices.map((n: any) => (
              <Div
                key={n.id}
                cn="p-4 rounded-xl bg-amber-50/80 border border-amber-200/40 shadow-sm"
              >
                <Div cn="flex items-start justify-between gap-4">
                  <Div cn="flex-1">
                    <Span cn="font-semibold text-amber-900">{n.title ?? "Notice"}</Span>
                    <Span cn="block text-sm text-amber-700 mt-1">
                      {n.body?.slice?.(0, 90) ?? "-"}
                    </Span>
                  </Div>
                  <Span cn="text-xs text-amber-700 whitespace-nowrap">
                    {n.createdAt ? String(n.createdAt).slice(0, 10) : ""}
                  </Span>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>

      {/* ================== EDIT PROFILE MODAL (unchanged) ================== */}
      {showEdit && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={closeEdit}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[680px] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-[#7A4A00]">Edit Profile</Span>
              <Span
                cn={`cursor-pointer text-amber-700 ${saving ? "opacity-50 pointer-events-none" : ""}`}
                onClick={closeEdit}
              >
                ✕
              </Span>
            </Div>

            {/* ✅ Image picker */}
            <Div cn="flex items-center gap-5 mb-6">
              <Div cn="w-20 h-20 rounded-2xl overflow-hidden border border-amber-200/60 bg-amber-50 flex items-center justify-center">
                {imagePreview ? (
                  <img className="w-full h-full object-cover" src={imagePreview} alt="preview" />
                ) : teacherProfile?.imageUrl ? (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:8080${teacherProfile.imageUrl}`}
                    alt="current"
                  />
                ) : (
                  <Span cn="text-amber-800 font-bold text-2xl">{initials}</Span>
                )}
              </Div>

              <Div cn="flex flex-col gap-2">
                <Span cn="text-sm font-semibold text-amber-800">Profile Image</Span>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer w-fit">
                  <FontAwesomeIcon icon={faImage} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickImage(e.target.files?.[0])}
                  />
                </label>

                <Span cn="text-xs text-amber-700 opacity-80">JPG/PNG • Max 3MB</Span>
              </Div>
            </Div>

            <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                labelCN="hidden"
                labelTxt="Name"
                forName="name"
                type="text"
                inpTxt="Name"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />

              <Input
                labelCN="hidden"
                labelTxt="Mobile"
                forName="mobile"
                type="text"
                inpTxt="Mobile"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.mobile}
                onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
              />

              <Input
                labelCN="hidden"
                labelTxt="Email"
                forName="email"
                type="email"
                inpTxt="Email"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />

              <Input
                labelCN="hidden"
                labelTxt="Address"
                forName="address"
                type="text"
                inpTxt="Address"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />

              <Div cn="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                <Button
                  cn={`px-5 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer ${
                    saving ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={closeEdit}
                >
                  Cancel
                </Button>

                <Button
                  cn={`px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer ${
                    saving ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Section>
  );
}
