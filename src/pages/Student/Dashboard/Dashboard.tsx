import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Div, Span, Section, Button, Input } from "../../../Components/Assembler";
import type { HandleTab } from "../../../Components/Sidebar/Functionality";
import {
  faGreaterThan,
  faUser,
  faPenToSquare,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import useFuncs from "./Functionality";

export default function Dashboard(props: HandleTab) {
  const { handleFunc } = props;

  const {
    studentData,
    recentTests,
    getGradeColor,

    // notices
    notices,
    noticesLoading,
    noticesError,
    fetchNotices,

    // student fetch state
    studentLoading,
    studentError,

    // ✅ update api + states
    updateStudentMe,
    updating,
    updateError,
    updateSuccess,
  } = useFuncs();

  // ---------- Edit modal state ----------
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    setForm({
      name: String(studentData?.name ?? ""),
      email: String(studentData?.email ?? ""),
      mobile: String(studentData?.parentPhone ?? ""),
      address: String(studentData?.address ?? ""),
    });

    setImageFile(null);
    setImagePreview("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentData?.name, studentData?.email, studentData?.parentPhone, studentData?.address]);

  const initials = useMemo(() => {
    const n = String(studentData?.name ?? "S").trim();
    return (n?.[0]?.toUpperCase?.() ?? "S") as string;
  }, [studentData?.name]);

  function openEdit() {
    setShowEdit(true);
  }

  function closeEdit() {
    if (updating) return;
    setShowEdit(false);
  }

  function onPickImage(file?: File) {
    if (!file) return;

    const ok =
      file.type.startsWith("image/") && file.size <= 3 * 1024 * 1024; // 3MB
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
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
      };

      await updateStudentMe(payload, imageFile);

      setShowEdit(false);
    } catch (e: any) {
      alert(e?.message ?? "Failed to update profile");
    }
  }

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
      {/* ================= LEFT SECTION ================= */}
      <Div cn="md:w-4/6 w-full flex flex-col gap-6">
        {/* ===== NOTICES (replaces attendance block) ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 relative">
          <Div cn="flex items-center justify-between mb-3">
            <Span cn="text-lg md:text-xl font-semibold text-amber-900">
              Notices
            </Span>

            <Button
              onClick={fetchNotices}
              cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer text-sm"
            >
              Refresh
            </Button>
          </Div>

          {noticesError && (
            <Div cn="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {noticesError}
            </Div>
          )}

          {noticesLoading ? (
            <Div cn="p-6 text-center text-amber-700">Loading notices...</Div>
          ) : !notices || notices.length === 0 ? (
            <Div cn="p-10 text-center text-amber-600 opacity-70">
              No notices available
            </Div>
          ) : (
            <Div cn="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {notices.map((n: any) => (
                <Div
                  key={n.id}
                  cn="bg-white rounded-xl border border-amber-200/40 p-4 hover:shadow-sm transition"
                >
                  <Div cn="flex items-start justify-between gap-3">
                    <Div cn="flex-1">
                      <Span cn="font-semibold text-amber-900">
                        {n.title ?? "Notice"}
                      </Span>
                      <Span cn="block text-sm text-amber-700 mt-1">
                        {(n.body ?? n.message ?? n.content ?? "-").slice(0, 140)}
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

        {/* ===== RECENT TESTS ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4">
          <Div cn="flex justify-between items-center mb-4">
            <Span cn="text-lg md:text-xl font-semibold text-amber-900">
              Recent Tests
            </Span>

            <Button
              onClick={() => handleFunc("marks")}
              cn="text-sm font-medium flex items-center gap-1 text-teal-600 hover:text-teal-700 transition"
            >
              View All
              <FontAwesomeIcon icon={faGreaterThan} className="text-xs" />
            </Button>
          </Div>

          {!recentTests || recentTests.length === 0 ? (
            <Div cn="p-10 text-center text-amber-600 opacity-70">
              No recent marks available
            </Div>
          ) : (
            <Div cn="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {recentTests.map((test) => (
                <Div
                  key={test.id}
                  cn="bg-white rounded-xl border border-amber-200/40 p-4 hover:shadow-sm transition"
                >
                  <Div cn="flex justify-between items-start">
                    <Div cn="">
                      <Span cn="font-semibold text-amber-900">
                        {test.subject}
                      </Span>
                      <Span cn="block text-xs text-amber-600">{test.date}</Span>
                    </Div>

                    <Span
                      cn={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                        test.grade
                      )}`}
                    >
                      {test.grade}
                    </Span>
                  </Div>

                  <Div cn="mt-3">
                    <Div cn="flex items-end gap-1">
                      <Span cn="text-2xl font-bold text-teal-500">
                        {test.score}
                      </Span>
                      <Span cn="text-sm text-amber-600 mb-1">
                        / {test.total}
                      </Span>
                    </Div>

                    <Div cn="w-full bg-amber-100/60 rounded-full h-2 mt-2">
                      <div
                        className="bg-teal-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((test.score / test.total) * 100)
                          )}%`,
                        }}
                      />
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
          )}
        </Div>
      </Div>

      {/* ================= RIGHT SECTION ================= */}
      <Div cn="md:w-2/6 w-full flex flex-col gap-6">
        {/* PROFILE */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-6 flex flex-col items-center">
          <Div cn="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-4xl mb-3 overflow-hidden">
            {studentData?.imageUrl ? (
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:8080${studentData.imageUrl}`}
                alt="profile"
              />
            ) : (
              <Span cn="font-bold text-amber-800">{initials}</Span>
            )}
          </Div>

          <Span cn="text-xl font-semibold text-amber-900">
            {studentLoading ? "Loading..." : studentData?.name ?? "Student"}
          </Span>

          {studentError && (
            <Span cn="text-xs text-red-600 mt-1">{studentError}</Span>
          )}

          <Button
            onClick={openEdit}
            cn="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer flex items-center gap-2 text-sm"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit Profile
          </Button>

          {(updateError || updateSuccess) && (
            <Div
              cn={`mt-3 w-full rounded-xl p-3 text-sm border ${
                updateError
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {updateError || updateSuccess}
            </Div>
          )}
        </Div>

        {/* PERSONAL DETAILS */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 flex-1 overflow-y-auto">
          <Span cn="text-lg font-semibold text-amber-900 mb-3 block">
            Personal Details
          </Span>

          <Div cn="divide-y divide-amber-200/40 overflow-y-auto">
            {Object.entries(studentData ?? {}).map(([key, value], i) => (
              <Div key={i} cn="grid grid-cols-2 py-2 text-sm items-center">
                {key != "imageUrl" && <><Span cn="text-amber-600 capitalize break-words">{key}</Span>
                <Span cn="text-amber-900 text-right break-words">
                  {String(value ?? "-")}
                </Span></>}
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={closeEdit}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[720px] max-w-[95vw] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-amber-900">Edit Profile</Span>
              <Span
                cn={`cursor-pointer text-amber-700 ${
                  updating ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={closeEdit}
              >
                ✕
              </Span>
            </Div>

            {/* Image */}
            <Div cn="flex items-center gap-5 mb-6">
              <Div cn="w-20 h-20 rounded-2xl overflow-hidden border border-amber-200/60 bg-amber-50 flex items-center justify-center">
                {imagePreview ? (
                  <img className="w-full h-full object-cover" src={imagePreview} alt="preview" />
                ) : studentData?.imageUrl ? (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:8080${studentData.imageUrl}`}
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

                <Span cn="text-xs text-amber-700 opacity-80">JPG/PNG/WebP • Max 3MB</Span>
              </Div>
            </Div>

            {/* Fields */}
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
                    updating ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={closeEdit}
                >
                  Cancel
                </Button>

                <Button
                  cn={`px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer ${
                    updating ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={handleSave}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Section>
  );
}
