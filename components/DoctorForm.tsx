import React, { useState } from 'react';
import { Doctor } from '../types';
import { styles } from '../styles';
import { DOCTOR_COLORS } from '../utils';

export const DoctorForm: React.FC<{
    onSubmit: (doctor: Omit<Doctor, 'id'> | Doctor) => void;
    onCancel: () => void;
    initialData?: Doctor | null;
    isMobileView: boolean;
}> = ({ onSubmit, onCancel, initialData, isMobileView }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        specialty: initialData?.specialty || 'general',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        color: initialData?.color || DOCTOR_COLORS[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...initialData, ...formData });
    };

    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;
    const formRowStyle = isMobileView ? {...styles.formRow, ...styles.formRowMobile} : styles.formRow;

    return (
        <div style={styles.modalOverlay}>
            <div style={modalContentStyle}>
                <button style={styles.closeButton} onClick={onCancel}>&times;</button>
                <h2 style={styles.modalTitle}>{initialData ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="name">اسم الطبيب</label>
                        <input style={styles.input} type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div style={formRowStyle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="specialty">التخصص</label>
                            <select style={styles.select} id="specialty" name="specialty" value={formData.specialty} onChange={handleChange}>
                                <option value="general">عام</option>
                                <option value="physical_therapy">علاج طبيعي</option>
                                <option value="nutrition">تغذية</option>
                            </select>
                        </div>
                         <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="color">لون الطبيب</label>
                            <input style={styles.colorInput} type="color" id="color" name="color" value={formData.color} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="phone">رقم الهاتف</label>
                        <input style={styles.input} type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="email">البريد الإلكتروني</label>
                        <input style={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div style={styles.formActions}>
                        <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCancel}>إلغاء</button>
                        <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};