// --- TYPES ---
export type TreatmentLog = {
    id: string;
    date: string;
    treatment: string;
    outcome: string;
    cost: number;
    paid: boolean;
    weight?: number; // For nutrition
    status?: string; // For physical therapy
};

export type Patient = {
    id: string;
    createdAt: string;
    name: string;
    complaint: string;
    dob: string;
    gender: 'male' | 'female';
    phone: string;
    email: string;
    address: string;
    height: number;
    weight: number;
    medicalHistory: string;
    notes: string;
    // FIX: Added 'general' to primaryCare to align with Doctor specialty and sample data.
    primaryCare: 'nutrition' | 'physical_therapy' | 'general';
    treatmentHistory: TreatmentLog[];
};

export type Doctor = {
    id: string;
    name: string;
    specialty: 'physical_therapy' | 'nutrition' | 'general';
    phone: string;
    email: string;
    color: string;
};

export type Appointment = {
    id: string;
    patientId: string;
    doctorId: string;
    date: string; // ISO string for date and time
    reason: string;
    status: 'scheduled' | 'completed' | 'canceled';
    reminderSent?: boolean;
};