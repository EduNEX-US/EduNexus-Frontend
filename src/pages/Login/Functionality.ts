import { useRef, useState } from "react";
import g1 from '../../assets/G-1.jpg';
import g2 from '../../assets/G-2.jpg';
import g3 from '../../assets/G-3.jpg';
type Role = "student" | "admin" | "teacher";
export default function useFuncs(){
    const idRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef(null); // Ref for 
    const [role, setRole] =  useState<Role | "">("");
    const [passType, setPassType] = useState<"text" | "password">("password");
    const [emptyfield, setEmptyField] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const images = [g1, g2, g3]; // Array of Images
    const [pointer, setPointer] = useState<number>(0); // Pointer for selecting the image

    // Handling The Pointer for Image representation Via Carousel
    function handlePointer(){
        setPointer(prev => (prev+1)%images.length);
    }

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
    return {idRef, timerRef, passRef, role, handleRole, setRole, passType, handlePassType, emptyfield, handleEmptyField, images, pointer, handlePointer, handleLogin};
}