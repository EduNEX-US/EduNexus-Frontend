import {Div, Section, Button, Span, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export default function Dashboard(){
    const {adminInfo, noticeTitle, noticeBody, notices, handleNoticeBody, handleNoticeTitle, handlePostNotice} = useFuncs()
    return <Section cn="flex md:w-5/6 p-6 overflow-y-hidden bg-white">
        <Div cn='w-2/3 h-lvh'>
            <h2 className="text-3xl font-semibold mb-8 h-[7%]">Admin Dashboard</h2>
            <Div cn="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[93%] overflow-y-auto">

                {/* Notice Posting Section */}
                <Div cn="col-span-1 lg:col-span-4 rounded-2xl shadow-md order-2 md:order-1 border p-6 pb-15 bg-white">
                    <Span cn="text-xl font-semibold mb-4">Post Notice</Span>

                    <Input
                    inpTxt="Notice Title"
                    inpCN="p-3 border rounded w-full mb-4"
                    value={noticeTitle}
                    labelCN='hidden'
                    labelTxt='Notice Title'
                    forName='Notice Title'
                    type='text'
                    onChange={(e) => handleNoticeTitle(e.target.value)}
                    />

                    <textarea
                    placeholder="Notice Details"
                    className="p-3 border rounded w-full h-32 mb-4 resize-none"
                    value={noticeBody}
                    onChange={(e) => handleNoticeBody(e.target.value)}
                    />

                    <Button
                    disabled={!noticeTitle || !noticeBody}
                    cn={`px-6 py-2 rounded text-white ${(!noticeTitle || !noticeBody) ? "bg-gray-400" : " bg-purple-400"}`}
                    onClick={handlePostNotice}
                    >
                    Post Notice
                    </Button>

                    {/* Notice List */}
                    <Div cn="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Recent Notices</h3>
                    <Div cn="flex flex-col gap-3">
                        {notices.map(n => (
                        <Div key={n.id} cn="border rounded-xl p-4 shadow-sm">
                            <Div cn="font-semibold text-lg">{n.title}</Div>
                            <Div cn="text-sm text-gray-600 mb-2">{n.date}</Div>
                            <Div cn=''>{n.body}</Div>
                        </Div>
                        ))}
                    </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
        <Div cn='md:order-2 order-1 flex justify-center items-center w-1/3 h-lvh'>
            <Div cn='h-full flex md:flex-col items-center w-full'>
                <Div cn='w-full h-1/3 flex justify-center items-center flex-col'>
                    <Span cn='bg-white h-3/5 block w-1/3 text-purple-400 border-1 border-black outline-1 outline-black m-1 text-[4rem] rounded-full flex justify-center items-center'>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </Span>
                    <Span cn=' text-2xl font-semibold text-center text-purple-400'>Aman Kaushik</Span>
                </Div>
                <Div cn='border-1 h-2/3 border-black rounded-xl md:rounded-t-xl md:rounded-b-none flex flex-col justify-start items-center bg-purple-300'>
                    <Span cn='font-extrabold text-xl h-1/6 py-1 text-black'>Personal Details</Span>
                    <Div cn='h-5/6 w-full flex flex-col justify-start items-center divide-y-2 divide-purple-400/25 divide-opacity-25 px-3 overflow-y-auto'>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-black text-center'>Class</Span>
                            <Span cn='text-white text-center'>{adminInfo.name}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-black text-center break-words'>Classjjjjjjjjjjjjjjjjjjjjjjjjjj</Span>
                            <Span cn='text-white text-center break-words'>{adminInfo.email}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-black text-center'>Class</Span>
                            <Span cn='text-white text-center'>{adminInfo.mobile}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-black text-center'>Class</Span>
                            <Span cn='text-white text-center'>{adminInfo.address}</Span>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
      </Section>
}