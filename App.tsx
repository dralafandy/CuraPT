import React, { useState, useEffect } from 'react';
import { Patient, Doctor, Appointment, TreatmentLog } from './types';
import { styles } from './styles';
import { DOCTOR_COLORS, getNextColor } from './utils'; // Import getNextColor for doctor colors

// Import Views
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { DoctorsView } from './views/DoctorsView';
import { AppointmentsView } from './views/AppointmentsView';

// Import Forms/Modals
import { PatientForm } from './components/PatientForm';
import { TreatmentLogForm } from './components/TreatmentLogForm';
import { DoctorForm } from './components/DoctorForm';
import { AppointmentForm } from './components/AppointmentForm';
import { DoctorScheduleModal } from './components/DoctorScheduleModal';
import { DashboardIcon, PatientsIcon, DoctorsIcon, AppointmentsIcon, HamburgerIcon, CloseIcon } from './components/Icons'; // Add Hamburger and Close Icons

const generateSampleData = () => {
    const sampleDoctors: Doctor[] = [
        { id: 'doc-1', name: 'أحمد محمود', specialty: 'physical_therapy', phone: '01012345678', email: 'ahmed.m@clinic.com', color: DOCTOR_COLORS[0] },
        { id: 'doc-2', name: 'فاطمة الزهراء', specialty: 'nutrition', phone: '01187654321', email: 'fatima.z@clinic.com', color: DOCTOR_COLORS[1] },
        { id: 'doc-3', name: 'يوسف علي', specialty: 'general', phone: '01223344556', email: 'youssef.a@clinic.com', color: DOCTOR_COLORS[2] },
    ];

    const samplePatients: Patient[] = [
        {
            id: 'pat-1', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), name: 'خالد سعيد', complaint: 'ألم أسفل الظهر', dob: '1985-05-20', gender: 'male', phone: '01011112222', email: 'khaled@email.com', address: '123 شارع النيل, القاهرة', height: 180, weight: 85, medicalHistory: 'لا يوجد', notes: 'يعمل في مكتب لساعات طويلة', primaryCare: 'physical_therapy',
            treatmentHistory: [
                { id: 'log-1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], treatment: 'جلسة علاج طبيعي للظهر', outcome: 'تحسن طفيف', status: 'مستمر', cost: 350, paid: true },
                { id: 'log-2', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], treatment: 'جلسة علاج طبيعي للظهر - متابعة', outcome: 'تحسن كبير', status: 'مستمر', cost: 350, paid: false }
            ]
        },
        {
            id: 'pat-2', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), name: 'نورا حسن', complaint: 'استشارة لفقدان الوزن', dob: '1992-11-10', gender: 'female', phone: '01122223333', email: 'noura@email.com', address: '456 شارع الجمهورية, الجيزة', height: 165, weight: 78, medicalHistory: 'لا يوجد', notes: 'ترغب في نظام غذائي صحي', primaryCare: 'nutrition',
            treatmentHistory: [
                { id: 'log-3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], treatment: 'وضع خطة غذائية أولية', outcome: 'المريضة متحمسة للبدء', weight: 78, cost: 500, paid: true }
            ]
        },
        { id: 'pat-3', createdAt: new Date().toISOString(), name: 'عمر طارق', complaint: 'إصابة في الركبة', dob: '2001-03-15', gender: 'male', phone: '01233334444', email: 'omar@email.com', address: '789 شارع الحرية, الإسكندرية', height: 175, weight: 72, medicalHistory: 'إصابة رياضية سابقة', notes: '', primaryCare: 'physical_therapy', treatmentHistory: [] },
        { id: 'pat-4', createdAt: new Date().toISOString(), name: 'لينا عادل', complaint: 'متابعة نظام غذائي', dob: '1988-09-01', gender: 'female', phone: '01044445555', email: 'lina@email.com', address: '101 شارع الأهرام, الجيزة', height: 170, weight: 65, medicalHistory: 'لا يوجد', notes: 'تحتاج لتعديل الخطة الغذائية', primaryCare: 'nutrition', treatmentHistory: [] },
        { id: 'pat-5', createdAt: new Date().toISOString(), name: 'سمير جمال', complaint: 'فحص عام', dob: '1976-07-25', gender: 'male', phone: '01155556666', email: 'samir@email.com', address: '212 شارع فيصل, الجيزة', height: 182, weight: 90, medicalHistory: 'ارتفاع طفيف في ضغط الدم', notes: '', primaryCare: 'general', treatmentHistory: [] },
    ];
    
    const today = new Date();
    const getAppointmentDate = (dayOffset: number, hour: number, minute: number) => {
        const date = new Date();
        date.setDate(today.getDate() + dayOffset);
        date.setHours(hour, minute, 0, 0);
        return date.toISOString();
    }

    const sampleAppointments: Appointment[] = [
        // Today's appointments
        { id: 'app-1', patientId: 'pat-1', doctorId: 'doc-1', date: getAppointmentDate(0, 10, 0), reason: 'متابعة ألم الظهر', status: 'scheduled', reminderSent: true },
        { id: 'app-2', patientId: 'pat-2', doctorId: 'doc-2', date: getAppointmentDate(0, 12, 30), reason: 'مناقشة الخطة الغذائية', status: 'scheduled', reminderSent: false },
        // Future appointments
        { id: 'app-3', patientId: 'pat-3', doctorId: 'doc-1', date: getAppointmentDate(1, 11, 0), reason: 'فحص الركبة بعد الإصابة', status: 'scheduled', reminderSent: false },
        { id: 'app-4', patientId: 'pat-1', doctorId: 'doc-1', date: getAppointmentDate(7, 10, 0), reason: 'جلسة علاج طبيعي', status: 'scheduled', reminderSent: false },
        // Past appointments
        { id: 'app-5', patientId: 'pat-4', doctorId: 'doc-2', date: getAppointmentDate(-3, 14, 0), reason: 'متابعة النظام الغذائي', status: 'completed' },
        { id: 'app-6', patientId: 'pat-5', doctorId: 'doc-3', date: getAppointmentDate(-5, 16, 0), reason: 'فحص دوري', status: 'canceled' },
    ];
    
    return { sampleDoctors, samplePatients, sampleAppointments };
};


