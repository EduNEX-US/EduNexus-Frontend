import {Section} from '../../../Components/Assembler';
import Dashboard from '../Dashboard/Dashboard';
import Register_Users from '../Register_Users/Register_Users';
import Sidebar from '../Sidebar/Sidebar';
import useAdminView from './Functionality';
import PTM from '../PTM/PTM';
import Lost_Found from '../Lost&Found/Lost_Found';
import Lottie from 'lottie-react';
import worker from '../../../assets/Office Worker.json';
export default function Admin_View(){
    const {activeTab, barsVisibility, handleActiveTab, handleBarsVisibility} = useAdminView();
    return <Section cn='w-full h-screen flex md:flex-row flex-col overflow-x-hidden'>
        { activeTab !== "dashboard" && <Lottie animationData={worker} loop={true} autoplay={true} className='absolute top-0 right-0 w-30 h-25'></Lottie>}
        <Sidebar handleFunc={handleActiveTab} barsVisibility={barsVisibility} handleBarsVisibility={handleBarsVisibility} activeTab={activeTab}/>
        { activeTab === "dashboard" && <Dashboard barsVisibility={barsVisibility} handleBarsVisibility={handleBarsVisibility} /> }
        { activeTab === "lost&found" && <Lost_Found /> }
        { activeTab === "register users" && <Register_Users /> }
        { activeTab === "ptm" && <PTM /> }
    </Section>
}