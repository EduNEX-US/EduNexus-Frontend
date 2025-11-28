import {Section} from '../../../Components/Assembler';
import Dashboard from '../Dashboard/Dashboard';
import Register_Users from '../Register_Users/Register_Users';
import Sidebar from '../Sidebar/Sidebar';
import useAdminView from './Functionality';

export default function Admin_View(){
    const {activeTab, handleActiveTab} = useAdminView();
    return <Section cn='w-full h-lvh flex md:flex-row flex-col overflow-x-hidden'>
        <Sidebar handleFunc={handleActiveTab} activeTab={activeTab}/>
        { activeTab === "dashboard" && <Dashboard /> }
        {/* { activeTab === "manage" && <Marks /> } */}
        { activeTab === "register users" && <Register_Users /> }
        {/* { activeTab === "ptm" && <Ptm /> } */}
    </Section>
}