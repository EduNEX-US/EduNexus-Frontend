import {Section} from '../../../Components/Assembler';
import Dashboard from '../Dashboard/Dashboard';
import Sidebar from '../../../Components/Sidebar/Sidebar';
export default function Student_View(){
    return <Section cn='w-full h-lvh flex'>
        <Sidebar />
        <Dashboard />
    </Section>
}