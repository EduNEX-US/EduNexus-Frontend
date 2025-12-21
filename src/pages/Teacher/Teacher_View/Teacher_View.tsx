import useTeacherView from "./Functionality";
import Sidebar from "../Sidebar/Sidebar";
import { Section } from "../../../Components/Assembler";
import Dashboard from "../Dashboard/Dashboard";
import Marks from "../Marks/Marks";
import PTM from "../PTM/PTM";
import Lost_Found from "../Lost&Found/Lost_Found";
import Register_Students from "../Register_Students/Register_Students";

export default function Teacher_View(){
    const {activeTab, handleActiveTab} = useTeacherView();
    return <Section cn='w-full h-screen flex md:flex-row flex-col overflow-x-hidden'>
            <Sidebar handleFunc={handleActiveTab} activeTab={activeTab}/>
            { activeTab === "dashboard" && <Dashboard handleFunc={handleActiveTab} /> }
            { activeTab === "marks" && <Marks /> }
            { activeTab === "register users" && <Register_Students />}
            { activeTab === "lost&found" && <Lost_Found /> }
            { activeTab === "ptm" && <PTM /> }
        </Section>
}