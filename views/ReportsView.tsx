import React, { useState, useMemo } from 'react';
import { Patient, Doctor, Appointment, ReportType, DemographicsReport, AppointmentReport, FinancialReport, GeneratedReport, PatientSatisfactionReport, PatientSummaryReport, DoctorSummaryReport } from '../types';
import { styles, successColor, dangerColor, brandColor, lightBackground, warningColor, infoColor, lightTextColor } from '../styles';
import { calculateAge, getSpecialtyName, DOCTOR_COLORS } from '../utils';
import { BarChartComponent, PieChartComponent } from '../components/Charts'; // Import chart components
import { Pagination } from '../components/Pagination'; // Import pagination component
import { PatientSummaryReportDisplay } from '../components/PatientSummaryReportDisplay'; // New: Import PatientSummaryReportDisplay
import { DoctorSummaryReportDisplay } from '../components/DoctorSummaryReportDisplay'; // New: Import DoctorSummaryReportDisplay

export const ReportsView: React.FC<{
    patients: Patient[];
    doctors: Doctor[];
    appointments: Appointment[];
    isMobileView: boolean;
}> = ({ patients, doctors, appointments, isMobileView }) => {
    const [reportType, setReportType] = useState<ReportType>('none');
    const [reportStartDate, setReportStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [generatedReport, setGeneratedReport] = useState<GeneratedReport>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null); // State for selected patient
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null); // New: State for selected doctor

    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'مريض محذوف';
    const getPatient = (id: string) => patients.find(p => p.id === id);
    const getDoctor = (id: string) => doctors.find(d => d.id === id);

    const generateReport = () => {
        const start = new Date(reportStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(reportEndDate);
        end.setHours(23, 59, 59, 999);

        let reportData: any = null;

        switch (reportType) {
            case 'demographics': {
                const filteredPatients = patients.filter(p => {
                    const patientCreatedAt = new Date(p.createdAt);
                    return patientCreatedAt >= start && patientCreatedAt <= end;
                });

                const malePatients = filteredPatients.filter(p => p.gender === 'male').length;
                const femalePatients = filteredPatients.filter(p => p.gender === 'female').length;

                const ageDistributionMap: Record<string, number> = {
                    '0-12 (أطفال)': 0,
                    '13-17 (مراهقون)': 0,
                    '18-24 (شباب)': 0,
                    '25-34': 0,
                    '35-49': 0,
                    '50-64': 0,
                    '65+ (كبار السن)': 0,
                };

                const bmiDistributionMap: Record<string, number> = {
                    'أقل من الوزن الطبيعي (<18.5)': 0,
                    'وزن طبيعي (18.5-24.9)': 0,
                    'وزن زائد (25-29.9)': 0,
                    'سمنة (30+)': 0,
                };

                const patientGrowthByMonthMap: Record<string, number> = {};

                filteredPatients.forEach(p => {
                    // Age distribution
                    const age = calculateAge(p.dob);
                    if (age !== null) {
                        if (age >= 0 && age <= 12) ageDistributionMap['0-12 (أطفال)']++;
                        else if (age >= 13 && age <= 17) ageDistributionMap['13-17 (مراهقون)']++;
                        else if (age >= 18 && age <= 24) ageDistributionMap['18-24 (شباب)']++;
                        else if (age >= 25 && age <= 34) ageDistributionMap['25-34']++;
                        else if (age >= 35 && age <= 49) ageDistributionMap['35-49']++;
                        else if (age >= 50 && age <= 64) ageDistributionMap['50-64']++;
                        else ageDistributionMap['65+ (كبار السن)']++;
                    }

                    // BMI distribution
                    if (p.height > 0 && p.weight > 0) {
                        const heightInMeters = p.height / 100;
                        const bmi = p.weight / (heightInMeters * heightInMeters);
                        if (bmi < 18.5) bmiDistributionMap['أقل من الوزن الطبيعي (<18.5)']++;
                        else if (bmi >= 18.5 && bmi <= 24.9) bmiDistributionMap['وزن طبيعي (18.5-24.9)']++;
                        else if (bmi >= 25 && bmi <= 29.9) bmiDistributionMap['وزن زائد (25-29.9)']++;
                        else bmiDistributionMap['سمنة (30+)']++;
                    }

                    // Patient growth by month
                    const creationDate = new Date(p.createdAt);
                    const monthKey = `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1).toString().padStart(2, '0')}`;
                    patientGrowthByMonthMap[monthKey] = (patientGrowthByMonthMap[monthKey] || 0) + 1;
                });

                const patientsBySpecialtyMap: Record<string, number> = {};
                filteredPatients.forEach(p => {
                    const specialtyName = getSpecialtyName(p.primaryCare);
                    patientsBySpecialtyMap[specialtyName] = (patientsBySpecialtyMap[specialtyName] || 0) + 1;
                });

                reportData = {
                    totalPatients: filteredPatients.length,
                    malePatients,
                    femalePatients,
                    ageDistribution: Object.entries(ageDistributionMap).map(([label, count]) => ({ label, count })),
                    patientsBySpecialty: Object.entries(patientsBySpecialtyMap).map(([specialty, count]) => ({ specialty, count })),
                    bmiDistribution: Object.entries(bmiDistributionMap).map(([label, count]) => ({ label, count })),
                    patientGrowthByMonth: Object.entries(patientGrowthByMonthMap)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([month, count]) => ({ month, count })),
                } as DemographicsReport;
                break;
            }
            case 'appointments': {
                const filteredAppointments = appointments.filter(a => {
                    const appDate = new Date(a.date);
                    return appDate >= start && appDate <= end;
                });

                const scheduled = filteredAppointments.filter(a => a.status === 'scheduled').length;
                const completed = filteredAppointments.filter(a => a.status === 'completed').length;
                const canceled = filteredAppointments.filter(a => a.status === 'canceled').length;

                const appointmentsByDoctorMap: Record<string, number> = {};
                const appointmentsBySpecialtyMap: Record<string, number> = {};
                const appointmentsByMonthMap: Record<string, number> = {};

                filteredAppointments.forEach(a => {
                    const doctor = getDoctor(a.doctorId);
                    if (doctor) {
                        appointmentsByDoctorMap[doctor.name] = (appointmentsByDoctorMap[doctor.name] || 0) + 1;
                        const specialtyName = getSpecialtyName(doctor.specialty);
                        appointmentsBySpecialtyMap[specialtyName] = (appointmentsBySpecialtyMap[specialtyName] || 0) + 1;
                    }
                    const appDate = new Date(a.date);
                    const monthKey = `${appDate.getFullYear()}-${(appDate.getMonth() + 1).toString().padStart(2, '0')}`;
                    appointmentsByMonthMap[monthKey] = (appointmentsByMonthMap[monthKey] || 0) + 1;
                });

                const appointmentsByPatientMap: Record<string, number> = {};
                filteredAppointments.forEach(a => {
                    const patientName = getPatientName(a.patientId);
                    appointmentsByPatientMap[patientName] = (appointmentsByPatientMap[patientName] || 0) + 1;
                });

                reportData = {
                    totalAppointments: filteredAppointments.length,
                    scheduled,
                    completed,
                    canceled,
                    appointmentsByDoctor: Object.entries(appointmentsByDoctorMap).map(([doctorName, count]) => ({ doctorName, count, color: doctors.find(d => d.name === doctorName)?.color || '#ccc' })),
                    appointmentsByPatient: Object.entries(appointmentsByPatientMap).map(([patientName, count]) => ({ patientName, count })).sort((a, b) => b.count - a.count), // Keep all for pagination
                    appointmentsByMonth: Object.entries(appointmentsByMonthMap)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([month, count]) => ({ month, count })),
                    appointmentsBySpecialty: Object.entries(appointmentsBySpecialtyMap).map(([specialty, count]) => ({ specialty, count, color: DOCTOR_COLORS[Object.keys(appointmentsBySpecialtyMap).indexOf(specialty) % DOCTOR_COLORS.length] })),
                } as AppointmentReport;
                break;
            }
            case 'financial': {
                const filteredLogs = patients.flatMap(p => p.treatmentHistory).filter(log => {
                    const logDate = new Date(log.date);
                    logDate.setHours(0, 0, 0, 0); // Normalize log date to start of day
                    const queryStartDate = new Date(start);
                    queryStartDate.setHours(0,0,0,0); // Normalize query start date to start of day
                    const queryEndDate = new Date(end);
                    queryEndDate.setHours(23,59,59,999); // Normalize query end date to end of day

                    return logDate >= queryStartDate && logDate <= queryEndDate;
                });

                const totalBilled = filteredLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
                const totalPaid = filteredLogs.filter(log => log.paid).reduce((sum, log) => sum + (log.cost || 0), 0);
                const totalOutstanding = filteredLogs.filter(log => !log.paid).reduce((sum, log) => sum + (log.cost || 0), 0);

                const revenueBySpecialtyMap: Record<string, number> = {};
                const monthlyRevenueMap: Record<string, number> = {};

                filteredLogs.forEach(log => {
                    const patient = patients.find(p => p.treatmentHistory.some(l => l.id === log.id));
                    if (patient && log.paid) {
                        const patientSpecialty = getSpecialtyName(patient.primaryCare);
                        revenueBySpecialtyMap[patientSpecialty] = (revenueBySpecialtyMap[patientSpecialty] || 0) + (log.cost || 0);

                        const logDate = new Date(log.date);
                        const monthKey = `${logDate.getFullYear()}-${(logDate.getMonth() + 1).toString().padStart(2, '0')}`;
                        monthlyRevenueMap[monthKey] = (monthlyRevenueMap[monthKey] || 0) + (log.cost || 0);
                    }
                });

                const averageTreatmentCost = filteredLogs.length > 0 ? totalBilled / filteredLogs.length : 0;
                const collectionRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;


                reportData = {
                    totalBilled,
                    totalPaid,
                    totalOutstanding,
                    revenueBySpecialty: Object.entries(revenueBySpecialtyMap).map(([specialty, revenue]) => ({ specialty, revenue })),
                    monthlyRevenue: Object.entries(monthlyRevenueMap)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([month, revenue]) => ({ month, revenue })),
                    averageTreatmentCost,
                    collectionRate,
                } as FinancialReport;
                break;
            }
            case 'satisfaction': { // Patient Satisfaction Report logic
                const allRatedLogs = patients.flatMap(p => 
                    p.treatmentHistory.map(log => ({ ...log, patientId: p.id, patientName: p.name, primaryCare: p.primaryCare }))
                ).filter(log => 
                    log.satisfactionRating !== undefined && log.satisfactionRating !== null &&
                    new Date(log.date) >= start && new Date(log.date) <= end
                );

                const totalRatings = allRatedLogs.length;
                const sumRatings = allRatedLogs.reduce((sum, log) => sum + (log.satisfactionRating || 0), 0);
                const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

                const ratingDistributionMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                allRatedLogs.forEach(log => {
                    if (log.satisfactionRating) {
                        ratingDistributionMap[log.satisfactionRating]++;
                    }
                });

                // Top 3 positive and 3 negative feedbacks
                const positiveFeedbacks = allRatedLogs.filter(log => log.feedback && log.satisfactionRating && log.satisfactionRating >= 4)
                    .sort((a, b) => (b.satisfactionRating || 0) - (a.satisfactionRating || 0))
                    .slice(0, 3)
                    .map(log => ({ patientName: log.patientName, feedback: log.feedback!, rating: log.satisfactionRating!, date: log.date }));

                const negativeFeedbacks = allRatedLogs.filter(log => log.feedback && log.satisfactionRating && log.satisfactionRating <= 2)
                    .sort((a, b) => (a.satisfactionRating || 0) - (b.satisfactionRating || 0))
                    .slice(0, 3)
                    .map(log => ({ patientName: log.patientName, feedback: log.feedback!, rating: log.satisfactionRating!, date: log.date }));

                const feedbackHighlights = [...positiveFeedbacks, ...negativeFeedbacks];


                const satisfactionBySpecialtyMap: Record<string, { totalRating: number; count: number }> = {};
                allRatedLogs.forEach(log => {
                    const specialtyName = getSpecialtyName(log.primaryCare);
                    if (!satisfactionBySpecialtyMap[specialtyName]) {
                        satisfactionBySpecialtyMap[specialtyName] = { totalRating: 0, count: 0 };
                    }
                    satisfactionBySpecialtyMap[specialtyName].totalRating += (log.satisfactionRating || 0);
                    satisfactionBySpecialtyMap[specialtyName].count++;
                });
                const satisfactionBySpecialty = Object.entries(satisfactionBySpecialtyMap).map(([specialty, data]) => ({
                    specialty,
                    averageRating: data.count > 0 ? data.totalRating / data.count : 0,
                    count: data.count,
                }));

                const satisfactionByDoctorMap: Record<string, { totalRating: number; count: number }> = {};
                const doctorColorMap = new Map(doctors.map(d => [d.id, d.color]));
                allRatedLogs.forEach(log => {
                    // Find an appointment associated with this log. This is an approximation.
                    // A more robust solution would be to link logs directly to appointments or doctors.
                    const appointment = appointments.find(app => 
                        app.patientId === log.patientId && 
                        app.date.startsWith(log.date.split('T')[0]) && // Match by patient and date
                        getDoctor(app.doctorId)?.specialty === getPatient(log.patientId)?.primaryCare // Assuming primary care matches doctor specialty for satisfaction
                    );
                    const doctor = appointment ? getDoctor(appointment.doctorId) : null;
                    if (doctor) {
                        if (!satisfactionByDoctorMap[doctor.name]) {
                            satisfactionByDoctorMap[doctor.name] = { totalRating: 0, count: 0 };
                        }
                        satisfactionByDoctorMap[doctor.name].totalRating += (log.satisfactionRating || 0);
                        satisfactionByDoctorMap[doctor.name].count++;
                    }
                });
                const satisfactionByDoctor = Object.entries(satisfactionByDoctorMap).map(([doctorName, data]) => ({
                    doctorName,
                    averageRating: data.count > 0 ? data.totalRating / data.count : 0,
                    count: data.count,
                    color: doctors.find(d => d.name === doctorName)?.color || '#ccc',
                }));

                reportData = {
                    averageRating,
                    ratingDistribution: Object.entries(ratingDistributionMap).map(([rating, count]) => ({ rating: Number(rating), count })).sort((a, b) => a.rating - b.rating),
                    feedbackHighlights,
                    satisfactionBySpecialty,
                    satisfactionByDoctor,
                } as PatientSatisfactionReport;
                break;
            }
            case 'patient-summary': { // Patient Summary Report logic
                if (!selectedPatientId) {
                    alert('يرجى اختيار مريض لإنشاء التقرير الشامل.');
                    setGeneratedReport(null);
                    return;
                }
                const patient = patients.find(p => p.id === selectedPatientId);
                if (!patient) {
                    alert('المريض غير موجود.');
                    setGeneratedReport(null);
                    return;
                }

                // Appointments
                const patientAppointments = appointments
                    .filter(app => app.patientId === patient.id)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                const totalAppointments = patientAppointments.length;
                const completedAppointments = patientAppointments.filter(app => app.status === 'completed').length;
                const canceledAppointments = patientAppointments.filter(app => app.status === 'canceled').length;

                const appointmentsDetails = patientAppointments.map(app => ({
                    date: app.date,
                    doctorName: getDoctor(app.doctorId)?.name || 'طبيب محذوف',
                    reason: app.reason,
                    status: app.status,
                    doctorColor: getDoctor(app.doctorId)?.color || '#ccc',
                }));

                // Financials & Satisfaction
                const patientTreatmentLogs = [...patient.treatmentHistory].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                const totalBilled = patientTreatmentLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
                const totalPaid = patientTreatmentLogs.filter(log => log.paid).reduce((sum, log) => sum + (log.cost || 0), 0);
                const totalOutstanding = patientTreatmentLogs.filter(log => !log.paid).reduce((sum, log) => sum + (log.cost || 0), 0);

                const ratedLogs = patientTreatmentLogs.filter(log => log.satisfactionRating !== undefined && log.satisfactionRating !== null);
                const sumSatisfactionRatings = ratedLogs.reduce((sum, log) => sum + (log.satisfactionRating || 0), 0);
                const averageSatisfactionRating = ratedLogs.length > 0 ? sumSatisfactionRatings / ratedLogs.length : null;

                reportData = {
                    patient,
                    totalAppointments,
                    completedAppointments,
                    canceledAppointments,
                    totalBilled,
                    totalPaid,
                    totalOutstanding,
                    averageSatisfactionRating,
                    appointmentsDetails,
                    treatmentLogsDetails: patientTreatmentLogs,
                } as PatientSummaryReport;
                break;
            }
            case 'doctor-summary': { // New: Doctor Summary Report logic
                if (!selectedDoctorId) {
                    alert('يرجى اختيار طبيب لإنشاء التقرير الشامل.');
                    setGeneratedReport(null);
                    return;
                }
                const doctor = doctors.find(d => d.id === selectedDoctorId);
                if (!doctor) {
                    alert('الطبيب غير موجود.');
                    setGeneratedReport(null);
                    return;
                }

                // Appointments for this doctor
                const doctorAppointments = appointments
                    .filter(app => app.doctorId === doctor.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent first

                const totalAppointments = doctorAppointments.length;
                const scheduledAppointments = doctorAppointments.filter(app => app.status === 'scheduled').length;
                const completedAppointments = doctorAppointments.filter(app => app.status === 'completed').length;
                const canceledAppointments = doctorAppointments.filter(app => app.status === 'canceled').length;

                const recentAppointments = doctorAppointments.slice(0, 5).map(app => ({
                    date: app.date,
                    patientName: getPatientName(app.patientId),
                    reason: app.reason,
                    status: app.status,
                    patientId: app.patientId,
                }));

                // Calculate average satisfaction rating for this doctor
                let sumSatisfactionRatings = 0;
                let countSatisfactionRatings = 0;

                const uniquePatientsTreated = new Map<string, {name: string, count: number}>();

                doctorAppointments.forEach(app => {
                    // Collect unique patients
                    const patient = getPatient(app.patientId);
                    if (patient) {
                        const currentCount = uniquePatientsTreated.get(patient.id)?.count || 0;
                        uniquePatientsTreated.set(patient.id, { name: patient.name, count: currentCount + 1 });

                        // Find treatment logs for this patient that are roughly around the appointment date
                        patient.treatmentHistory.forEach(log => {
                            // Simple heuristic: if log date is same day as appointment and has a rating
                            if (log.date.startsWith(app.date.split('T')[0]) && log.satisfactionRating !== undefined && log.satisfactionRating !== null) {
                                sumSatisfactionRatings += log.satisfactionRating;
                                countSatisfactionRatings++;
                            }
                        });
                    }
                });

                const averageSatisfactionRating = countSatisfactionRatings > 0 ? sumSatisfactionRatings / countSatisfactionRatings : null;

                reportData = {
                    doctor,
                    totalAppointments,
                    scheduledAppointments,
                    completedAppointments,
                    canceledAppointments,
                    averageSatisfactionRating,
                    recentAppointments,
                    treatedPatients: Array.from(uniquePatientsTreated.values()).sort((a,b) => b.count - a.count),
                } as DoctorSummaryReport;
                break;
            }
        }
        setGeneratedReport({ type: reportType, data: reportData });
    };

    // Reset selectedPatientId/selectedDoctorId when report type changes
    React.useEffect(() => {
        if (reportType !== 'patient-summary') {
            setSelectedPatientId(null);
        }
        if (reportType !== 'doctor-summary') {
            setSelectedDoctorId(null);
        }
    }, [reportType]);


    return (
        <>
            <div style={isMobileView ? { ...styles.viewHeader, ...styles.viewHeaderMobile } : styles.viewHeader}>
                <h1 style={styles.viewTitle}>تقارير مخصصة</h1>
            </div>
            <div style={styles.section}>
                <p style={{ color: '#6c757d', marginBottom: '20px', textAlign: 'center' }}>
                    اختر نوع التقرير والفترة الزمنية لإنشاء تقارير مفصلة.
                </p>
                <div style={isMobileView ? { ...styles.form, ...styles.formRowMobile } : styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="report-type">نوع التقرير</label>
                        <select
                            id="report-type"
                            style={styles.select}
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                        >
                            <option value="none" disabled>اختر نوع التقرير</option>
                            <option value="demographics">التركيبة السكانية للمرضى</option>
                            <option value="appointments">ملخص المواعيد</option>
                            <option value="financial">الملخص المالي</option>
                            <option value="satisfaction">رضا المرضى</option>
                            <option value="patient-summary">ملخص المريض</option>
                            <option value="doctor-summary">ملخص الطبيب</option> {/* New: Doctor Summary Report */}
                        </select>
                    </div>

                    {reportType !== 'patient-summary' && reportType !== 'doctor-summary' && ( // Hide date filters for patient/doctor summary
                        <>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="report-start-date">تاريخ البدء</label>
                                <input
                                    type="date"
                                    id="report-start-date"
                                    style={styles.input}
                                    value={reportStartDate}
                                    onChange={(e) => setReportStartDate(e.target.value)}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label} htmlFor="report-end-date">تاريخ الانتهاء</label>
                                <input
                                    type="date"
                                    id="report-end-date"
                                    style={styles.input}
                                    value={reportEndDate}
                                    onChange={(e) => setReportEndDate(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {reportType === 'patient-summary' && ( // Show patient selection for patient summary
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="select-patient">اختر المريض</label>
                            <select
                                id="select-patient"
                                style={styles.select}
                                value={selectedPatientId || ''}
                                onChange={(e) => setSelectedPatientId(e.target.value)}
                                required
                            >
                                <option value="" disabled>اختر مريض...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {reportType === 'doctor-summary' && ( // New: Show doctor selection for doctor summary
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="select-doctor">اختر الطبيب</label>
                            <select
                                id="select-doctor"
                                style={styles.select}
                                value={selectedDoctorId || ''}
                                onChange={(e) => setSelectedDoctorId(e.target.value)}
                                required
                            >
                                <option value="" disabled>اختر طبيب...</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} ({getSpecialtyName(d.specialty)})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    <div style={{ ...styles.formActions, gridColumn: isMobileView ? '1' : '1 / -1' }}>
                        <button
                            style={{ ...styles.button, ...styles.buttonPrimary, ...(isMobileView && styles.fullWidth) }}
                            onClick={generateReport}
                            disabled={
                                reportType === 'none' || 
                                (reportType === 'patient-summary' && !selectedPatientId) ||
                                (reportType === 'doctor-summary' && !selectedDoctorId)
                            }
                        >
                            إنشاء التقرير
                        </button>
                    </div>
                </div>

                {generatedReport && generatedReport.data && (
                    <div style={{ marginTop: '30px', borderTop: `1px solid ${lightBackground}`, paddingTop: '20px' }}>
                        <h3 style={styles.viewTitle}>نتائج التقرير: {
                            reportType === 'demographics' ? 'التركيبة السكانية للمرضى' :
                                reportType === 'appointments' ? 'ملخص المواعيد' :
                                    reportType === 'financial' ? 'الملخص المالي' :
                                    reportType === 'satisfaction' ? 'رضا المرضى' :
                                    reportType === 'patient-summary' ? `ملخص المريض: ${(generatedReport.data as PatientSummaryReport).patient.name}` :
                                    reportType === 'doctor-summary' ? `ملخص الطبيب: د. ${(generatedReport.data as DoctorSummaryReport).doctor.name}` : ''
                        }</h3>
                        {reportType === 'demographics' && (
                            <DemographicsReportDisplay report={generatedReport.data as DemographicsReport} isMobileView={isMobileView} />
                        )}
                        {reportType === 'appointments' && (
                            <AppointmentReportDisplay report={generatedReport.data as AppointmentReport} isMobileView={isMobileView} />
                        )}
                        {reportType === 'financial' && (
                            <FinancialReportDisplay report={generatedReport.data as FinancialReport} />
                        )}
                        {reportType === 'satisfaction' && (
                            <PatientSatisfactionReportDisplay report={generatedReport.data as PatientSatisfactionReport} isMobileView={isMobileView} />
                        )}
                        {reportType === 'patient-summary' && (
                            <PatientSummaryReportDisplay report={generatedReport.data as PatientSummaryReport} isMobileView={isMobileView} />
                        )}
                        {reportType === 'doctor-summary' && ( // New: Render DoctorSummaryReportDisplay
                            <DoctorSummaryReportDisplay report={generatedReport.data as DoctorSummaryReport} isMobileView={isMobileView} />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

const DemographicsReportDisplay: React.FC<{ report: DemographicsReport; isMobileView: boolean; }> = ({ report, isMobileView }) => {
    // Chart Data for Age Distribution
    const ageLabels = (report.ageDistribution ?? []).map(item => item.label);
    const ageData = (report.ageDistribution ?? []).map(item => item.count);

    // Chart Data for Patients by Specialty
    const specialtyLabels = (report.patientsBySpecialty ?? []).map(item => item.specialty);
    const specialtyData = (report.patientsBySpecialty ?? []).map(item => item.count);
    
    // Chart Data for BMI Distribution
    const bmiLabels = (report.bmiDistribution ?? []).map(item => item.label);
    const bmiData = (report.bmiDistribution ?? []).map(item => item.count);

    // Chart Data for Patient Growth
    const growthLabels = (report.patientGrowthByMonth ?? []).map(item => item.month);
    const growthData = (report.patientGrowthByMonth ?? []).map(item => item.count);

    // Generate distinct colors for charts
    const chartColors = DOCTOR_COLORS.slice(0, Math.max(ageLabels.length, specialtyLabels.length, bmiLabels.length, growthLabels.length));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.reportDetailsGrid}>
                <div style={styles.reportDetailCard}>
                    <div style={styles.reportDetailLabel}>إجمالي المرضى</div>
                    <div style={styles.reportDetailValue}>{report.totalPatients}</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: brandColor}}>
                    <div style={styles.reportDetailLabel}>الذكور</div>
                    <div style={styles.reportDetailValue}>{report.malePatients}</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: '#e83e8c'}}>
                    <div style={styles.reportDetailLabel}>الإناث</div>
                    <div style={styles.reportDetailValue}>{report.femalePatients}</div>
                </div>
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>توزيع الأعمار</h4>
                {ageData.some(count => count > 0) ? (
                    <PieChartComponent
                        labels={ageLabels}
                        data={ageData}
                        title="توزيع الأعمار للمرضى"
                        backgroundColors={chartColors}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لتوزيع الأعمار في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>توزيع مؤشر كتلة الجسم (BMI)</h4>
                {bmiData.some(count => count > 0) ? (
                    <PieChartComponent
                        labels={bmiLabels}
                        data={bmiData}
                        title="توزيع مؤشر كتلة الجسم (BMI) للمرضى"
                        backgroundColors={DOCTOR_COLORS.slice(0, bmiLabels.length).reverse()}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لمؤشر كتلة الجسم في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>المرضى حسب القسم</h4>
                {specialtyData.some(count => count > 0) ? (
                    <PieChartComponent
                        labels={specialtyLabels}
                        data={specialtyData}
                        title="عدد المرضى حسب القسم"
                        backgroundColors={chartColors.map((_, i) => DOCTOR_COLORS[i % DOCTOR_COLORS.length])}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للمرضى حسب القسم في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>نمو المرضى شهريًا</h4>
                {growthData.some(count => count > 0) ? (
                    <BarChartComponent
                        labels={growthLabels}
                        data={growthData}
                        title="نمو عدد المرضى شهريًا"
                        backgroundColors={DOCTOR_COLORS.slice(0, growthLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لنمو المرضى في هذه الفترة.</p>
                )}
            </div>
        </div>
    );
};

const AppointmentReportDisplay: React.FC<{ report: AppointmentReport; isMobileView: boolean; }> = ({ report, isMobileView }) => {
    // Chart Data for Appointments by Doctor
    const doctorNames = (report.appointmentsByDoctor ?? []).map(item => item.doctorName);
    const doctorAppointmentCounts = (report.appointmentsByDoctor ?? []).map(item => item.count);
    const doctorColors = (report.appointmentsByDoctor ?? []).map(item => item.color);

    // Chart Data for Appointments by Status
    const statusLabels = ['مجدولة', 'مكتملة', 'ملغاة'];
    const statusData = [report.scheduled, report.completed, report.canceled];
    const statusColors = [warningColor, successColor, dangerColor];

    // Chart Data for Appointments by Specialty
    const specialtyLabels = (report.appointmentsBySpecialty ?? []).map(item => item.specialty);
    const specialtyData = (report.appointmentsBySpecialty ?? []).map(item => item.count);
    const specialtyColors = (report.appointmentsBySpecialty ?? []).map(item => item.color);

    // Chart Data for Appointments by Month
    const monthlyLabels = (report.appointmentsByMonth ?? []).map(item => item.month);
    const monthlyData = (report.appointmentsByMonth ?? []).map(item => item.count);

    // Pagination for Appointments by Patient
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = isMobileView ? 5 : 10;
    const totalPages = Math.ceil((report.appointmentsByPatient?.length ?? 0) / itemsPerPage);

    const paginatedPatients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return (report.appointmentsByPatient ?? []).slice(startIndex, endIndex);
    }, [report.appointmentsByPatient, currentPage, itemsPerPage]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.reportDetailsGrid}>
                <div style={styles.reportDetailCard}>
                    <div style={styles.reportDetailLabel}>إجمالي المواعيد</div>
                    <div style={styles.reportDetailValue}>{report.totalAppointments}</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: warningColor}}>
                    <div style={styles.reportDetailLabel}>مجدولة</div>
                    <div style={styles.reportDetailValue}>{report.scheduled}</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: successColor}}>
                    <div style={styles.reportDetailLabel}>مكتملة</div>
                    <div style={styles.reportDetailValue}>{report.completed}</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: dangerColor}}>
                    <div style={styles.reportDetailLabel}>ملغاة</div>
                    <div style={styles.reportDetailValue}>{report.canceled}</div>
                </div>
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>حالة المواعيد</h4>
                {statusData.some(count => count > 0) ? (
                    <PieChartComponent
                        labels={statusLabels}
                        data={statusData}
                        title="توزيع حالات المواعيد"
                        backgroundColors={statusColors}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لحالة المواعيد في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>المواعيد حسب الطبيب</h4>
                {doctorAppointmentCounts.some(count => count > 0) ? (
                    <BarChartComponent
                        labels={doctorNames}
                        data={doctorAppointmentCounts}
                        title="عدد المواعيد لكل طبيب"
                        backgroundColors={doctorColors}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للمواعيد حسب الطبيب في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>المواعيد حسب التخصص</h4>
                {specialtyData.some(count => count > 0) ? (
                    <PieChartComponent
                        labels={specialtyLabels}
                        data={specialtyData}
                        title="عدد المواعيد حسب التخصص"
                        backgroundColors={specialtyColors}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للمواعيد حسب التخصص في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>اتجاهات المواعيد الشهرية</h4>
                {monthlyData.some(count => count > 0) ? (
                    <BarChartComponent
                        labels={monthlyLabels}
                        data={monthlyData}
                        title="عدد المواعيد شهريًا"
                        backgroundColors={DOCTOR_COLORS.slice(0, monthlyLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لاتجاهات المواعيد الشهرية في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>أكثر المرضى حجزًا للمواعيد</h4>
                {(report.appointmentsByPatient?.length ?? 0) > 0 ? (
                    <>
                        <ul style={{ ...styles.list, paddingInlineStart: '20px' }}>
                            {paginatedPatients.map(item => (
                                <li key={item.patientName} style={styles.listItem}><span style={styles.listItemName}>{item.patientName}:</span> <span style={styles.listItemDetails}>{item.count}</span></li>
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للمرضى حسب المواعيد في هذه الفترة.</p>
                )}
            </div>
        </div>
    );
};

const FinancialReportDisplay: React.FC<{ report: FinancialReport }> = ({ report }) => {
    // Chart Data for Revenue by Specialty
    const specialtyLabels = (report.revenueBySpecialty ?? []).map(item => item.specialty);
    const revenueData = (report.revenueBySpecialty ?? []).map(item => item.revenue ?? 0);

    // Chart Data for Monthly Revenue
    const monthlyRevenueLabels = (report.monthlyRevenue ?? []).map(item => item.month);
    const monthlyRevenueData = (report.monthlyRevenue ?? []).map(item => item.revenue ?? 0);

    const collectionRateValue = report.collectionRate ?? 0;
    const averageCostValue = report.averageTreatmentCost ?? 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.reportDetailsGrid}>
                <div style={{...styles.reportDetailCard, borderRightColor: brandColor}}>
                    <div style={styles.reportDetailLabel}>إجمالي الفواتير</div>
                    <div style={styles.reportDetailValue}>{(report.totalBilled ?? 0).toLocaleString()} ج.م</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: successColor}}>
                    <div style={styles.reportDetailLabel}>إجمالي المدفوعات</div>
                    <div style={styles.reportDetailValue}>{(report.totalPaid ?? 0).toLocaleString()} ج.م</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: dangerColor}}>
                    <div style={styles.reportDetailLabel}>إجمالي المستحق</div>
                    <div style={styles.reportDetailValue}>{(report.totalOutstanding ?? 0).toLocaleString()} ج.م</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: infoColor}}>
                    <div style={styles.reportDetailLabel}>متوسط تكلفة الجلسة</div>
                    <div style={styles.reportDetailValue}>{averageCostValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م</div>
                </div>
                <div style={{...styles.reportDetailCard, borderRightColor: '#9b59b6'}}>
                    <div style={styles.reportDetailLabel}>نسبة التحصيل</div>
                    <div style={styles.reportDetailValue}>{collectionRateValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
                </div>
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>الإيرادات حسب القسم</h4>
                {revenueData.some(revenue => revenue > 0) ? (
                    <BarChartComponent
                        labels={specialtyLabels}
                        data={revenueData}
                        title="الإيرادات حسب القسم"
                        backgroundColors={DOCTOR_COLORS.slice(0, specialtyLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للإيرادات حسب القسم في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>الإيرادات الشهرية</h4>
                {monthlyRevenueData.some(revenue => revenue > 0) ? (
                    <BarChartComponent
                        labels={monthlyRevenueLabels}
                        data={monthlyRevenueData}
                        title="اتجاهات الإيرادات الشهرية"
                        backgroundColors={DOCTOR_COLORS.slice(0, monthlyRevenueLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات للإيرادات الشهرية في هذه الفترة.</p>
                )}
            </div>
        </div>
    );
};

// New: Patient Satisfaction Report Display Component
const PatientSatisfactionReportDisplay: React.FC<{ report: PatientSatisfactionReport; isMobileView: boolean }> = ({ report, isMobileView }) => {
    // Chart Data for Rating Distribution
    const ratingLabels = (report.ratingDistribution ?? []).map(item => `${item.rating} نجوم`);
    const ratingData = (report.ratingDistribution ?? []).map(item => item.count);
    const ratingColors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745', '#0056b3']; // Danger, Warning, Info, Success, Brand

    // Chart Data for Satisfaction by Specialty
    const specialtyLabels = (report.satisfactionBySpecialty ?? []).map(item => item.specialty);
    const specialtyAvgRatings = (report.satisfactionBySpecialty ?? []).map(item => item.averageRating);
    const specialtyCount = (report.satisfactionBySpecialty ?? []).map(item => item.count);

    // Chart Data for Satisfaction by Doctor
    const doctorNames = (report.satisfactionByDoctor ?? []).map(item => item.doctorName);
    const doctorAvgRatings = (report.satisfactionByDoctor ?? []).map(item => item.averageRating);
    const doctorColors = (report.satisfactionByDoctor ?? []).map(item => item.color);

    const hasRatings = ratingData.some(count => count > 0);
    const hasSpecialtyRatings = specialtyAvgRatings.some(rating => rating > 0);
    const hasDoctorRatings = doctorAvgRatings.some(rating => rating > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.reportDetailsGrid}>
                <div style={{...styles.reportDetailCard, borderRightColor: brandColor}}>
                    <div style={styles.reportDetailLabel}>متوسط تقييم الرضا</div>
                    <div style={styles.reportDetailValue}>{(report.averageRating ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / 5</div>
                </div>
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>توزيع تقييمات الرضا</h4>
                {hasRatings ? (
                    <PieChartComponent
                        labels={ratingLabels}
                        data={ratingData}
                        title="توزيع تقييمات رضا المرضى"
                        backgroundColors={ratingColors.slice(0, ratingLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لتقييمات الرضا في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>متوسط الرضا حسب القسم</h4>
                {hasSpecialtyRatings ? (
                    <BarChartComponent
                        labels={specialtyLabels}
                        data={specialtyAvgRatings}
                        title="متوسط تقييم الرضا حسب القسم"
                        backgroundColors={DOCTOR_COLORS.slice(0, specialtyLabels.length)}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لمتوسط الرضا حسب القسم في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>متوسط الرضا حسب الطبيب</h4>
                {hasDoctorRatings ? (
                    <BarChartComponent
                        labels={doctorNames}
                        data={doctorAvgRatings}
                        title="متوسط تقييم الرضا حسب الطبيب"
                        backgroundColors={doctorColors}
                    />
                ) : (
                    <p style={styles.emptyStateText}>لا توجد بيانات لمتوسط الرضا حسب الطبيب في هذه الفترة.</p>
                )}
            </div>

            <div style={styles.reportSection}>
                <h4 style={styles.reportSubHeader}>ملاحظات المرضى البارزة</h4>
                {(report.feedbackHighlights ?? []).length > 0 ? (
                    <ul style={{ ...styles.list, paddingInlineStart: '0', display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr', gap: '15px' }}>
                        {(report.feedbackHighlights ?? []).map((fb, index) => (
                            <li key={index} style={{
                                ...styles.listItem,
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                backgroundColor: lightBackground,
                                padding: '15px',
                                borderRadius: '8px',
                                borderRight: `5px solid ${fb.rating >= 4 ? successColor : dangerColor}`
                            }}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <span style={styles.listItemName}>{fb.patientName}</span>
                                    <span style={{fontSize: '14px', color: lightTextColor}}>{new Date(fb.date).toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div style={{...styles.listItemDetails, marginTop: '10px'}}>{fb.feedback}</div>
                                <div style={{marginTop: '10px', fontWeight: 'bold', color: fb.rating >= 4 ? successColor : dangerColor}}>{fb.rating} / 5 نجوم</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد ملاحظات من المرضى في هذه الفترة.</p>
                )}
            </div>
        </div>
    );
};