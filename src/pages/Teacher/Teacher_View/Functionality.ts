import {useState} from 'react';
export type active = "dashboard" | "lost&found" | "register users" | "ptm" | "marks";
export default function useTeacherView(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");
  function handleActiveTab(val : active){
    setActiveTab(val);
  }

  return {activeTab, handleActiveTab};
}
