import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export type LostFoundItem = {
  itemId: string;
  itemName: string;
  itemDescription: string;
  delivered: boolean;
  date: string;
  assignedTo: string;
  imageUrl: string;
};

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);

  // ✅ items
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState("");

  // ✅ claim
  const [claimingItemId, setClaimingItemId] = useState<string>("");
  const [claimError, setClaimError] = useState<string>("");
  const [claimSuccess, setClaimSuccess] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ✅ Fetch all not-delivered items
  async function fetchItems() {
    try {
      setItemsLoading(true);
      setItemsError("");

      const res = await fetch("http://localhost:8080/lostfound/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));

      console.log(data);
      if (!res.ok) {
        setItems([]);
        setItemsError((data as any)?.error ?? "Failed to fetch items");
        return;
      }

      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
      setItemsError("Network error while fetching items");
    } finally {
      setItemsLoading(false);
    }
  }


  async function claimItem(itemId: string, note?: string) {
  if (!token) throw new Error("NO_TOKEN");

  try {
    setClaimingItemId(itemId);
    setClaimError("");
    setClaimSuccess("");

    const res = await fetch(`http://localhost:8080/lostfound/items/${itemId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note: (note ?? "").trim() }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setClaimError(data?.error ?? "Claim failed");
      throw new Error(data?.error ?? "CLAIM_FAILED");
    }

    // ✅ remove item from UI after successful claim
    setItems((prev) => prev.filter((it) => it.itemId !== itemId));

    setClaimSuccess("Claim submitted successfully");
    return data;
  } finally {
    setClaimingItemId("");
  }
}

  return {
    // items
    items,
    itemsLoading,
    itemsError,
    fetchItems,

    // claim
    claimItem,
    claimingItemId,
    claimError,
    claimSuccess,
  };
}
