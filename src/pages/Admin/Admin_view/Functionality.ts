import {useState, useEffect} from 'react';

export type active = "dashboard" | "lost&found" | "register users" | "ptm";
export default function useAdminView(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");
  const [barsVisibility, setBarsVisibility] = useState<boolean>(false);
  useEffect(() => {
      const sync = () => setBarsVisibility(window.innerWidth >= 768);
      sync();
      window.addEventListener("resize", sync);
      return () => window.removeEventListener("resize", sync);
  }, []);
  function handleBarsVisibility(){
      console.log("I am running!!");
      setBarsVisibility(!barsVisibility);
  }
  function handleActiveTab(val : active){
    setActiveTab(val);
  }

  return {activeTab, barsVisibility, handleActiveTab, handleBarsVisibility};
}