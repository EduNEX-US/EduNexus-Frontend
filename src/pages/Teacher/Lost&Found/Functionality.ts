import { useState } from "react";

export type records = { id : number, name : string, description : string, assignedTo : string, date : string}
export default function useFuncs(){
    const loggedInTeacher = "Ms. Kapoor";

    const [itemName, setItemName] = useState<string>("");
    const [itemDescription, setItemDescription] = useState<string>("");

    const [records, setRecords] = useState<records[]>([
        {
        id: 1,
        name: "Blue Water Bottle",
        description: "Found near playground",
        assignedTo: "Ms. Kapoor",
        date: "2025-01-21",
        },
    ]);

    const handleAddItem = () => {
        if (!itemName) return;

        const newEntry = {
            id: Date.now(),
            name: itemName,
            description: itemDescription,
            assignedTo: loggedInTeacher, // ONLY assigned teacher is stored
            date: new Date().toISOString().split("T")[0],
        };

        setRecords((prev) => [newEntry, ...prev]);

        handleItemName("");
        handleItemDescription("");
    };

  function handleItemName(val : string){
    setItemName(val);
  }

  function handleItemDescription(val : string){
    setItemDescription(val);
  }

  return {loggedInTeacher, itemName, itemDescription, records, handleAddItem, handleItemName, handleItemDescription};
}