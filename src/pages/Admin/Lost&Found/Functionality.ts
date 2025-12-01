import { useState } from "react";

export interface recordType{
    id : number,
    name : string,
    description : string,
    assignedTo : string,
    date : string
}
export default function useFuncs(){
    const [itemName, setItemName] = useState<string>("");
    const [itemDescription, setItemDescription] = useState<string>("");
    const [assignedTo, setAssignedTo] = useState<string>("");

    const teachers = ["Mr. Verma", "Ms. Kapoor", "Admin"]; // dummy supervisors


    const [records, setRecords] = useState<recordType[]>([
    {
    id: 1,
    name: "Blue Water Bottle",
    description: "Found near playground",
    assignedTo: "Admin",
    date: "2025-01-21",
    }
    ]);


    const handleAddItem = () => {
        if (!itemName || !assignedTo) return;


        const newEntry = {
            id: Date.now(),
            name: itemName,
            description: itemDescription,
            assignedTo,
            date: new Date().toISOString().split("T")[0],
        };

        postLostItem(newEntry);
        setRecords(prev => [newEntry, ...prev]);

        handleItemName("");
        handleItemDescription("");
        handleAssignedTo("");
    };

    async function postLostItem(item : recordType){
        const res = fetch("localhost:8080/lost_found", {
            headers : {
                "Content-Type" : "text/html"
            },
            method : "POST",
            body : JSON.stringify(item)
        })
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