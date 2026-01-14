import type { active } from "../Admin_view/Functionality";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useNavigate } from "react-router";
import { logout } from "../../../features/auth/authSlice";
export interface HandleTab{
    handleFunc? : (val : active) => void,
    activeTab? : active,
    handleBarsVisibility? : ()=> void,
    barsVisibility? : boolean
}

export function useFuncs(){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    function handleLogout(){
        dispatch(logout());
        navigate("/");
        console.log("Delete");
    }

    return { handleLogout };
}