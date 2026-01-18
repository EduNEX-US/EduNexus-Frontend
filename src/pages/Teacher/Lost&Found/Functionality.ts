import { useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export interface recordType {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  date: string;
  imageUrl?: string; // ✅ NEW
}


export default function useFuncs() {
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = useAppSelector((state) => state.auth.token);
  const [records, setRecords] = useState<recordType[]>([]);

  const assignedTo = useAppSelector(state => state.auth.id);
  useEffect(() => {
    fetchLostItems();

  }, []);

            console.log(records);

  const handleSaveItem = async () => {
  if (!itemName || !assignedTo) return;

  const date = new Date().toISOString().split("T")[0];

  if (editingId) {
    await updateLostItemMultipart(editingId, {
      name: itemName,
      description: itemDescription,
      assignedTo,
      date,
      imageFile,
    }).then(()=>handleRemoval());
  } else {
    await postLostItemMultipart({
      name: itemName,
      description: itemDescription,
      assignedTo,
      date,
      imageFile,
    }).then(()=> handleRemoval());
  }

  cancelEdit();
  fetchLostItems();
};

function handleRemoval(){
    handleItemDescription("");
    handleItemName("");
    handleImageFile(null);
}
async function updateLostItemMultipart(
  itemId: string,
  payload: {
    name: string;
    description: string;
    assignedTo: string;
    date: string;
    imageFile: File | null;
  }
) {
  try {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("description", payload.description);
    fd.append("assignedTo", payload.assignedTo);
    fd.append("date", payload.date);
    if (payload.imageFile) fd.append("image", payload.imageFile);

    const res = await fetch(`http://localhost:8080/lostfound/update/${itemId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      const err = await res.text();
      console.log("Update failed:", err);
    }
  } catch {
    console.log("Error while updating item");
  }
}


  async function fetchLostItems() {
    try {
      const res = await fetch("http://localhost:8080/lostfound/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setRecords(
        (data.items ?? [])
          .filter((d: any) => d.delivered === false && d.assignedTo === assignedTo)
          .map((d: any): recordType => ({
            id: String(d.itemId ?? d.id ?? ""),
            name: d.name ?? d.itemName ?? "",
            description: d.itemDescription ?? "",
            assignedTo: d.assignedTo ?? "",
            date: d.date ?? "",
            imageUrl: d.imageUrl ?? "", // ✅ NEW
          }))
      );
      console.log(data);

    } catch {
      console.log("Error while fetching records");
    }
  }

  // ✅ NEW: multipart post (text + file)
    async function postLostItemMultipart(payload: {
    name: string;
    description: string;
    assignedTo: string;
    date: string;
    imageFile: File | null;
    }) {
        try {
            const fd = new FormData();
            fd.append("name", payload.name);
            fd.append("description", payload.description);
            fd.append("assignedTo", payload.assignedTo);
            fd.append("date", payload.date);

            if (payload.imageFile) {
            fd.append("image", payload.imageFile); // key must match backend param name
            }

            const res = await fetch("http://localhost:8080/lostfound/add", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // ❌ DO NOT set Content-Type manually for FormData
            },
            body: fd,
            });

            if (res.ok) {
            const data = await res.json();
            console.log("Added:", data);
            } else {
            const err = await res.text();
            console.log("Add failed:", err);
            }
        } catch {
            console.log("Error While adding lost item with image");
        }
    }

    async function deleteLostItem(itemId: string) {
        try {
            const res = await fetch(`http://localhost:8080/lostfound/delete/${itemId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if (res.ok) {
            // remove locally for instant UI update
            setRecords((prev) => prev.filter((r) => r.id !== itemId));
            } else {
            const err = await res.text();
            console.log("Delete failed:", err);
            }
        } catch {
            console.log("Error while deleting item");
        }
    }

    function handleDeleteItem(itemId: string) {
        deleteLostItem(itemId);
    }

    function handleItemName(val: string) {
        setItemName(val);
    }
    function handleItemDescription(val: string) {
        setItemDescription(val);
    }

    function handleImageFile(file: File | null) {
        setImageFile(file);
    }

    function startEdit(record: recordType) {
        setEditingId(record.id);
        setItemName(record.name);
        setItemDescription(record.description ?? "");
        setImageFile(null); // new image optional
    }

    function cancelEdit() {
        setEditingId(null);
        setItemName("");
        setItemDescription("");
        setImageFile(null);
    }


    return {
  records,
  itemName,
  itemDescription,
  assignedTo,
  imageFile,
  editingId,        
  handleSaveItem,
  startEdit,        
  cancelEdit,       
  handleItemDescription,
  handleItemName,
  handleImageFile,
  handleDeleteItem,
};

}
