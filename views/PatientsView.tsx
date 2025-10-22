import React, { useState, useMemo } from 'react';
import { Patient, TreatmentLog } from '../types';
import { styles, brandColor, dangerColor, successColor } from '../styles';
// FIX: Import getSpecialtyName to correctly display all primary care types.
import { calculateAge, getSpecialtyName } from '../utils';

const PatientCard: React.FC<{
    patient: Patient;
    onEdit: (patient: Patient) => void;
    onDelete: (patientId: string) => void;
    onAddLog: (patient: Patient) => void;
    onUpdateLogPayment: (patientId: string, logId: string, paid: boolean) => void;
    isMobileView: boolean;
}> = ({ patient, onEdit, onDelete, onAddLog, onUpdateLogPayment, isMobileView }) => {
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

    const sortedHistory = [...patient.treatmentHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const displayedHistory = isHistoryExpanded ? sortedHistory : sortedHistory.slice(0, 3);

    const financialSummary = useMemo(() => {
        const totalBilled = patient.treatmentHistory.reduce((sum, log) => sum + (log.cost || 0), 0);
        const totalDue = patient.treatmentHistory.filter(log => !log.paid).reduce((sum, log) => sum + (log.cost || 0), 0);
        return { totalBilled, totalDue };
    }, [patient.treatmentHistory]);

    const detailsGridStyle = isMobileView 
        ? {...styles.patientDetailsGrid, ...styles.patientDetailsGridMobile} 
        : styles.patientDetailsGrid;

    const contactGridStyle = isMobileView
        ? {...styles.patientContactGrid, ...styles.patientContactGridMobile}
        : styles.patientContactGrid;

    return (
        <div style={styles.patientCard}>
            <div style={styles.patientCardHeader}>
                <div>
                    <h3 style={styles.patientName}>{patient.name}</h3>
                    <p style={styles.patientComplaint}>{patient.complaint}</p>
                </div>
                <div style={styles.patientActions}>
                    <button style={styles.iconButton} title="إضافة سجل علاجي" onClick={() => onAddLog(patient)}>➕</button>
                    <button style={styles.iconButton} title="تعديل" onClick={() => onEdit(patient)}>✏️</button>
                    <button style={styles.iconButton} title="حذف" onClick={() => onDelete(patient.id)}>🗑️</button>
                </div>
            </div>
            <div style={detailsGridStyle}>
                <div style={styles.detailItem}><span style={styles.detailLabel}>العمر:</span> {calculateAge(patient.dob)}</div>
                <div style={styles.detailItem}><span style={styles.detailLabel}>الجنس:</span> {patient.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                <div style={styles.detailItem}><span style={styles.detailLabel}>الطول:</span> {patient.height} سم</div>
                <div style={styles.detailItem}><span style={styles.detailLabel}>الوزن:</span> {patient.weight} كجم</div>
                {/* FIX: Use getSpecialtyName to correctly display the patient's primary care department. */}
                <div style={styles.detailItem}><span style={styles.detailLabel}>القسم:</span> {getSpecialtyName(patient.primaryCare)}</div>
            </div>
            <div style={styles.financialSummary}>
                <div>
                    <div style={styles.financialLabel}>إجمالي الفواتير</div>
                    <div style={{...styles.financialValue, color: brandColor }}>{financialSummary.totalBilled.toLocaleString()} ج.م</div>
                </div>
                 <div>
                    <div style={styles.financialLabel}>المبلغ المستحق</div>
                    <div style={{...styles.financialValue, color: financialSummary.totalDue > 0 ? dangerColor : successColor }}>
                        {financialSummary.totalDue.toLocaleString()} ج.م
                    </div>
                </div>
            </div>
            <div style={contactGridStyle}>
                <div style={styles.detailItem}><span style={styles.detailLabel}>📞 الهاتف:</span> {patient.phone || 'لا يوجد'}</div>
                <div style={styles.detailItem}><span style={styles.detailLabel}>✉️ البريد:</span> {patient.email || 'لا يوجد'}</div>
                <div style={{...styles.detailItem, ...styles.contactAddress}}><span style={styles.detailLabel}>🏠 العنوان:</span> {patient.address || 'لا يوجد'}</div>
            </div>
            <div style={{...styles.notesSection, gridColumn: '1 / -1'}}><span style={styles.detailLabel}>التاريخ الطبي:</span> {patient.medicalHistory || 'لا يوجد'}</div>
            <div style={styles.notesSection}><span style={styles.detailLabel}>ملاحظات:</span> {patient.notes || 'لا يوجد'}</div>
            <div style={styles.treatmentSection}>
                <h4 style={styles.treatmentHeader}>السجل العلاجي</h4>
                {sortedHistory.length > 0 ? (
                    <>
                        {displayedHistory.map((log) => (
                             <div key={log.id} style={styles.treatmentLog}>
                                <p style={styles.logDate}>{log.date}</p>
                                <div style={styles.logDetails}>
                                    {log.weight && <div><span style={styles.detailLabel}>الوزن:</span> {log.weight} كجم</div>}
                                    {log.status && <div><span style={styles.detailLabel}>الحالة:</span> {log.status}</div>}
                                    <div><span style={styles.detailLabel}>الإجراء:</span> {log.treatment}</div>
                                    <div><span style={styles.detailLabel}>النتيجة:</span> {log.outcome}</div>
                                </div>
                                <div style={styles.logFinancials}>
                                    <div style={{fontWeight: 'bold'}}>التكلفة: {log.cost.toLocaleString()} ج.م</div>
                                    {log.paid ? (
                                        <span style={{...styles.paymentStatus, ...styles.paymentStatusPaid}}>مدفوع</span>
                                    ) : (
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            <span style={{...styles.paymentStatus, ...styles.paymentStatusUnpaid}}>غير مدفوع</span>
                                            <button style={styles.markAsPaidButton} onClick={() => onUpdateLogPayment(patient.id, log.id, true)}>
                                                تحديد كمدفوع
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {sortedHistory.length > 3 && (
                            <button
                                style={styles.toggleHistoryButton}
                                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                            >
                                {isHistoryExpanded ? 'إخفاء السجل الكامل' : `عرض الكل (${sortedHistory.length} سجلات)`}
                            </button>
                        )}
                    </>
                ) : <p style={{fontSize: '14px', color: '#6c757d'}}>لا يوجد سجلات علاجية بعد.</p>}
            </div>
        </div>
    );
};

export const PatientsView: React.FC<{
    patients: Patient[];
    onAddPatient: () => void;
    onEditPatient: (patient: Patient) => void;
    onDeletePatient: (patientId: string) => void;
    onAddLog: (patient: Patient) => void;
    onUpdateLogPayment: (patientId: string, logId: string, paid: boolean) => void;
    isMobileView: boolean;
}> = ({ patients, onAddPatient, onEditPatient, onDeletePatient, onAddLog, onUpdateLogPayment, isMobileView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.complaint.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const viewHeaderStyle = isMobileView ? {...styles.viewHeader, ...styles.viewHeaderMobile} : styles.viewHeader;
    const viewHeaderActionsStyle = isMobileView ? {...styles.viewHeaderActions, ...styles.viewHeaderActionsMobile} : styles.viewHeaderActions;
    const searchInputStyle = isMobileView ? {...styles.searchInput, width: '100%'} : styles.searchInput;
    const addButtonStyle = isMobileView ? {...styles.addButton, width: '100%'} : styles.addButton;
    const patientGridStyle = isMobileView ? {...styles.patientGrid, ...styles.patientGridMobile} : styles.patientGrid;


    return (
        <>
            <div style={viewHeaderStyle}>
                <h1 style={styles.viewTitle}>قائمة المرضى</h1>
                <div style={viewHeaderActionsStyle}>
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو الشكوى..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button style={addButtonStyle} onClick={onAddPatient}>
                        <span>&#43;</span> إضافة مريض جديد
                    </button>
                </div>
            </div>
            {filteredPatients.length > 0 ? (
                 <div style={patientGridStyle}>
                    {filteredPatients.map(p => (
                        <PatientCard 
                            key={p.id} 
                            patient={p} 
                            onEdit={onEditPatient} 
                            onDelete={onDeletePatient}
                            onAddLog={onAddLog}
                            onUpdateLogPayment={onUpdateLogPayment}
                            isMobileView={isMobileView}
                        />
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <p style={styles.emptyStateText}>
                        {patients.length > 0 ? 'لم يتم العثور على مرضى يطابقون بحثك.' : 'لا يوجد مرضى حتى الآن. ابدأ بإضافة مريض جديد.'}
                    </p>
                </div>
            )}
        </>
    );
};