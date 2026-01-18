import useTeacherView from "./Functionality";
import Sidebar from "../Sidebar/Sidebar";
import { Section } from "../../../Components/Assembler";
import Dashboard from "../Dashboard/Dashboard";
import Marks from "../Marks/Marks";
import PTM from "../PTM/PTM";
import Lost_Found from "../Lost&Found/Lost_Found";
import Register_Students from "../Register_Students/Register_Students";
import Attendance from "../Attendance/Attendance";
import Lottie from "lottie-react";
import teach from "../../../assets/Teaching.json";

export default function Teacher_View(){
    const {activeTab, handleActiveTab} = useTeacherView();
    return <Section cn='w-full h-screen flex md:flex-row flex-col overflow-x-hidden'>
            { activeTab !== "dashboard" && activeTab !== "attendance" && activeTab !== "marks" && <Lottie animationData={teach} loop={true} autoplay={true} className='absolute top-0 right-0 w-30 h-20'></Lottie>}
            <Sidebar handleFunc={handleActiveTab} activeTab={activeTab}/>
            { activeTab === "dashboard" && <Dashboard handleFunc={handleActiveTab} /> }
            { activeTab === "marks" && <Marks /> }
            {/* { activeTab === "attendance" && <Attendance /> } */}
            { activeTab === "register users" && <Register_Students />}
            { activeTab === "lost&found" && <Lost_Found /> }
            { activeTab === "ptm" && <PTM /> }
        </Section>
}