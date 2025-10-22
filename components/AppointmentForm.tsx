import React, { useState } from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles } from '../styles';
import { getSpecialtyName } from '../utils';

export const AppointmentForm: React.FC<{
    onSubmit: (appointment: Omit<Appointment, 'id' | 'status' | 'reminderSent'>) => void;
    onCancel: () => void;
    patients: Patient[];
    doctors: Doctor[];
    isMobileView: boolean;
}> = ({ onSubmit, onCancel, patients, doctors, isMobileView }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        reason: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId || !formData.date) {
            alert('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }
        onSubmit({ ...formData });
    };

    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;

    return (
        <div style={styles.modalOverlay}>
            <div style={modalContentStyle}>
                <button style={styles.closeButton} onClick={onCancel}>&times;</button>
                <h2 style={styles.modalTitle}>حجز موعد جديد</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="patientId">المريض</label>
                        <select style={styles.select} id="patientId" name="patientId" value={formData.patientId} onChange={handleChange} required>
                            <option value="" disabled>اختر مريض...</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="doctorId">الطبيب</label>
                        <select style={styles.select} id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                            <option value="" disabled>اختر طبيب...</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({getSpecialtyName(d.specialty)})</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="date">التاريخ والوقت</label>
                        <input style={styles.input} type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="reason">سبب الزيارة</label>
                        <textarea style={styles.textarea} id="reason" name="reason" value={formData.reason} onChange={handleChange} required></textarea>
                    </div>
                    <div style={styles.formActions}>
                        <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCancel}>إلغاء</button>
                        <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>حجز الموعد</button>
                    </div>
                </form>
            </div>
        </div>
    );
};