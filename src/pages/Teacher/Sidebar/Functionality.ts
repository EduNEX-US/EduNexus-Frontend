import { useNavigate } from "react-router";
import { logout } from "../../../features/auth/authSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import type { active } from "../Teacher_View/Functionality"
export interface HandleTab{
    handleFunc : (val : active) => void,
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