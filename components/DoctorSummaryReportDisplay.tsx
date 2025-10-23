import React, { useState } from 'react';
import { DoctorSummaryReport } from '../types';
import { styles, brandColor, successColor, dangerColor, infoColor, lightTextColor, lightBorder } from '../styles';
import { getSpecialtyName } from '../utils';

interface DoctorSummaryReportDisplayProps {
    report: DoctorSummaryReport;
    isMobileView: boolean;
}

export const DoctorSummaryReportDisplay: React.FC<DoctorSummaryReportDisplayProps> = ({ report, isMobileView }) => {
    const {
        doctor,
        totalAppointments,
        scheduledAppointments,
        completedAppointments,
        canceledAppointments,
        averageSatisfactionRating,
        recentAppointments,
        treatedPatients,
    } = report;

    const [showAllRecentAppointments, setShowAllRecentAppointments] = useState(false);
    const [showAllTreatedPatients, setShowAllTreatedPatients] = useState(false);

    const displayedRecentAppointments = showAllRecentAppointments ? recentAppointments : recentAppointments.slice(0, 5);
    const displayedTreatedPatients = showAllTreatedPatients ? treatedPatients : treatedPatients.slice(0, 5);

    const doctorDetailsGridStyle = isMobileView
        ? { ...styles.patientDetailsGrid, ...styles.patientDetailsGridMobile } // Reusing patient styles for consistency
        : styles.patientDetailsGrid;

    const statusMap = {
        scheduled: { text: 'مجدول', style: styles.statusScheduled, color: '#ffc107' },
        completed: { text: 'مكتمل', style: styles.statusCompleted, color: '#28a745' },
        canceled: { text: 'ملغي', style: styles.statusCanceled, color: '#dc3545' }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Doctor Details */}
            <div style={styles.doctorReportSection}>
                <h3 style={styles.doctorReportHeader}>بيانات الطبيب</h3>
                <div style={{ ...doctorDetailsGridStyle, gridTemplateColumns: isMobileView ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>الاسم:</span> {doctor.name}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>التخصص:</span> {getSpecialtyName(doctor.specialty)}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>📞 الهاتف:</span> {doctor.phone || 'لا يوجد'}</div>
                    <div style={styles.detailItem}><span style={styles.detailLabel}>✉️ البريد:</span> {doctor.email || 'لا يوجد'}</div>
                    <div style={{...styles.detailItem, gridColumn: isMobileView ? '1' : 'span 2'}}><span style={styles.detailLabel}>لون التعريف:</span> <span style={{display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: doctor.color, verticalAlign: 'middle', marginInlineStart: '10px'}}></span> {doctor.color}</div>
                </div>
            </div>

            {/* Overview Stats */}
            <div style={styles.doctorReportSection}>
                <h3 style={styles.doctorReportHeader}>ملخص الإحصائيات</h3>
                <div style={styles.doctorReportDetailGrid}>
                    <div style={styles.doctorReportStatCard}>
                        <div style={styles.reportDetailLabel}>إجمالي المواعيد</div>
                        <div style={styles.reportDetailValue}>{totalAppointments}</div>
                    </div>
                    <div style={{ ...styles.doctorReportStatCard, borderRightColor: '#ffc107' }}>
                        <div style={styles.reportDetailLabel}>مواعيد مجدولة</div>
                        <div style={styles.reportDetailValue}>{scheduledAppointments}</div>
                    </div>
                    <div style={{ ...styles.doctorReportStatCard, borderRightColor: successColor }}>
                        <div style={styles.reportDetailLabel}>مواعيد مكتملة</div>
                        <div style={styles.reportDetailValue}>{completedAppointments}</div>
                    </div>
                    <div style={{ ...styles.doctorReportStatCard, borderRightColor: dangerColor }}>
                        <div style={styles.reportDetailLabel}>مواعيد ملغاة</div>
                        <div style={styles.reportDetailValue}>{canceledAppointments}</div>
                    </div>
                    <div style={{ ...styles.doctorReportStatCard, borderRightColor: (averageSatisfactionRating ?? 0) >= 4 ? successColor : (averageSatisfactionRating ?? 0) >= 3 ? infoColor : dangerColor }}>
                        <div style={styles.reportDetailLabel}>متوسط رضا المرضى</div>
                        <div style={styles.reportDetailValue}>
                            {averageSatisfactionRating !== null ? averageSatisfactionRating.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'لا يوجد'} / 5
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div style={styles.doctorReportSection}>
                <h3 style={styles.doctorReportHeader}>أحدث المواعيد ({recentAppointments.length})</h3>
                {recentAppointments.length > 0 ? (
                    <>
                        <ul style={styles.doctorHistoryList}>
                            {displayedRecentAppointments.map((app, index) => (
                                <li key={index} style={{
                                    ...styles.historyItem, // Reusing existing history item style
                                    borderRight: `5px solid ${doctor.color || '#ccc'}` // Use doctor's color for consistency
                                }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={styles.listItemName}>{new Date(app.date).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        <span style={{ ...statusMap[app.status].style }}>{statusMap[app.status].text}</span>
                                    </div>
                                    <div style={{ ...styles.listItemDetails, marginTop: '5px' }}>
                                        <span style={{ fontWeight: 'bold', color: lightTextColor }}>المريض:</span> {app.patientName}
                                    </div>
                                    <div style={{ ...styles.listItemDetails, marginTop: '5px' }}>
                                        <span style={{ fontWeight: 'bold', color: lightTextColor }}>السبب:</span> {app.reason}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {recentAppointments.length > 5 && (
                            <button
                                style={styles.toggleHistoryButton}
                                onClick={() => setShowAllRecentAppointments(!showAllRecentAppointments)}
                            >
                                {showAllRecentAppointments ? 'إخفاء المواعيد الإضافية' : `عرض جميع المواعيد (${recentAppointments.length})`}
                            </button>
                        )}
                    </>
                ) : (
                    <p style={styles.emptyStateText}>لا توجد مواعيد حديثة لهذا الطبيب.</p>
                )}
            </div>

            {/* Treated Patients List */}
            <div style={styles.doctorReportSection}>
                <h3 style={styles.doctorReportHeader}>المرضى الذين عالجهم ({treatedPatients.length})</h3>
                {treatedPatients.length > 0 ? (
                    <>
                        <ul style={styles.doctorHistoryList}>
                            {displayedTreatedPatients.map((patient, index) => (
                                <li key={patient.id} style={{
                                    ...styles.historyItem,
                                    borderRight: `5px solid ${infoColor}` // Neutral color for patient list
                                }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={styles.listItemName}>{patient.name}</span>
                                        <span style={{ fontSize: '14px', color: lightTextColor }}>{patient.count} مواعيد</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {treatedPatients.length > 5 && (
                            <button
                                style={styles.toggleHistoryButton}
                                onClick={() => setShowAllTreatedPatients(!showAllTreatedPatients)}
                            >
                                {showAllTreatedPatients ? 'إخفاء المرضى الإضافيين' : `عرض جميع المرضى (${treatedPatients.length})`}
                            </button>
                        )}
                    </>
                ) : (
                    <p style={styles.emptyStateText}>لم يعالج هذا الطبيب أي مرضى بعد.</p>
                )}
            </div>
        </div>
    );
};