import {useState, useEffect} from 'react';

export type notice = {id : string, title : string, body : string, date : string};
export type admin = {name : string, email : string, mobile : string, role : string, address : string};
export default function useFuncs(){
  const [adminDetails, setAdminDetails] = useState<admin>({
     name: "",
    email: "",
    mobile: "",
    role: "Ad",
    address: "",
  });
  const [noticeTitle, setNoticeTitle] = useState<string>("");
  const [noticeBody, setNoticeBody] = useState<string>("");
  const [notices, setNotices] = useState<notice[]>([
    { id: "1", title: "Holiday Notice", body: "School will remain closed on Friday.", date: "2025-01-10" }
  ]);

  useEffect(()=>{
    handleGetNotices();
  },[]);
  
  const adminInfo = {
    name: "Admin User",
    email: "admin@school.com",
    mobile: "9876543210",
    role: "Administrator",
    address: "School Campus, Block A",
  };

  async function handleAdminInfo() {
    const res = await fetch("http://localhost:8080/admin/profile");
    const data = await res.json();
    if(res.ok) {
      setAdminDetails(data);
    }
    else {
      console.log("Error fetching admin info:", data.error);
    }
  }

  async function handleGetNotices(){
    try{
      const res = await fetch("http://localhost:8080/notice");
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
    handleNotices(newNotice);
    const res = fetch("http://localhost:8080/notice", {
        headers : {
            "Content-Type" : "application/json"
        },
        method : "POST",
        body : JSON.stringify(newNotice)
    });
    if((await res).ok){
        const id = await (await res).json();
        newNotice.id = id.id;
        handleNoticeTitle("");
        handleNoticeBody("");
        handleNotices(newNotice);
    }
  };

  function handleNotices(val : notice){
    setNotices(prev=> [val, ...prev]);
  }

  function handleNoticeTitle(val : string){
    setNoticeTitle(val);
  }

  function handleNoticeBody(val : string){
    setNoticeBody(val);
  }
  return {adminInfo, noticeTitle, noticeBody, notices, handleNoticeBody, handleNoticeTitle, handleNotices, handlePostNotice}
}