export const App = () => {
    // State
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeView, setActiveView] = useState<'dashboard' | 'patients' | 'doctors' | 'appointments'>('dashboard');
    const [reminderSettings, setReminderSettings] = useState({ leadTimeHours: 24 });
    
    // Modal State
    const [modal, setModal] = useState<'none' | 'patient' | 'log' | 'doctor' | 'appointment' | 'doctorSchedule'>('none');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // For treatment log
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null); // For editing patient
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null); // For editing doctor
    const [viewingDoctorSchedule, setViewingDoctorSchedule] = useState<Doctor | null>(null); // For doctor schedule modal

    // Responsive State
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobileView(mobile);
            if (!mobile) {
                setIsSidebarOpen(false); // Close sidebar when switching to desktop view
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load data from local storage
    useEffect(() => {
        const loadData = <T,>(key: string, defaultValue: T): T => {
            try {
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : defaultValue;
            } catch (error) {
                console.error(`Failed to load ${key} from local storage`, error);
                return defaultValue;
            }
        };

        let loadedPatients: Patient[] = loadData('clinicPatients', []);
        let loadedDoctors: Doctor[] = loadData('clinicDoctors', []);
        let loadedAppointments: Appointment[] = loadData('clinicAppointments', []);
        
        // If no data, generate sample data
        if (loadedPatients.length === 0 && loadedDoctors.length === 0) {
            const { sampleDoctors, samplePatients, sampleAppointments } = generateSampleData();
            loadedDoctors = sampleDoctors;
            loadedPatients = samplePatients;
            loadedAppointments = sampleAppointments;
        }


        // Simple migration: assign colors to doctors who don't have one
        const doctorsWithColors = loadedDoctors.map((doc, index) => ({
            ...doc,
            color: doc.color || DOCTOR_COLORS[index % DOCTOR_COLORS.length]
        }));
        
        // Simple migration: add financial fields to old treatment logs if they don't exist
        const patientsWithFinancials = loadedPatients.map(p => ({
            ...p,
            createdAt: p.createdAt || new Date().toISOString(),
            treatmentHistory: p.treatmentHistory.map((log, index) => ({
                ...log,
                id: log.id || `migrated-${p.id}-${index}`,
                cost: log.cost ?? 0,
                paid: log.paid ?? false,
            }))
        }));

        setPatients(patientsWithFinancials);
        setDoctors(doctorsWithColors);
        setAppointments(loadedAppointments);
        setReminderSettings(loadData('clinicReminderSettings', { leadTimeHours: 24 }));
    }, []);

    // Save data to local storage
    useEffect(() => {
        try {
            localStorage.setItem('clinicPatients', JSON.stringify(patients));
            localStorage.setItem('clinicDoctors', JSON.stringify(doctors));
            localStorage.setItem('clinicAppointments', JSON.stringify(appointments));
            localStorage.setItem('clinicReminderSettings', JSON.stringify(reminderSettings));
        } catch (error) {
            console.error("Failed to save data to local storage", error);
        }
    }, [patients, doctors, appointments, reminderSettings]);
    
    // Automated Reminder Check
    useEffect(() => {
        const checkAndSendReminders = () => {
            const now = new Date().getTime();
            const leadTimeMs = reminderSettings.leadTimeHours * 60 * 60 * 1000;
            let remindersSent = false;

            const updatedAppointments = appointments.map(app => {
                if (app.status === 'scheduled' && !app.reminderSent) {
                    const appTime = new Date(app.date).getTime();
                    // Check if the appointment is in the future but within the reminder window
                    if (appTime > now && (appTime - now) <= leadTimeMs) {
                        remindersSent = true;
                        console.log(`Simulating reminder for appointment ID: ${app.id} for patient ${patients.find(p => p.id === app.patientId)?.name}`);
                        // In a real app, you'd send an actual notification here (e.g., SMS, email)
                        return { ...app, reminderSent: true };
                    }
                }
                return app;
            });

            if (remindersSent) {
                setAppointments(updatedAppointments);
            }
        };

        // Run on load and then set an interval to check periodically
        checkAndSendReminders();
        const intervalId = setInterval(checkAndSendReminders, 60000); // Check every minute (60,000 ms)

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [appointments, reminderSettings, patients]); // Added patients to dependency array to get patient name for console log

    // --- Patient Handlers ---
    const handleAddPatient = (newPatientData: Omit<Patient, 'id' | 'treatmentHistory' | 'createdAt'>) => {
        const newPatient: Patient = {
            ...newPatientData,
            id: `pat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            createdAt: new Date().toISOString(),
            treatmentHistory: [],
        };
        setPatients(prev => [...prev, newPatient]);
        setModal('none');
    };

    const handleUpdatePatient = (updatedPatientData: Patient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatientData.id ? updatedPatientData : p));
        setModal('none');
        setEditingPatient(null);
    };

    const handleDeletePatient = (patientId: string) => {
        if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المريض وجميع مواعيده؟')) {
            setPatients(prev => prev.filter(p => p.id !== patientId));
            setAppointments(prev => prev.filter(app => app.patientId !== patientId));
        }
    };

    const handleAddTreatmentLog = (patientId: string, log: Omit<TreatmentLog, 'id'>) => {
        const newLog: TreatmentLog = {
            ...log,
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        };
        setPatients(prev => prev.map(p => 
            p.id === patientId 
                ? { ...p, treatmentHistory: [...p.treatmentHistory, newLog] } 
                : p
        ));
        setModal('none');
        setSelectedPatient(null); // Clear selected patient after adding log
    };
    
    const handleUpdateLogPayment = (patientId: string, logId: string, paid: boolean) => {
        setPatients(prev => prev.map(p => {
            if (p.id === patientId) {
                const updatedHistory = p.treatmentHistory.map(log => 
                    log.id === logId ? { ...log, paid } : log
                );
                return { ...p, treatmentHistory: updatedHistory };
            }
            return p;
        }));
    };

    // --- Doctor Handlers ---
    const handleAddDoctor = (newDoctorData: Omit<Doctor, 'id'>) => {
        const newDoctor: Doctor = {
            ...newDoctorData,
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            color: getNextColor(doctors), // Assign next available color
        };
        setDoctors(prev => [...prev, newDoctor]);
        setModal('none');
    };

    const handleUpdateDoctor = (updatedDoctorData: Doctor) => {
        setDoctors(prev => prev.map(d => d.id === updatedDoctorData.id ? updatedDoctorData : d));
        setModal('none');
        setEditingDoctor(null);
    };

    const handleDeleteDoctor = (doctorId: string) => {
        if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الطبيب وجميع مواعيده؟')) {
            setDoctors(prev => prev.filter(d => d.id !== doctorId));
            setAppointments(prev => prev.filter(app => app.doctorId !== doctorId));
        }
    };

    // --- Appointment Handlers ---
    const handleAddAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status' | 'reminderSent'>) => {
        const newAppointment: Appointment = {
            ...newAppointmentData,
            id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            status: 'scheduled',
            reminderSent: false, // Always false for new appointments
        };
        setAppointments(prev => [...prev, newAppointment]);
        setModal('none');
    };

    const handleUpdateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
        setAppointments(prev => prev.map(app => 
            app.id === appointmentId ? { ...app, status: status } : app
        ));
    };

    // --- Data Management Handlers ---
    const handleBackup = () => {
        const data = {
            patients,
            doctors,
            appointments,
            reminderSettings,
            version: 2 // Updated version for financial data
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clinic_data_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('تم تصدير البيانات بنجاح!');
    };

    const handleRestore = (jsonString: string) => {
        try {
            const restoredData = JSON.parse(jsonString);
            if (restoredData.patients && restoredData.doctors && restoredData.appointments && restoredData.reminderSettings) {
                // Basic validation, could be more robust
                setPatients(restoredData.patients);
                setDoctors(restoredData.doctors);
                setAppointments(restoredData.appointments);
                setReminderSettings(restoredData.reminderSettings);
                alert('تم استيراد البيانات بنجاح!');
            } else {
                alert('الملف المستورد ليس بتنسيق البيانات المتوقع.');
            }
        } catch (error) {
            console.error("Failed to restore data:", error);
            alert('حدث خطأ أثناء استيراد البيانات. يرجى التأكد من أن الملف صحيح.');
        }
    };
    
    const handleUpdateReminderSettings = (leadTimeHours: number) => {
        setReminderSettings({ leadTimeHours });
        alert('تم تحديث إعدادات التذكيرات بنجاح.');
    };

    const sidebarStyle = isMobileView 
        ? {...styles.sidebar, ...styles.sidebarMobile, ...(isSidebarOpen && styles.sidebarMobileOpen)} 
        : styles.sidebar;
    const mainContentStyle = isMobileView 
        ? {...styles.mainContent, ...styles.mainContentMobile} 
        : styles.mainContent;

    return (
        <div style={styles.appContainer}>
            {isMobileView && (
                <div style={styles.mobileHeader}>
                    <button style={styles.hamburgerButton} onClick={() => setIsSidebarOpen(true)} aria-label="Open navigation">
                        <HamburgerIcon />
                    </button>
                    <h1 style={{ ...styles.sidebarTitle, margin: 0 }}>كيورا</h1>
                </div>
            )}

            <div style={sidebarStyle}>
                {isMobileView && (
                    <button style={styles.closeButton} onClick={() => setIsSidebarOpen(false)} aria-label="Close navigation">
                        <CloseIcon />
                    </button>
                )}
                <div style={styles.sidebarHeader}>
                    <h1 style={styles.sidebarTitle}>كيورا</h1>
                    <p style={styles.sidebarSubtitle}>إدارة عيادة علاج طبيعي وتغذية</p>
                </div>
                <nav style={styles.sidebarNav}>
                    <button 
                        style={{...styles.sidebarNavButton, ...(activeView === 'dashboard' && styles.sidebarNavButtonActive)}} 
                        onClick={() => {setActiveView('dashboard'); if(isMobileView) setIsSidebarOpen(false);}}>
                        <DashboardIcon active={activeView === 'dashboard'} />
                        لوحة التحكم
                    </button>
                    <button 
                        style={{...styles.sidebarNavButton, ...(activeView === 'patients' && styles.sidebarNavButtonActive)}} 
                        onClick={() => {setActiveView('patients'); if(isMobileView) setIsSidebarOpen(false);}}>
                        <PatientsIcon active={activeView === 'patients'} />
                        المرضى
                    </button>
                    <button 
                        style={{...styles.sidebarNavButton, ...(activeView === 'doctors' && styles.sidebarNavButtonActive)}} 
                        onClick={() => {setActiveView('doctors'); if(isMobileView) setIsSidebarOpen(false);}}>
                        <DoctorsIcon active={activeView === 'doctors'} />
                        الأطباء
                    </button>
                    <button 
                        style={{...styles.sidebarNavButton, ...(activeView === 'appointments' && styles.sidebarNavButtonActive)}} 
                        onClick={() => {setActiveView('appointments'); if(isMobileView) setIsSidebarOpen(false);}}>
                        <AppointmentsIcon active={activeView === 'appointments'} />
                        المواعيد
                    </button>
                </nav>
            </div>

            {isMobileView && isSidebarOpen && <div style={styles.mobileOverlay} onClick={() => setIsSidebarOpen(false)}></div>}

            <div style={mainContentStyle}>
                {activeView === 'dashboard' && (
                    <DashboardView 
                        patients={patients}
                        doctors={doctors}
                        appointments={appointments}
                        onBackup={handleBackup}
                        onRestore={handleRestore}
                        reminderSettings={reminderSettings}
                        onUpdateReminderSettings={handleUpdateReminderSettings}
                        isMobileView={isMobileView}
                    />
                )}
                {activeView === 'patients' && (
                    <PatientsView 
                        patients={patients}
                        onAddPatient={() => {setEditingPatient(null); setModal('patient');}}
                        onEditPatient={(patient) => {setEditingPatient(patient); setModal('patient');}}
                        onDeletePatient={handleDeletePatient}
                        onAddLog={(patient) => {setSelectedPatient(patient); setModal('log');}}
                        onUpdateLogPayment={handleUpdateLogPayment}
                        isMobileView={isMobileView}
                    />
                )}
                {activeView === 'doctors' && (
                    <DoctorsView 
                        doctors={doctors}
                        onAddDoctor={() => {setEditingDoctor(null); setModal('doctor');}}
                        onEditDoctor={(doctor) => {setEditingDoctor(doctor); setModal('doctor');}}
                        onDeleteDoctor={handleDeleteDoctor}
                        onViewSchedule={(doctor) => {setViewingDoctorSchedule(doctor); setModal('doctorSchedule');}}
                        isMobileView={isMobileView}
                    />
                )}
                {activeView === 'appointments' && (
                    <AppointmentsView 
                        appointments={appointments}
                        patients={patients}
                        doctors={doctors}
                        onAddAppointment={() => setModal('appointment')}
                        onUpdateStatus={handleUpdateAppointmentStatus}
                        isMobileView={isMobileView}
                    />
                )}
            </div>

            {/* Modals */}
            {modal === 'patient' && (
                <PatientForm 
                    onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
                    onCancel={() => {setModal('none'); setEditingPatient(null);}}
                    initialData={editingPatient}
                    isMobileView={isMobileView}
                />
            )}
            {modal === 'log' && selectedPatient && (
                <TreatmentLogForm 
                    patient={selectedPatient}
                    onAddLog={handleAddTreatmentLog}
                    onCancel={() => {setModal('none'); setSelectedPatient(null);}}
                    isMobileView={isMobileView}
                />
            )}
            {modal === 'doctor' && (
                <DoctorForm 
                    onSubmit={editingDoctor ? handleUpdateDoctor : handleAddDoctor}
                    onCancel={() => {setModal('none'); setEditingDoctor(null);}}
                    initialData={editingDoctor}
                    isMobileView={isMobileView}
                />
            )}
            {modal === 'appointment' && (
                <AppointmentForm 
                    onSubmit={handleAddAppointment}
                    onCancel={() => setModal('none')}
                    patients={patients}
                    doctors={doctors}
                    isMobileView={isMobileView}
                />
            )}
            {modal === 'doctorSchedule' && viewingDoctorSchedule && (
                <DoctorScheduleModal 
                    doctor={viewingDoctorSchedule}
                    appointments={appointments}
                    patients={patients}
                    onClose={() => {setModal('none'); setViewingDoctorSchedule(null);}}
                    isMobileView={isMobileView}
                />
            )}
        </div>
    );
};