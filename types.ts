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
<<<<<<< HEAD
=======
    satisfactionRating?: number; // New: 1-5 rating for patient satisfaction
    feedback?: string; // New: Patient feedback
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
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
<<<<<<< HEAD
};
=======
};

// --- Report Types ---
export type ReportType = 'none' | 'demographics' | 'appointments' | 'financial' | 'satisfaction' | 'patient-summary' | 'doctor-summary'; // New: Added 'doctor-summary'

export interface DemographicsReport {
    totalPatients: number;
    malePatients: number;
    femalePatients: number;
    // Updated age distribution to be more detailed
    ageDistribution: { label: string; count: number }[]; 
    patientsBySpecialty: { specialty: string; count: number }[];
    bmiDistribution: { label: string; count: number }[]; // New: BMI distribution
    patientGrowthByMonth: { month: string; count: number }[]; // New: Patient growth over time
}

export interface AppointmentReport {
    totalAppointments: number;
    scheduled: number;
    completed: number;
    canceled: number;
    appointmentsByDoctor: { doctorName: string; count: number; color: string }[];
    appointmentsByPatient: { patientName: string; count: number }[];
    appointmentsByMonth: { month: string; count: number }[]; // New: Appointments over time
    appointmentsBySpecialty: { specialty: string; count: number; color: string }[]; // New: Appointments by doctor specialty
}

export interface FinancialReport {
    totalBilled: number;
    totalPaid: number;
    totalOutstanding: number;
    revenueBySpecialty: { specialty: string; revenue: number }[];
    monthlyRevenue: { month: string; revenue: number }[]; // New: Monthly revenue trend
    averageTreatmentCost: number; // New: Average cost per log
    collectionRate: number; // New: Collection rate percentage
}

export interface PatientSatisfactionReport { // New: Patient Satisfaction Report Interface
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
    feedbackHighlights: { patientName: string; feedback: string; rating: number; date: string }[];
    satisfactionBySpecialty: { specialty: string; averageRating: number; count: number }[];
    satisfactionByDoctor: { doctorName: string; averageRating: number; count: number; color: string }[];
}

export interface PatientSummaryReport { // New: Patient Summary Report Interface
    patient: Patient;
    totalAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    totalBilled: number;
    totalPaid: number;
    totalOutstanding: number;
    averageSatisfactionRating: number | null;
    appointmentsDetails: { date: string; doctorName: string; reason: string; status: Appointment['status']; doctorColor: string }[];
    treatmentLogsDetails: TreatmentLog[];
}

export interface DoctorSummaryReport { // New: Doctor Summary Report Interface
    doctor: Doctor;
    totalAppointments: number;
    scheduledAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    averageSatisfactionRating: number | null;
    recentAppointments: { date: string; patientName: string; reason: string; status: Appointment['status']; patientId: string }[];
    treatedPatients: { id: string; name: string; count: number }[]; // Unique patients treated by this doctor
}

export type GeneratedReport = {
    type: ReportType;
    data: DemographicsReport | AppointmentReport | FinancialReport | PatientSatisfactionReport | PatientSummaryReport | DoctorSummaryReport | null; // Updated: Added DoctorSummaryReport
} | null;
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
