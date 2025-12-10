import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Section, Div, Span} from '../../../Components/Assembler';
import text from '../../../assets/black-Photoroom-cpy.png';
import admin from "../../../assets/Office Worker.gif";
import {faChalkboardUser, faAddressCard, faUser, faArrowRightFromBracket, faMagnifyingGlass, faBars, faCircleXmark} from '@fortawesome/free-solid-svg-icons'
import type { HandleTab } from './Functionality';
export default function Sidebar( props : HandleTab){
    const {handleFunc, activeTab, barsVisibility, handleBarsVisibility} =  props;
    return <Section cn='md:w-1/6 h-1/7 flex md:flex-col justify-start items-center md:h-lvh '> {/* Sidebar Section */}
        {/* Div Holding Logo & Traversing Navs */}
        <Div cn='w-full flex md:flex-col justify-start items-center h-full md:h-9/10 text-white bg-purple-300'>
            {/* Title */}
            <Span cn='text-xl md:h-[35%] relative h-full w-1/2 md:w-full flex bg-purple-300 justify-center items-center pt-2 gv text-shadow-xs text-shadow-black'>
                {/* <img src={edu} className='object-cover h-18 '></img> */}
                <img src={admin} className='md:object-cover size-18 md:size-3/4 absolute left-0 md:relative'></img>
            </Span>
            <Span cn='absolute right-2 text-xl md:hidden'>
                <FontAwesomeIcon onClick={handleBarsVisibility} icon={faBars}></FontAwesomeIcon>
            </Span>
            {/* Nav Links */}
            <Div cn={`flex flex-col items-center md:relative absolute top-0 right-0 md:h-8/10 ${!barsVisibility ? "hidden" : ""} md:border-none md:w-full w-1/2 bg-purple-300 border border-l-2 rounded-bl-xl border-black h-2/3`}>
                <Span cn='self-end pr-2 text-xl md:hidden my-2'>
                    <FontAwesomeIcon onClick={handleBarsVisibility} icon={faCircleXmark}></FontAwesomeIcon>
                </Span>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "dashboard" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc!("dashboard")}>
                    <Span cn={`text-sm lg:text-xl block mr-2 ${activeTab === "dashboard" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-sm lg:text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Dashboard
                    </Span>
                    {activeTab === "dashboard" && <Span cn='text-sm lg:text-xl group-hover:hidden text-purple-400'>
                        Dashboard
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "register users" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc!("register users")}>
                    <Span cn={`text-sm lg:text-xl block mr-2 ${activeTab === "register users" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-sm lg:text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Register Users
                    </Span>
                    {activeTab === "register users" && <Span cn='text-sm lg:text-xl group-hover:hidden group-hover:block text-purple-400'>
                        Register Users
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "lost&found" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc!("lost&found")}>
                    <Span cn={`text-sm lg:text-xl block mr-2 ${activeTab === "lost&found" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-sm lg:text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Lost&Found
                    </Span>
                    {activeTab === "lost&found" && <Span cn='text-sm lg:text-xl group-hover:hidden group-hover:block text-purple-400'>
                        Lost&Found
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "ptm" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc!("ptm")}>
                    <Span cn={`text-sm lg:text-xl block mr-2 ${activeTab === "ptm" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faChalkboardUser} />
                    </Span>
                    <Span cn='text-sm lg:text-xl hidden group-hover:block group-hover:text-purple-400'>
                        PTM
                    </Span>
                    {activeTab === "ptm" && <Span cn='text-sm lg:text-xl group-hover:hidden group-hover:block text-purple-400'>
                        PTM
                    </Span>}
                </Button>

                <Div cn={`md:h-1/10 h-1/8 md:hidden w-full mt-auto ${!barsVisibility ? "hidden" : ""} text-white`}>
                    <Button cn='w-full group text-xl h-full flex justify-center items-center hover:text-red-600 transition transition-all duration-400 ease cursor-pointer' onClick={()=>{}}>
                        <Span cn='text-sm md:text-xl block mr-2'>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </Span>
                        <Span cn='text-sm md:text-xl group-hover:block'>
                            Logout
                        </Span>
                    </Button>
                </Div>
            </Div>
        </Div>

        {/* Logout Button */}
        <Div cn={`md:h-1/10 h-full hidden md:block bg-purple-300 w-full ${barsVisibility ? "hidden" : ""} text-white`}>
            <Button cn='w-full group text-xl h-full flex justify-center items-center hover:text-red-600 transition transition-all duration-400 ease cursor-pointer' onClick={()=>{}}>
                <Span cn='text-sm lg:text-xl block mr-2'>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Span>
                <Span cn='text-sm lg:text-xl group-hover:block'>
                    Logout
                </Span>
            </Button>
        </Div>
    </Section>
}