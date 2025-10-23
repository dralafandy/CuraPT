import React, { useState } from 'react';
import { PatientSummaryReport, TreatmentLog, Appointment } from '../types';
import { styles, brandColor, successColor, dangerColor, infoColor, lightTextColor, lightBorder } from '../styles'; // Import lightBorder
import { calculateAge, getSpecialtyName } from '../utils';

interface PatientSummaryReportDisplayProps {
    report: PatientSummaryReport;
    isMobileView: boolean;
}

export const PatientSummaryReportDisplay: React.FC<PatientSummaryReportDisplayProps> = ({ report, isMobileView }) => {
    const {
        patient,
        totalAppointments,
        completedAppointments,
        canceledAppointments,
        totalBilled,
        totalPaid,
        totalOutstanding,
        averageSatisfactionRating,
        appointmentsDetails,
        treatmentLogsDetails,
    } = report;

    const [showAllAppointments, setShowAllAppointments] = useState(false);
    const [showAllTreatmentLogs, setShowAllTreatmentLogs] = useState(false);

    const displayedAppointments = showAllAppointments ? appointmentsDetails : appointmentsDetails.slice(0, 5);
    const displayedTreatmentLogs = showAllTreatmentLogs ? treatmentLogsDetails : treatmentLogsDetails.slice(0, 5);

    const patientDetailsGridStyle = isMobileView 
        ? {...styles.patientDetailsGrid, ...styles.patientDetailsGridMobile} 
        : styles.patientDetailsGrid;

    const contactGridStyle = isMobileView
        ? {...styles.patientContactGrid, ...styles.patientContactGridMobile}
        : styles.patientContactGrid;

    const statusMap = {
        scheduled: { text: 'مجدول', style: styles.statusScheduled, color: '#ffc107' },
        completed: { text: 'مكتمل', style: styles.statusCompleted, color: '#28a745' },
        canceled: { text: 'ملغي', style: styles.statusCanceled, color: '#dc3545' }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Patient Demographics */}
            <div style={styles.patientReportSection}>
                <h3 style={styles.patientReportHeader}>البيانات الشخصية</h3>
                <div style={patientDetailsGridStyle}>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>تاريخ التسجيل:</span> {new Date(patient.createdAt).toLocaleDateString('ar-EG')}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>تاريخ الميلاد:</span> {new Date(patient.dob).toLocaleDateString('ar-EG')}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>العمر:</span> {calculateAge(patient.dob)} سنة</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>الجنس:</span> {patient.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>الطول:</span> {patient.height} سم</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>الوزن:</span> {patient.weight} كجم</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>القسم الأساسي:</span> {getSpecialtyName(patient.primaryCare)}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>الشكوى الرئيسية:</span> {patient.complaint}</div>
                </div>
                <div style={{ ...contactGridStyle, marginTop: '20px', borderTop: `1px solid ${lightBorder}`, paddingTop: '15px' }}>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>📞 الهاتف:</span> {patient.phone || 'لا يوجد'}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>✉️ البريد:</span> {patient.email || 'لا يوجد'}</div>
                    <div style={{...styles.detailItem, ...styles.contactAddress}}><span style={styles.detailLabel}>🏠 العنوان:</span> {patient.address || 'لا يوجد'}</div>
                </div>
                <div style={{ ...styles.notesSection, marginTop: '20px' }}><span style={styles.detailLabel}>التاريخ الطبي:</span> {patient.medicalHistory || 'لا يوجد'}</div>
                <div style={styles.notesSection}><span style={styles.detailLabel}>ملاحظات:</span> {patient.notes || 'لا يوجد'}</div>
            </div>

            {/* Overview Stats */}
            <div style={styles.patientReportSection}>
                <h3 style={styles.patientReportHeader}>ملخص الإحصائيات</h3>
                <div style={styles.patientReportDetailGrid}>
                    <div style={styles.patientReportStatCard}>
                        <div style={styles.reportDetailLabel}>إجمالي المواعيد</div>
                        <div style={styles.reportDetailValue}>{totalAppointments}</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: successColor}}>
                        <div style={styles.reportDetailLabel}>مواعيد مكتملة</div>
                        <div style={styles.reportDetailValue}>{completedAppointments}</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: dangerColor}}>
                        <div style={styles.reportDetailLabel}>مواعيد ملغاة</div>
                        <div style={styles.reportDetailValue}>{canceledAppointments}</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: brandColor}}>
                        <div style={styles.reportDetailLabel}>إجمالي الفواتير</div>
                        <div style={styles.reportDetailValue}>{totalBilled.toLocaleString()} ج.م</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: infoColor}}>
                        <div style={styles.reportDetailLabel}>إجمالي المدفوعات</div>
                        <div style={styles.reportDetailValue}>{totalPaid.toLocaleString()} ج.م</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: dangerColor}}>
                        <div style={styles.reportDetailLabel}>إجمالي المستحق</div>
                        <div style={styles.reportDetailValue}>{totalOutstanding.toLocaleString()} ج.م</div>
                    </div>
                    <div style={{...styles.patientReportStatCard, borderRightColor: (averageSatisfactionRating ?? 0) >= 4 ? successColor : (averageSatisfactionRating ?? 0) >= 3 ? infoColor : dangerColor}}>
                        <div style={styles.reportDetailLabel}>متوسط رضا المريض</div>
                        <div style={styles.reportDetailValue}>
                            {averageSatisfactionRating !== null ? averageSatisfactionRating.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'لا يوجد'} / 5
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments Details */}
            <div style={styles.patientReportSection}>
                <h3 style={styles.patientReportHeader}>تفاصيل المواعيد ({appointmentsDetails.length})</h3>
                {appointmentsDetails.length > 0 ? (
                    <>
                        <ul style={styles.patientHistoryList}>
                            {displayedAppointments.map((app, index) => (
                                <li key={index} style={{
                                    ...styles.historyItem, 
                                    borderRight: `5px solid ${app.doctorColor || '#ccc'}`
                                }}>
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <span style={styles.listItemName}>{new Date(app.date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        <span style={{...statusMap[app.status].style}}>{statusMap[app.status].text}</span>
                                    </div>
                                    <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                        <span style={{fontWeight: 'bold', color: lightTextColor}}>السبب:</span> {app.reason}
                                    </div>
                                    <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                        <span style={{fontWeight: 'bold', color: lightTextColor}}>مع الطبيب:</span> د. {app.doctorName}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {appointmentsDetails.length > 5 && (
                            <button
                                style={styles.toggleHistoryButton}
                                onClick={() => setShowAllAppointments(!showAllAppointments)}
                            >
                                {showAllAppointments ? 'إخفاء المواعيد الإضافية' : `عرض جميع المواعيد (${appointmentsDetails.length})`}
                            </button>
                        )}
                    </>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد مواعيد لهذا المريض.</p>
                )}
            </div>

            {/* Treatment Logs Details */}
            <div style={styles.patientReportSection}>
                <h3 style={styles.patientReportHeader}>سجل العلاج ({treatmentLogsDetails.length})</h3>
                {treatmentLogsDetails.length > 0 ? (
                    <>
                        <ul style={styles.patientHistoryList}>
                            {displayedTreatmentLogs.map((log, index) => (
                                <li key={index} style={{
                                    ...styles.historyItem, 
                                    borderRight: `5px solid ${log.paid ? successColor : dangerColor}`
                                }}>
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <span style={styles.listItemName}>{new Date(log.date).toLocaleDateString('ar-EG')}</span>
                                        <span style={{fontWeight: 'bold'}}>التكلفة: {log.cost.toLocaleString()} ج.م</span>
                                    </div>
                                    <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                        <span style={{fontWeight: 'bold', color: lightTextColor}}>العلاج:</span> {log.treatment}
                                    </div>
                                    <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                        <span style={{fontWeight: 'bold', color: lightTextColor}}>النتيجة:</span> {log.outcome}
                                    </div>
                                    {log.weight !== undefined && (
                                        <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                            <span style={{fontWeight: 'bold', color: lightTextColor}}>الوزن:</span> {log.weight} كجم
                                        </div>
                                    )}
                                    {log.status !== undefined && (
                                        <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                            <span style={{fontWeight: 'bold', color: lightTextColor}}>الحالة:</span> {log.status}
                                        </div>
                                    )}
                                    {log.satisfactionRating !== undefined && (
                                        <div style={{...styles.listItemDetails, marginTop: '5px', color: (log.satisfactionRating ?? 0) >= 4 ? successColor : (log.satisfactionRating ?? 0) >= 3 ? infoColor : dangerColor}}>
                                            <span style={{fontWeight: 'bold'}}>تقييم الرضا:</span> {log.satisfactionRating} / 5 نجوم
                                        </div>
                                    )}
                                    {log.feedback && (
                                        <div style={{...styles.listItemDetails, marginTop: '5px'}}>
                                            <span style={{fontWeight: 'bold', color: lightTextColor}}>ملاحظات:</span> {log.feedback}
                                        </div>
                                    )}
                                    <div style={{...styles.listItemDetails, marginTop: '10px', alignSelf: 'flex-end'}}>
                                        <span style={{...styles.paymentStatus, ...(log.paid ? styles.paymentStatusPaid : styles.paymentStatusUnpaid)}}>
                                            {log.paid ? 'مدفوع' : 'غير مدفوع'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {treatmentLogsDetails.length > 5 && (
                            <button
                                style={styles.toggleHistoryButton}
                                onClick={() => setShowAllTreatmentLogs(!showAllTreatmentLogs)}
                            >
                                {showAllTreatmentLogs ? 'إخفاء السجل الكامل' : `عرض الكل (${treatmentLogsDetails.length} سجلات)`}
                            </button>
                        )}
                    </>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد سجلات علاجية لهذا المريض.</p>
                )}
            </div>
        </div>
    );
};