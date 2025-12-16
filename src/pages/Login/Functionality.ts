import { useRef, useState } from "react";
import { loginSuccess } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
type Role = "student" | "admin" | "teacher" | "";
export default function useFuncs(){
    const idRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const passRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef(null); // Ref for 
    const [role, setRole] =  useState<Role | "">("");
    const [passType, setPassType] = useState<"text" | "password">("password");
    const [emptyfield, setEmptyField] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    function handleLogin(){
        console.log(passRef.current?.value);
        loginUser();
    }

    async function loginUser() {
        try {
            const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eduId: idRef.current?.value,
                eduPassword: passRef.current?.value,
                role: role,
            }),
            });

            if (!res.ok) {
            throw new Error("Login failed");
            }

            const data = await res.json();

            loginSuccess({
            id: idRef.current!.value,
            role: role,
            token: data.token,
            });

            if(role === "admin"){
                navigate("/edu-admin");
            }
            else if(role === "teacher"){
                navigate("/edu-teach");
            }
            else if(role === "student"){
                navigate("/edu-stud");
            }
        } catch (error) {
            console.error("Error while logging in:", error);
        }
        }

    function handleRole( e : React.ChangeEvent<HTMLInputElement>){
        setRole(e.target.value as Role);
    }

    function handlePassType(){
        setPassType(prev => prev==="password" ? "text" : "password");
    }

    function handleEmptyField(val : boolean){
        setEmptyField(val);
    }

    function handleError(val : string){
        setError(val);
    }

    
    return {idRef, timerRef, passRef, role, handleRole, setRole, passType, handlePassType, emptyfield, handleEmptyField, handleLogin};
}