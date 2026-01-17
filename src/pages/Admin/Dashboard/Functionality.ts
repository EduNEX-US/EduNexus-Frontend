import {useState, useEffect} from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';

export type notice = {id : string, title : string, body : string, date : string};
export type admin = {name : string, email : string, mobile : string, role : string, address : string};
export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  mobile: string | number;
  exp: number;
  address: string;
  tClass: string;
  qualification: string;
  imageUrl: string;
};
export default function useFuncs(){
  const [adminDetails, setAdminDetails] = useState<AdminProfile>();
  const [update, setUpdate] = useState<boolean>(false);
  const [noticeTitle, setNoticeTitle] = useState<string>("");
  const [noticeBody, setNoticeBody] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");
  const [notices, setNotices] = useState<notice[]>([]);

  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
const [selectedImage, setSelectedImage] = useState<File | null>(null);

const [isEditingInfo, setIsEditingInfo] = useState(false);
const [editForm, setEditForm] = useState({
  name: adminDetails?.name ?? "",
  email: adminDetails?.email ?? "",
  mobile: adminDetails?.mobile ?? "",
  exp: adminDetails?.exp ?? 0,
  qualification: adminDetails?.qualification ?? "",
  address: adminDetails?.address ?? "",
});

// keep editForm synced when adminDetails loads/changes
useEffect(() => {
  setEditForm({
    name: adminDetails?.name ?? "",
    email: adminDetails?.email ?? "",
    mobile: adminDetails?.mobile ?? "",
    exp: adminDetails?.exp ?? 0,
    qualification: adminDetails?.qualification ?? "",
    address: adminDetails?.address ?? "",
  });
}, [adminDetails]);

function openImageModal() {
  setSelectedImage(null);
  setIsImageModalOpen(true);
}

function closeImageModal() {
  setSelectedImage(null);
  setIsImageModalOpen(false);
}

function startEditInfo() {
  setIsEditingInfo(true);
}

function cancelEditInfo() {
  // revert to original data
  setEditForm({
    name: adminDetails?.name ?? "",
    email: adminDetails?.email ?? "",
    mobile: adminDetails?.mobile ?? "",
    exp: adminDetails?.exp ?? 0,
    qualification: adminDetails?.qualification ?? "",
    address: adminDetails?.address ?? "",
  });
  setIsEditingInfo(false);
}

  useEffect(()=>{
    handleGetNotices();
    handleAdminInfo();
  },[]);
  
  const token = useAppSelector(state => state.auth.token);
  const id = useAppSelector(state => state.auth.id);

  async function handleAdminInfo() {
    const res = await fetch(`http://localhost:8080/admin/${id}`, {
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
    const data = await res.json();
    if(res.ok) {
      setAdminDetails(data);
      console.log(data)
    }
    else {
      console.log("Error fetching admin info:", data.error);
    }
  }

  async function handleGetNotices(){
    try{
      const res = await fetch("http://localhost:8080/notice", {
      headers : {
        Authorization : `Bearer ${token}`
      }
    });
      setNotices(await res.json());
    }
    catch{
      console.log("Error Occurred In The Get Notices");
    }
  }
  async function handlePostNotice(){
    if (!noticeTitle || !noticeBody) return;

    const newNotice : notice = {
      id: "",
      title: noticeTitle,
      body: noticeBody,
      date: new Date().toISOString().split("T")[0]
    };
    const res = fetch("http://localhost:8080/notice", {
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        method : "POST",
        body : JSON.stringify(newNotice)
    });
    if ((await res).ok) {
  const idObj = await (await res).json();
  newNotice.id = idObj.id;

  await handleGetNotices();   // ✅ refresh from backend
  handleNoticeTitle("");
  handleNoticeBody("");
}

  };

  console.log()
  function handleUpdateToggle(){
    setUpdate(!update);
  }

  function handleNotices(val : notice){
    setNotices(prev=> [val, ...prev]);
  }

  function handleNoticeTitle(val : string){
    setNoticeTitle(val);
  }

  function handleNoticeBody(val : string){
    setNoticeBody(val);
  }

  async function handleDeleteNotice(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/notice/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } else {
      console.log("Failed to delete");
    }
  } catch {
    console.log("Error occurred while deleting notice");
  }
}


  async function handleUpdateNotice() {
  if (!updateId || !noticeTitle || !noticeBody) return;

  const updatedNotice: notice = {
    id: updateId,
    title: noticeTitle,
    body: noticeBody,
    date: new Date().toISOString().split("T")[0],
  };

  try {
    const res = await fetch(`http://localhost:8080/notice/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedNotice),
    });

    if (res.ok) {
      setNotices((prev) =>
        prev.map((n) => (n.id === updateId ? updatedNotice : n))
      );
      handleNoticeTitle("");
      handleNoticeBody("");
      setUpdateId("");
      setUpdate(false);
    } else {
      const err = await res.text();
      console.log("Update failed:", err);
    }
  } catch {
    console.log("Error occurred while updating notice");
  }
}

async function handleUpdateAdminInfo(editForm: {
  name: string;
  email: string;
  mobile: string | number;
  exp: number;
  qualification: string;
  address: string;
}) {
  const res = await fetch("http://localhost:8080/admin/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...editForm,
      mobile: Number(editForm.mobile),
      exp: Number(editForm.exp),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "UPDATE_FAILED");
  handleAdminInfo();
  return data;
}

async function handleUploadAdminImage(file: File) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch("http://localhost:8080/admin/profile/image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "UPLOAD_FAILED");
  handleAdminInfo();
  return data; // { imageUrl }
}

  function handleUpdateId(id : string){
    setUpdateId(id);
  }
  return {adminDetails, noticeTitle, noticeBody, notices, update, isEditingInfo, editForm, isImageModalOpen, setEditForm, handleNoticeBody, handleNoticeTitle, handleNotices, handlePostNotice, handleDeleteNotice, handleUpdateNotice, handleUpdateToggle, handleUpdateId, openImageModal, closeImageModal, startEditInfo, cancelEditInfo, setIsEditingInfo, selectedImage, setSelectedImage, handleUploadAdminImage, handleUpdateAdminInfo}
}