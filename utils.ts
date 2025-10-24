import { Doctor } from './types';

export const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    // FIX: Handle cases where the date string might be invalid, resulting in an "Invalid Date"
    if (isNaN(birthDate.getTime())) return null; 
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getSpecialtyName = (specialty: Doctor['specialty']) => {
    const map = {
        physical_therapy: 'علاج طبيعي',
        nutrition: 'تغذية',
        general: 'عام'
    };
    return map[specialty];
};

export const DOCTOR_COLORS = [
    '#3498db', '#e74c3c', '#9b59b6', '#2ecc71', '#f1c40f',
    '#1abc9c', '#e67e22', '#34495e', '#d35400', '#2980b9'
];

export const getNextColor = (existingDoctors: Doctor[]): string => {
    const colorCount = existingDoctors.length;
    return DOCTOR_COLORS[colorCount % DOCTOR_COLORS.length];
};