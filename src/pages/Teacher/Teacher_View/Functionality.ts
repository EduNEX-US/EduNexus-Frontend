import {useState} from 'react';
export type active = "dashboard" | "marks" | "lost&found" | "ptm";
export default function useTeacherView(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");
  function handleActiveTab(val : active){
    setActiveTab(val);
  }

  return {activeTab, handleActiveTab};
}
