import React from 'react';
import { Patient } from '../types';
import { styles } from '../styles';

export const PatientForm: React.FC<{
    onSubmit: (patient: Omit<Patient, 'id' | 'treatmentHistory' | 'createdAt'> | Patient) => void;
    onCancel: () => void;
    initialData?: Patient | null;
    isMobileView: boolean;
}> = ({ onSubmit, onCancel, initialData, isMobileView }) => {
    const [formData, setFormData] = React.useState({
        name: initialData?.name || '',
        complaint: initialData?.complaint || '',
        dob: initialData?.dob || '',
        gender: initialData?.gender || 'male',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        primaryCare: initialData?.primaryCare || 'physical_therapy',
        height: initialData?.height?.toString() || '',
        weight: initialData?.weight?.toString() || '',
        medicalHistory: initialData?.medicalHistory || '',
        notes: initialData?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patientData = {
            ...initialData,
            ...formData,
            height: Number(formData.height) || 0,
            weight: Number(formData.weight) || 0,
        };
        onSubmit(patientData as Patient);
    };
    
    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;
    const formRowStyle = isMobileView ? {...styles.formRow, ...styles.formRowMobile} : styles.formRow;


    return (
        <div style={styles.modalOverlay}>
            <div style={modalContentStyle}>
                <button style={styles.closeButton} onClick={onCancel}>&times;</button>
                <h2 style={styles.modalTitle}>{initialData ? 'تعديل بيانات المريض' : 'إضافة مريض جديد'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="name">الاسم الكامل</label>
                        <input style={styles.input} type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="complaint">الشكوى الرئيسية</label>
                        <input style={styles.input} type="text" id="complaint" name="complaint" value={formData.complaint} onChange={handleChange} required />
                    </div>
                    <div style={formRowStyle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="dob">تاريخ الميلاد</label>
                            <input style={styles.input} type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="gender">الجنس</label>
                            <select style={styles.select} id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="male">ذكر</option>
                                <option value="female">أنثى</option>
                            </select>
                        </div>
                    </div>
                    <div style={formRowStyle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="phone">رقم الهاتف</label>
                            <input style={styles.input} type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="email">البريد الإلكتروني</label>
                            <input style={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>
                     <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="address">العنوان</label>
                        <input style={styles.input} type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                     <div style={formRowStyle}>
                         <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="height">الطول (سم)</label>
                            <input style={styles.input} type="number" id="height" name="height" value={formData.height} onChange={handleChange} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="weight">الوزن (كجم)</label>
                            <input style={styles.input} type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="primaryCare">القسم</label>
                        <select style={styles.select} id="primaryCare" name="primaryCare" value={formData.primaryCare} onChange={handleChange}>
                            <option value="physical_therapy">علاج طبيعي</option>
                            <option value="nutrition">تغذية</option>
                            {/* FIX: Added 'general' option to align with types. */}
                            <option value="general">عام</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="medicalHistory">التاريخ الطبي</label>
                        <textarea style={styles.textarea} id="medicalHistory" name="medicalHistory" value={formData.medicalHistory} onChange={handleChange}></textarea>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="notes">ملاحظات</label>
                        <textarea style={styles.textarea} id="notes" name="notes" value={formData.notes} onChange={handleChange}></textarea>
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