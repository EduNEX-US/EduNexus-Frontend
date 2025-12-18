import { useEffect, useReducer, useState } from "react"

interface StudentForm{
    sName : string;
    pass : string;
    email : string;
    sMob : number;
    address : string;
    altMob : number;
    guardian : string;
    sClass : number;
    basicFee : number;
}

interface TeacherForm{
    tName : string;
    pass : string;
    email : string;
    tMob : number;
    exp : number;
    address : string;
    tClass : string;
    qualification : string;
    secretKey : string
}

type StudentAction =
| { type: "sName"; payload: string }
| { type: "pass"; payload: string }
| { type: "email"; payload: string }
| { type: "sMob"; payload: number }
| { type: "sAddress"; payload: string }
| { type: "altMob"; payload: number }
| { type: "guardian"; payload: string }
| { type: "sClass"; payload: number }
| { type: "basicFee"; payload: number }
| { type: "reset"};

type TeacherAction =
| { type: "tName", payload: string }
| { type: "pass", payload: string }
| { type: "email", payload: string }
| { type: "tMob", payload: number }
| { type: "exp", payload: number }
| { type: "tAddress", payload: string }
| { type: "tClass", payload: string }
| { type: "qualification", payload: string }
| { type: "secretKey", payload: string}
| { type: "reset"};

function reducer(state : StudentForm, action : StudentAction) : StudentForm{
    switch(action.type){
        case "sName":
            return {...state, sName : action.payload};
        case "pass":
            return {...state, pass : action.payload};
        case "email":
            return {...state, email : action.payload};
        case "sMob":
            return {...state, sMob : isNaN(action.payload) ? 0 : action.payload};
        case "sAddress":
            return {...state, address : action.payload};
        case "altMob":
            return {...state, altMob : isNaN(action.payload) ? 0 : action.payload};
        case "guardian":
            return {...state, guardian : action.payload};
        case "sClass":
            return {...state, sClass : isNaN(action.payload) ? 0 : action.payload};
        case "basicFee":
            return {...state, basicFee : isNaN(action.payload) ? 0 : action.payload};
        case "reset":
            return initialStudents;
        default :
            return state;
    }
}

function tReducer(state : TeacherForm, action : TeacherAction) : TeacherForm {
    switch(action.type){
        case "tName":
            return {...state, tName : action.payload};
        case "pass":
            return {...state, pass : action.payload};
        case "email":
            return {...state, email : action.payload};
        case "tMob":
            return {...state, tMob : isNaN(action.payload) ? 0 : action.payload};
        case "tAddress":
            return {...state, address : action.payload};
        case "exp":
            return {...state, exp : isNaN(action.payload) ? 0 : action.payload};
        case "qualification":
            return {...state, qualification : action.payload};
        case "tClass":
            return {...state, tClass : action.payload};
        case "secretKey":
            return {...state, secretKey : action.payload};
        case "reset":
            return initialTeachers;
        default:
            return state;
    }
}

const initialStudents : StudentForm = {
    sName : "",
    pass : "",
    email : "",
    sMob : 0,
    address : "",
    altMob : 0,
    guardian : "",
    sClass : 0,
    basicFee : 0
};

const initialTeachers: TeacherForm = {
  tName: "",
  pass: "",
  email: "",
  tMob: 0,
  exp: 0,
  address: "",
  tClass: "",
  qualification: "",
  secretKey : ""
};

export type RoleType = "teacher" | "admin";
export type user = { id : string, name : string};
export interface users{
    teacher : user[],
    admin : user[]
}

const initialUsers : users = {
    teacher : [],
    admin : []
}
export default function useFuncs(){
    const [studentForm, sDispatch] = useReducer(reducer, initialStudents);
    const [role, setRole] = useState<RoleType>("teacher");
    const [search, setSearch] = useState<string>("");
    const [teacherForm, tDispatch] = useReducer(tReducer, initialTeachers);
    const [users, setUsers] = useState<users>(initialUsers);

    useEffect(()=>{
        fetchTeachers();
    },[])

    async function fetchTeachers(){
        try{
            const res = await fetch("http://localhost:8080/teacherNames");
            const data = await res.json();
            const teachs = data.map((d : {id : string, name : string, role : number}) => {
                    if(d.role === 0)return d.name;
                })
                console.log("Teachs", teachs);
            setUsers(prev => ({
                teacher: data.filter((d : {role : number}) => d.role === 0).map((d : {id : string, name : string})=> ({ id: d.id, name: d.name })),
                admin: data.filter((d : {role : number}) => d.role === 1).map((d : {id : string, name : string})=> ({ id: d.id, name: d.name }))
            }));
            console.log(data);
        }
        catch{
            console.log("Error occured while fetching teachers");
        }
    }

    function handleRole(val : RoleType){
        setRole(val);
    }

    function handleSearch(val : string){
        setSearch(val);
    }

    async function handleUserCreation(){
        let payload;

        if(role === "teacher"){
            payload = { role : "teacher", ...teacherForm};
            tDispatch({ type : "reset"});
        }
        else{
            payload = { role : "admin", ...teacherForm};
            tDispatch({ type : "reset"});
        }

        try {
            const res = await fetch(`http://localhost:8080/admin/${role}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if(res.ok){
                fetchTeachers();
            }
            const data = await res.json();
            console.log("User Created:", data);
            return data;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
        }
    }
    return {users, sDispatch, studentForm, tDispatch, teacherForm, search, handleSearch, role, handleRole, handleUserCreation};
}