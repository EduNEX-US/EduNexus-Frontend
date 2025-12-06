import useTeacherView from "./Functionality";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { Section } from "../../../Components/Assembler";
import Dashboard from "../Dashboard/Dashboard";
import Marks from "../Marks/Marks";
import PTM from "../PTM/PTM";
export default function Teacher_View(){
    const {activeTab, handleActiveTab} = useTeacherView();
    return <Section cn='w-full h-lvh flex md:flex-row flex-col overflow-x-hidden'>
            <Sidebar handleFunc={handleActiveTab} activeTab={activeTab}/>
            { activeTab === "dashboard" && <Dashboard handleFunc={handleActiveTab} /> }
            { activeTab === "marks" && <Marks /> }
            {/* { activeTab === "lost&found" && <Lost_Found /> } */}
            { activeTab === "ptm" && <PTM /> }
        </Section>
}