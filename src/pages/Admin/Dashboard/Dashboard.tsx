import {Div, Section, Button, Span, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faUser } from '@fortawesome/free-solid-svg-icons';
import type { HandleTab } from '../Sidebar/Functionality';
export default function Dashboard(props : HandleTab){
    const {barsVisibility, handleBarsVisibility} = props;
    const {adminInfo, noticeTitle, noticeBody, notices, update, handleNoticeBody, handleNoticeTitle, handlePostNotice, handleDeleteNotice, handleUpdateNotice, handleUpdateToggle, handleUpdateId} = useFuncs()
    return <Section cn="flex md:flex-row flex-col items-start h-screen md:w-[95%] gap-y-8 md:pb-0 md:pt-6 overflow-y-auto md:overflow-y-hidden bg-orange-100" onClick={()=>{
        window.innerWidth < 768 && handleBarsVisibility!();
    }}>
        {/* Left/Starting DIV */}
        <Div cn='md:w-[71%] order-2 md:mr-[2%] md:order-1 w-full h-full'>
            {/* DashBoard Title */}
            <h2 className="text-xl md:text-3xl font-semibold text-amber-900
 mb-2 md:mb-8 h-[7%]">Admin Dashboard</h2>
            {/* Parent Div for Notice Posting & Notice Display */}
            <Div cn="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[93%] overflow-y-auto bg-orange-50 border-3 border-orange-300/50">
                {/* Notice Posting Section */}
                <Div cn="col-span-1 lg:col-span-4 rounded-sm shadow-md order-2 md:order-1 p-3 md:p-6 md:pb-15">
                    {/* Post Notice Title */}
                    <Span cn="text-lg md:text-xl font-semibold text-amber-900">Post Notice</Span>
                    {/* Notice Title Input Field */}
                    <Input
                    inpTxt="Notice Title"
                    inpCN="p-1 text-sm md:p-3 border rounded w-full mt-2 mb-4"
                    value={noticeTitle}
                    labelCN='hidden'
                    labelTxt='Notice Title'
                    forName='Notice Title'
                    type='text'
                    onChange={(e) => handleNoticeTitle(e.target.value)}
                    />
                    {/* Notice Body TextArea */}
                    <textarea
                    placeholder="Notice Details"
                    className="p-1 border text-sm md:p-3 md:text-lg rounded w-full h-22 md:h-32 mb-2 md:mb-4 resize-none"
                    value={noticeBody}
                    onChange={(e) => handleNoticeBody(e.target.value)}
                    />
                    {/* Notice Submission Button */}
                    <Button
                    disabled={!noticeTitle || !noticeBody}
                    cn={`px-3 md:px-6 py-2 text-sm md:text-lg rounded text-white
 ${(!noticeTitle || !noticeBody) ? "bg-gray-400" : " bg-teal-400 hover:bg-teal-500"}`}
                    onClick={(e)=>{
                        e.stopPropagation();
                        update ? handleUpdateNotice() : handlePostNotice();
                    }}
                    >
                    Post Notice
                    </Button>

                    {/* Notice Display Section */}
                    <Div cn="mt-4 md:mt-8">
                    {/* Recent Notice Title */}
                    <h3 className="text-lg font-semibold mb-3">Recent Notices</h3>
                    {/* Notice List */}
                    <Div cn="flex flex-col gap-3">
                        {notices.map(n => (
                        // Notice Element
                        <Div key={n.id} cn="border rounded-xl p-4 shadow-sm">
                            <Div cn="font-semibold text-sm md:text-lg flex justify-between">
                                <Span cn="">{n.title}</Span>
                                <Div cn="w-[15%] flex justify-between">
                                    <Button cn="text-orange-400" onClick={()=>{
                                        handleUpdateToggle();
                                        handleUpdateId(n.id);
                                        handleNoticeTitle(n.title);
                                        handleNoticeBody(n.body);
                                    }}><FontAwesomeIcon icon={faPen} ></FontAwesomeIcon></Button>
                                    <Button cn="text-red-800" onClick={()=> handleDeleteNotice(n.id)}><FontAwesomeIcon icon={faTrashCan} ></FontAwesomeIcon></Button>
                                </Div>
                            </Div>
                            <Div cn="text-xs md:text-sm text-gray-600 mb-2">{n.date}</Div>
                            <Div cn='text-xs'>{n.body}</Div>
                        </Div>
                        ))}
                    </Div>
                    </Div>
                </Div>
            </Div>
        </Div>

        {/* Right/Ending DIV */}
        <Div cn='md:order-2 order-1 flex justify-center self-end items-center w-full md:w-[26%] h-full'>
            {/* Personal Info */}
            <Div cn='h-full flex flex-col items-center w-full'>
                {/* Image Holding Div */}
                <Div cn='w-full h-1/3 flex justify-center items-center flex-col'>
                    {/* Substitute For Image */}
                    <Span cn='bg-yellow-50 h-3/5 block w-1/3 text-amber-400 border-3 border-amber-400 m-1 text-[4rem] rounded-full flex justify-center items-center'>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </Span>
                    {/* User Name */}
                    <Span cn=' text-2xl font-semibold text-center text-amber-700'>Aman Kaushik</Span>
                </Div>
                {/* Personal Info Data */}
                <Div cn='border-l-4 border-t-4 border-b-amber-300 h-2/3 border-amber-400 rounded-xl md:rounded-t-xl md:rounded-b-none flex flex-col justify-start items-center bg-yellow-200/50'>
                    {/* Personal Info Title */}
                    <Span cn='font-extrabold text-lg md:text-xl h-1/6 py-1 text-amber-900'>Personal Details</Span>
                    {/* Personal Data Rows */}
                    <Div cn='h-5/6 w-full flex flex-col justify-start items-center divide-y-2 divide-purple-400/25 divide-opacity-25 px-3 overflow-y-auto'>
                        {/* Personal Data Row */}
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2 '>
                            <Span cn='text-sm text-amber-700 text-center'>Class</Span>
                            <Span cn='text-xs text-amber-600 text-center'>{adminInfo.name}</Span>
                        </Div>
                        {/* Personal Data Row */}
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2 '>
                            <Span cn='text-sm text-amber-700 text-center break-words'>Classjjjjjjjjjjjjjjjjjjjjjjjjjj</Span>
                            <Span cn='text-xs text-amber-600 text-center break-words'>{adminInfo.email}</Span>
                        </Div>
                        {/* Personal Data Row */}
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-sm text-amber-700 text-center'>Class</Span>
                            <Span cn='text-xs text-amber-600 text-center'>{adminInfo.mobile}</Span>
                        </Div>
                        {/* Personal Data Row */}
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-sm text-amber-700 text-center'>Class</Span>
                            <Span cn='text-xs text-amber-600 text-center'>{adminInfo.address}</Span>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
      </Section>
}