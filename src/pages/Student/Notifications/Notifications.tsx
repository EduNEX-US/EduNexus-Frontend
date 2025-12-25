import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faXmark,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Div, Span, Button } from "../../../Components/Assembler";
import { useNavigate } from "react-router";
import type { HandleTab } from "../Sidebar/Functionality";
import type { active } from "../Studen_View/Functionality";

/* TEMP DATA — later connect to backend */
const notifications : Notification[] = [
  {
    id: "1",
    title: "Marks Uploaded",
    description: "Mid-term exam marks have been uploaded.",
    page: "marks",
    date: "Today",
    unread: true,
  },
  {
    id: "2",
    title: "PTM Scheduled",
    description: "Parent-Teacher meeting scheduled for Friday.",
    page: "ptm",
    date: "Yesterday",
    unread: true,
  },
  {
    id: "3",
    title: "Attendance Updated",
    description: "Attendance record has been updated.",
    page: "dashboard",
    date: "2 days ago",
    unread: false,
  },
];

interface Notification {
    id: string;
    title: string;
    description: string;
    page: active;
    date: string;
    unread: boolean;
}

interface NotificationProps {
    handleActiveTab: (val: active) => void;
}

export default function Notification({ handleActiveTab }: NotificationProps) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const unreadCount = notifications.filter((n) => n.unread).length;

    return (
        <>
            {/* 🔔 FLOATING BELL */}
            <Div
                cn="
                    fixed bottom-6 right-6 z-50
                    flex items-center justify-center
                "
            >
                <Button
                    onClick={() => setOpen(true)}
                    cn="
                        relative w-14 h-14 rounded-full
                        bg-teal-400 text-white
                        shadow-lg shadow-teal-400/40
                        hover:scale-105 transition
                        animate-pulse
                    "
                >
                    <FontAwesomeIcon icon={faBell} className="text-xl" />

                    {/* 🔴 RED DOT */}
                    {unreadCount > 0 && (
                        <Span
                            cn="
                                absolute top-2 right-2
                                w-3 h-3 bg-red-500 rounded-full
                                border-2 border-white
                            "
                        >{""}</Span>
                    )}
                </Button>
            </Div>

            {/* 📜 NOTIFICATION PANEL */}
            {open && (
                <Div
                    cn="
                        fixed bottom-24 right-6 z-50
                        w-80 max-h-[70vh]
                        bg-white rounded-2xl
                        border border-amber-200/40
                        shadow-xl overflow-hidden
                        animate-slide-up
                    "
                >
                    {/* HEADER */}
                    <Div cn="flex items-center justify-between p-4 border-b">
                        <Span cn="font-semibold text-amber-900">
                            Notifications
                        </Span>
                        <Button
                            onClick={() => setOpen(false)}
                            cn="text-amber-600 hover:text-red-500"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                    </Div>

                    {/* LIST */}
                    <Div cn="divide-y max-h-[60vh] overflow-y-auto">
                        {notifications.map((n) => (
                            <Div
                                key={n.id}
                                onClick={() => {
                                    setOpen(false);
                                    
                                    handleActiveTab(n.page);
                                }}
                                cn="
                                    p-4 cursor-pointer
                                    hover:bg-amber-100/40 transition
                                    flex gap-3
                                "
                            >
                                {/* UNREAD DOT */}
                                <Div cn="mt-1">
                                    {n.unread && (
                                        <FontAwesomeIcon
                                            icon={faCircle}
                                            className="text-xs text-red-500"
                                        />
                                    )}
                                </Div>

                                {/* CONTENT */}
                                <Div cn="flex-1">
                                    <Span cn="font-medium text-amber-900 block">
                                        {n.title}
                                    </Span>
                                    <Span cn="text-sm text-amber-700">
                                        {n.description}
                                    </Span>
                                    <Span cn="text-xs text-amber-500 mt-1 block">
                                        {n.date}
                                    </Span>
                                </Div>
                            </Div>
                        ))}
                    </Div>
                </Div>
            )}
        </>
    );
}
