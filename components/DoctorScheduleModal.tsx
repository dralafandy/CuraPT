import React from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles } from '../styles';

export const DoctorScheduleModal: React.FC<{
    doctor: Doctor;
    appointments: Appointment[];
    patients: Patient[];
    onClose: () => void;
    isMobileView: boolean;
}> = ({ doctor, appointments, patients, onClose, isMobileView }) => {
    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'مريض محذوف';

    const doctorAppointments = React.useMemo(() => {
        return appointments
            .filter(app => app.doctorId === doctor.id && app.status === 'scheduled')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments, doctor.id]);

    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;
    const scheduleItemStyle = isMobileView ? {...styles.scheduleModalItem, ...styles.scheduleModalItemMobile} : styles.scheduleModalItem;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                <h2 style={styles.modalTitle}>جدول مواعيد د. {doctor.name}</h2>
                {doctorAppointments.length > 0 ? (
                    <ul style={styles.dayModalList}>
                        {doctorAppointments.map(app => (
                            <li key={app.id} style={scheduleItemStyle}>
                                <div style={styles.scheduleModalDateTime}>
                                    <div>{new Date(app.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                    <div style={{fontSize: '14px'}}>{new Date(app.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div style={styles.scheduleModalPatientInfo}>
                                    <div style={styles.dayModalPatient}>{getPatientName(app.patientId)}</div>
                                    <div style={styles.dayModalReason}>{app.reason}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد مواعيد مجدولة لهذا الطبيب.</p>
                )}
            </div>
        </div>
    );
};