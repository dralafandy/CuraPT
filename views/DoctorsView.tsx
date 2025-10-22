import React from 'react';
import { Doctor } from '../types';
import { styles } from '../styles';
import { getSpecialtyName } from '../utils';

const DoctorCard: React.FC<{
    doctor: Doctor;
    onEdit: (doctor: Doctor) => void;
    onDelete: (doctorId: string) => void;
    onViewSchedule: (doctor: Doctor) => void;
}> = ({ doctor, onEdit, onDelete, onViewSchedule }) => {
    const cardStyle = {
        ...styles.doctorCard,
        borderTopColor: doctor.color || '#ccc',
    };
    
    return (
        <div style={cardStyle}>
            <h3 style={styles.doctorName}>{doctor.name}</h3>
            <p style={styles.doctorSpecialty}>{getSpecialtyName(doctor.specialty)}</p>
            <div style={styles.doctorContact}>
                <span>📞 {doctor.phone || 'غير متوفر'}</span>
                <span>✉️ {doctor.email || 'غير متوفر'}</span>
            </div>
            <div style={styles.doctorActions}>
                 <button style={{...styles.button, ...styles.buttonInfo, padding: '8px 16px'}} onClick={() => onViewSchedule(doctor)}>عرض الجدول</button>
                 <button style={{...styles.button, ...styles.buttonSecondary, padding: '8px 16px'}} onClick={() => onEdit(doctor)}>تعديل</button>
                 <button style={{...styles.button, backgroundColor: '#dc3545', color: 'white', padding: '8px 16px'}} onClick={() => onDelete(doctor.id)}>حذف</button>
            </div>
        </div>
    );
};

export const DoctorsView: React.FC<{
    doctors: Doctor[];
    onAddDoctor: () => void;
    onEditDoctor: (doctor: Doctor) => void;
    onDeleteDoctor: (doctorId: string) => void;
    onViewSchedule: (doctor: Doctor) => void;
    isMobileView: boolean;
}> = ({ doctors, onAddDoctor, onEditDoctor, onDeleteDoctor, onViewSchedule, isMobileView }) => {
    const viewHeaderStyle = isMobileView ? {...styles.viewHeader, ...styles.viewHeaderMobile} : styles.viewHeader;
    const addButtonStyle = isMobileView ? {...styles.addButton, width: '100%'} : styles.addButton;
    const doctorGridStyle = isMobileView ? {...styles.patientGrid, ...styles.patientGridMobile} : styles.patientGrid;

    return (
         <>
            <div style={viewHeaderStyle}>
                <h1 style={styles.viewTitle}>الأطباء</h1>
                <div style={styles.viewHeaderActions}>
                     <button style={addButtonStyle} onClick={onAddDoctor}>
                        <span>&#43;</span> إضافة طبيب
                    </button>
                </div>
            </div>
            {doctors.length > 0 ? (
                 <div style={doctorGridStyle}>
                    {doctors.map(d => (
                        <DoctorCard 
                            key={d.id} 
                            doctor={d} 
                            onEdit={onEditDoctor} 
                            onDelete={onDeleteDoctor}
                            onViewSchedule={onViewSchedule}
                        />
                    ))}
                </div>
            ) : (
                 <div style={styles.emptyState}>
                    <p style={styles.emptyStateText}>لا يوجد أطباء حتى الآن. ابدأ بإضافة طبيب جديد.</p>
                </div>
            )}
        </>
    );
};