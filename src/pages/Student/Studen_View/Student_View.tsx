import {Section} from '../../../Components/Assembler';
import Dashboard from '../Dashboard/Dashboard';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import Marks from '../Marks/Marks';
import Ptm from '../PTM/Ptm';
import Lost_Found from '../Lost&Found/Lost_Found';
import useStudentView from './Functionality';
export default function Student_View(){
    const {activeTab, handleActiveTab} = useStudentView();
    return <Section cn='w-full h-lvh flex md:flex-row flex-col overflow-x-hidden'>
        <Sidebar handleFunc={handleActiveTab} activeTab={activeTab}/>
        { activeTab === "dashboard" && <Dashboard handleFunc={handleActiveTab} /> }
        { activeTab === "marks" && <Marks /> }
        { activeTab === "lost&found" && <Lost_Found /> }
        { activeTab === "ptm" && <Ptm /> }
    </Section>
}