import { useState, useEffect } from "react";
import type { user } from "../Register_Users/Functionality";
export interface recordType{
    id : string,
    name : string,
    description : string,
    assignedTo : string,
    date : string
}

export default function useFuncs(){
    const [itemName, setItemName] = useState<string>("");
    const [itemDescription, setItemDescription] = useState<string>("");
    const [assignedTo, setAssignedTo] = useState<string>("");
    const [teachers, setTeachers] = useState<user[]>([]);

    const [records, setRecords] = useState<recordType[]>([
        {
            id : "1234",
            name : "botrkj",
            description : "jfbf",
            assignedTo : "hjdfm",
            date : "jfjkf"
        }
    ]);

    useEffect(()=>{
        fetchTeachers();
        fetchLostItems();
    },[]);

    async function fetchTeachers(){
        try{
            const res = await fetch("http://localhost:8080/teacherNames");
            const data = await res.json();
            const teachs = data.map((d : {id : string, name : string, role : number}) => {
                    if(d.role === 0)return d.name;
                })
                console.log("Teachs", teachs);
            setTeachers(data);
            console.log(data);
        }
        catch{
            console.log("Error occured while fetching teachers");
        }
    }

    const handleAddItem = () => {
        if (!itemName || !assignedTo) return;
        const newEntry = {
            id: "",
            name: itemName,
            description: itemDescription,
            assignedTo,
            date: new Date().toISOString().split("T")[0],
        };
        console.log(newEntry);
        postLostItem(newEntry);
        handleItemName("");
        handleItemDescription("");
        handleAssignedTo("");
    };

    async function fetchLostItems(){
        try{
            const res = await fetch("http://localhost:8080/lostfound/get");
            const data = await res.json();
            setRecords(data.items.filter( (d : {delivered : boolean}) => d.delivered === false).map(( d : { name : string}) => d));
            console.log(data);
        }
        catch{
            console.log("Error while fetching records");
        }
    }
    async function postLostItem(item : recordType){
        try{
            const res = await fetch("http://localhost:8080/lostfound/add", {
                headers : {
                    "Content-Type" : "application/json"
                },
                method : "POST",
                body : JSON.stringify(item)
            });
            
            if(res.ok){
                const data = await res.json();
                console.log(data);
            }
        }
        catch{
            console.log("Error While getting Id Of New object");
        }
    }
    function handleItemName(val : string){
        setItemName(val);
    }

    function handleItemDescription(val : string){
        setItemDescription(val);
    }

    function handleAssignedTo(val : string){
        setAssignedTo(val);
    }

    function handleRecords(val : recordType){
        setRecords(prev => [...prev, val]);
    }
    
    return {teachers, records, itemName, itemDescription, assignedTo, handleAddItem, handleAssignedTo, handleItemDescription, handleItemName, handleRecords};
}