import {useState} from 'react';

export type active = "dashboard" | "lost&found" | "register users" | "ptm";
export default function useAdminView(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");

  function handleActiveTab(val : active){
    setActiveTab(val);
  }

  return {activeTab, handleActiveTab};
}