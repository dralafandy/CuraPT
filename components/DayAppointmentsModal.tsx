import React from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles } from '../styles';

export const DayAppointmentsModal: React.FC<{
    date: string;
    appointments: Appointment[];
    patients: Patient[];
    doctors: Doctor[];
    onClose: () => void;
    isMobileView: boolean;
}> = ({ date, appointments, patients, doctors, onClose, isMobileView }) => {
    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'مريض محذوف';
    
    const dailyAppointments = appointments
        .filter(app => app.date.startsWith(date))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const formattedDate = new Date(date).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                <h2 style={styles.modalTitle}>مواعيد يوم {formattedDate}</h2>
                {dailyAppointments.length > 0 ? (
                    <ul style={styles.dayModalList}>
                        {dailyAppointments.map(app => (
                            <li key={app.id} style={styles.dayModalItem}>
                                <div style={styles.dayModalTime}>{new Date(app.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                                <div style={styles.dayModalPatient}>{getPatientName(app.patientId)}</div>
                                <div style={styles.dayModalReason}>{app.reason}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد مواعيد في هذا اليوم.</p>
                )}
            </div>
        </div>
    );
};