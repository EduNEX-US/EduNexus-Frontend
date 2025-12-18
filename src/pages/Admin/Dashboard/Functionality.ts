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
  const [update, setUpdate] = useState<boolean>(false);
  const [noticeTitle, setNoticeTitle] = useState<string>("");
  const [noticeBody, setNoticeBody] = useState<string>("");
  const [updateId, setUpdateId] = useState<string>("");
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

  async function handleDeleteNotice(id : string){
    setNotices(prev => prev.filter(n=> n.id != id));
    try{
      const res = await fetch(`http://localhost:8080/notice?id=${id}`, {
        method : "DELETE"
      });

      if(res.ok){
        setNotices(prev => prev.filter(n=> n.id != id));
      }
      else{
        console.log("Failed To Delete");
      }
    }
    catch{
      console.log("Error Occured In Deleting from DB");
    }
  }

  async function handleUpdateNotice() {
    const newNotice : notice = {
      id: updateId,
      title: noticeTitle,
      body: noticeBody,
      date: new Date().toISOString().split("T")[0]
    };
    try{
      const res = await fetch(`http://localhost:8080/notice?id=${updateId}`, {
        method : "PUT"
      });

      if(res.ok){
        setNotices(prev => prev.map(n => {
          if(n.id === updateId){
            return newNotice;
          }
          return n;
        }));
      }
      else{
        console.log("Failed To Delete");
      }
    }
    catch{
      console.log("Error Occured In Deleting from DB");
    }
  }

  function handleUpdateId(id : string){
    setUpdateId(id);
  }
  return {adminInfo, noticeTitle, noticeBody, notices, update, handleNoticeBody, handleNoticeTitle, handleNotices, handlePostNotice, handleDeleteNotice, handleUpdateNotice, handleUpdateToggle, handleUpdateId}
}