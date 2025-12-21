import {useState, useReducer, act} from 'react';

export interface Marks {
    id: string;
    english: number | null;
    hindi: number | null;
    math: number | null;
    science: number | null;
    socialScience: number | null;
    computer: number | null;
    generalKnowledge: number | null;
    resultDate: Date | null;
}

type Action =
  | { type: 'id'; payload: string }
  | { type: 'eng' | 'hin' | 'math' | 'sci' | 'ss' | 'comp' | 'gk'; payload: number | null }
  | { type: 'rd'; payload: Date | null };

function reducer(state: Marks, action: Action): Marks {
  switch (action.type) {
    case 'id':
      return { ...state, id: action.payload };
    case 'eng':
      return { ...state, english: action.payload };
    case 'hin':
      return { ...state, hindi: action.payload };
    case 'math':
      return { ...state, math: action.payload };
    case 'sci':
      return { ...state, science: action.payload };
    case 'ss':
      return { ...state, socialScience: action.payload };
    case 'comp':
      return { ...state, computer: action.payload };
    case 'gk':
      return { ...state, generalKnowledge: action.payload };
    case 'rd':
      return { ...state, resultDate: action.payload };
    default:
      return state;
  }
}
const initialState: Marks = {
  id: '',
  english: null,
  hindi: null,
  math: null,
  science: null,
  socialScience: null,
  computer: null,
  generalKnowledge: null,
  resultDate: new Date(2024, 11, 23), // December 23, 2024
};
export default function useFuncs(){
    const [markForm, setMarkForm] = useState<boolean>(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [primary, setPrimary] = useState<boolean>(false);
      const [uploadType, setUploadType] = useState<"manual" | "csv">("manual");
      const [csvFile, setCsvFile] = useState<File | null>(null);
    function handleMarkForm(val : boolean){
        setMarkForm(val);
    };
    const dummyData = [
      {
    "studentId": "S-2025-034",
    "name": "Aman Kaushik",
    "class": "10-B",
    "marks": {
      "English": 88,
      "Hindi": 92,
      "Math": 85,
      "Science": 90,
      "Social Science": 87,
      "General Knowledge": 95,
      "Computer": 93
    }
  },
  {
    "studentId": "S-2025-041",
    "name": "Priya Sharma",
    "class": "10-B",
    "marks": {
      "English": 91,
      "Hindi": 89,
      "Math": 94,
      "Science": 92,
      "Social Science": 88,
      "General Knowledge": 93,
      "Computer": 97
    }
  },
  {
    "studentId": "S-2025-052",
    "name": "Rohan Malik",
    "class": "10-B",
    "marks": {
      "English": 76,
      "Hindi": 81,
      "Math": 72,
      "Science": 78,
      "Social Science": 80,
      "General Knowledge": 85,
      "Computer": 88
    }
  }
]

const [search , setSearch] = useState<string>("");
  const handleSearch = (val : string)=>{
    setSearch(val);
  }

  const filteredStudents = dummyData.filter(d => {
    d.name.toLowerCase().includes(search.toLowerCase());
  })

  const uploadCsv = async () => {
  if (!csvFile) return;

  const formData = new FormData();
  formData.append("file", csvFile); // 🔥 key MUST be "file"

  try {
    const response = await fetch("http://localhost:8080/api/marks/upload", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    alert(text); // "Upload Complete. Success: X, Failed: Y"
    handleMarkForm(false);
    setCsvFile(null);
  } catch (err: any) {
    alert("Upload failed: " + err.message);
  }
};

    return {markForm, handleMarkForm, state, dispatch, primary, setPrimary, handleSearch, dummyData, filteredStudents, uploadCsv, uploadType, setUploadType, setCsvFile, csvFile};
}