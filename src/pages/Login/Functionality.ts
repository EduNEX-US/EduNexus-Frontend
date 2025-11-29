import { useRef, useState } from "react";
type Role = "student" | "admin" | "teacher";
export default function useFuncs(){
    const idRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef(null); // Ref for 
    const [role, setRole] =  useState<Role | "">("");
    const [passType, setPassType] = useState<"text" | "password">("password");
    const [emptyfield, setEmptyField] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    function handleLogin(){
        console.log(passRef.current?.value);
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