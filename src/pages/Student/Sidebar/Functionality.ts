import type { active } from "../Studen_View/Functionality"
import { useNavigate } from "react-router"
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../../features/auth/authSlice";

export interface HandleTab{
    handleFunc : (val : active) => void,
    activeTab? : active,
    handleBarsVisibility? : ()=> void,
    barsVisibility? : boolean
}

export default function useFuncs(){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    function handleLogout(){
        dispatch(logout());
        navigate("/");
        console.log("Delete");
    }

    return { handleLogout };
}
