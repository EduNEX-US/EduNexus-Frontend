import {useState} from 'react';

export type active = "dashboard" | "marks" | "lost&found" | "ptm";
export default function useStudentView(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");
  const [barsVisibility, setBarsVisibility] = useState<boolean>(true);

  function handleActiveTab(val : active){
    setActiveTab(val);
  }
  function handleBarsVisibility(){
        console.log("I am running!!");
        setBarsVisibility(!barsVisibility);
  }
  return {activeTab, handleActiveTab, handleBarsVisibility, barsVisibility};
}