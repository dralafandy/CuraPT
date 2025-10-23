import React, { useState } from 'react';
import { Patient, TreatmentLog } from '../types';
import { styles } from '../styles';

export const TreatmentLogForm: React.FC<{
    patient: Patient;
    onAddLog: (patientId: string, log: Omit<TreatmentLog, 'id'>) => void;
    onCancel: () => void;
    isMobileView: boolean;
}> = ({ patient, onAddLog, onCancel, isMobileView }) => {
<<<<<<< HEAD
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        treatment: '',
        outcome: '',
        cost: '',
        paid: false,
        weight: patient.primaryCare === 'nutrition' ? patient.weight : undefined,
        status: patient.primaryCare === 'physical_therapy' ? '' : undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
=======
    const [logData, setLogData] = useState<Omit<TreatmentLog, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        treatment: '',
        outcome: '',
        cost: 0,
        paid: false,
        weight: patient.primaryCare === 'nutrition' ? patient.weight : undefined,
        status: patient.primaryCare === 'physical_therapy' ? '' : undefined,
        satisfactionRating: undefined, // New: Default to undefined
        feedback: undefined, // New: Default to undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
        const { name, value } = e.target;
        setLogData(prev => ({...prev, [name]: value}));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setLogData(prev => ({...prev, [name]: checked}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddLog(patient.id, {
            ...logData,
            cost: Number(logData.cost) || 0,
<<<<<<< HEAD
=======
            satisfactionRating: logData.satisfactionRating ? Number(logData.satisfactionRating) : undefined,
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
        });
    };

    const modalContentStyle = isMobileView ? {...styles.modalContent, ...styles.modalContentMobile} : styles.modalContent;
    const formRowStyle = isMobileView ? {...styles.formRow, ...styles.formRowMobile} : styles.formRow;

    return (
        <div style={styles.modalOverlay}>
            <div style={modalContentStyle}>
                <button style={styles.closeButton} onClick={onCancel}>&times;</button>
                <h2 style={styles.modalTitle}>إضافة سجل علاجي لـ {patient.name}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="date">تاريخ الجلسة</label>
                        <input style={styles.input} type="date" id="date" name="date" value={logData.date} onChange={handleChange} required />
                    </div>
                    {patient.primaryCare === 'nutrition' && (
                         <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="weight">الوزن الحالي (كجم)</label>
                            <input style={styles.input} type="number" id="weight" name="weight" value={logData.weight || ''} onChange={handleChange} required />
                        </div>
                    )}
                     {patient.primaryCare === 'physical_therapy' && (
                         <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="status">الحالة</label>
                            <input style={styles.input} type="text" id="status" name="status" value={logData.status || ''} onChange={handleChange} placeholder="مثال: تحسن ملحوظ في نطاق الحركة" required />
                        </div>
                    )}
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="treatment">العلاج / الإجراء</label>
                        <textarea style={styles.textarea} id="treatment" name="treatment" value={logData.treatment} onChange={handleChange} required />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="outcome">النتيجة / التوصيات</label>
                        <textarea style={styles.textarea} id="outcome" name="outcome" value={logData.outcome} onChange={handleChange} required />
                    </div>
                     <div style={formRowStyle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="cost">تكلفة الجلسة</label>
<<<<<<< HEAD
                            <input style={styles.input} type="number" id="cost" name="cost" value={logData.cost} onChange={handleChange} placeholder="مثال: 350" required />
=======
                            <input style={styles.input} type="number" id="cost" name="cost" value={logData.cost || ''} onChange={handleChange} placeholder="مثال: 350" required />
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                        </div>
                        <div style={{...styles.formGroup, justifyContent: 'center'}}>
                             <div style={styles.formGroupHorizontal}>
                                <input type="checkbox" id="paid" name="paid" checked={logData.paid} onChange={handleCheckboxChange} style={{width: '20px', height: '20px'}}/>
                                <label style={styles.label} htmlFor="paid">تم الدفع</label>
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD
=======

                    {/* New: Satisfaction Rating and Feedback */}
                    <div style={formRowStyle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="satisfactionRating">تقييم الرضا (1-5)</label>
                            <select 
                                style={styles.select} 
                                id="satisfactionRating" 
                                name="satisfactionRating" 
                                value={logData.satisfactionRating || ''} 
                                onChange={handleChange}
                            >
                                <option value="">اختر تقييم...</option>
                                <option value="1">1 (غير راضٍ جداً)</option>
                                <option value="2">2 (غير راضٍ)</option>
                                <option value="3">3 (محايد)</option>
                                <option value="4">4 (راضٍ)</option>
                                <option value="5">5 (راضٍ جداً)</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label} htmlFor="feedback">ملاحظات المريض (اختياري)</label>
                            <textarea 
                                style={styles.textarea} 
                                id="feedback" 
                                name="feedback" 
                                value={logData.feedback || ''} 
                                onChange={handleChange} 
                                placeholder="اكتب أي ملاحظات هنا..."
                            ></textarea>
                        </div>
                    </div>
                    {/* End New Fields */}

>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                     <div style={styles.formActions}>
                        <button type="button" style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCancel}>إلغاء</button>
                        <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>إضافة سجل</button>
                    </div>
                </form>
            </div>
        </div>
    );
}