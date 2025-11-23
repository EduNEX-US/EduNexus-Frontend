import { useState } from "react";

export interface MarkEntry {
  subject: string;
  score: number;
  total: number;
  grade: string;
}
export const allMarks  = {
  'Unit Test 1': [
    { subject: 'Mathematics', score: 45, total: 50, grade: 'A' },
    { subject: 'Physics', score: 42, total: 50, grade: 'A' },
    { subject: 'Chemistry', score: 38, total: 50, grade: 'B+' },
    { subject: 'English', score: 44, total: 50, grade: 'A' },
    { subject: 'Hindi', score: 40, total: 50, grade: 'A-' },
    { subject: 'Computer Science', score: 48, total: 50, grade: 'A+' }
  ],
  'Mid Term': [
    { subject: 'Mathematics', score: 87, total: 100, grade: 'A' },
    { subject: 'Physics', score: 78, total: 100, grade: 'B+' },
    { subject: 'Chemistry', score: 82, total: 100, grade: 'A-' },
    { subject: 'English', score: 91, total: 100, grade: 'A+' },
    { subject: 'Hindi', score: 75, total: 100, grade: 'B+' },
    { subject: 'Computer Science', score: 95, total: 100, grade: 'A+' }
  ],
  'Unit Test 2': [
    { subject: 'Mathematics', score: 43, total: 50, grade: 'A' },
    { subject: 'Physics', score: 36, total: 50, grade: 'B+' },
    { subject: 'Chemistry', score: 41, total: 50, grade: 'A' },
    { subject: 'English', score: 46, total: 50, grade: 'A+' },
    { subject: 'Hindi', score: 38, total: 50, grade: 'B+' },
    { subject: 'Computer Science', score: 47, total: 50, grade: 'A+' }
  ]
} as const;

export default function useFuncs(){
    const [selectedExam, setSelectedExam] = useState<ExamName>("Unit Test 1");
    function handleSelectedExam(val : ExamName){
        setSelectedExam(val);
    }
    const calculatePercentage = (score : number, total : number) => ((score / total) * 100).toFixed(1);
    const getGradeColor = (grade : string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
};
    return {selectedExam, handleSelectedExam, calculatePercentage, getGradeColor};
}

export interface ChartDataItem {
  name: string;
  score: number;
  fullName: string;
}

export type ExamName = keyof typeof allMarks;

export type AllMarks = typeof allMarks;
