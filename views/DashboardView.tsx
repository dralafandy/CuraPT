import React from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles, successColor, dangerColor } from '../styles';

export const DashboardView: React.FC<{ 
    patients: Patient[]; 
    doctors: Doctor[]; 
    appointments: Appointment[];
    onBackup: () => void;
    onRestore: (jsonString: string) => void;
    reminderSettings: { leadTimeHours: number };
    onUpdateReminderSettings: (leadTimeHours: number) => void;
    isMobileView: boolean;
}> = ({ patients, doctors, appointments, onBackup, onRestore, reminderSettings, onUpdateReminderSettings, isMobileView }) => {
    const totalPatients = patients.length;
    const totalDoctors = doctors.length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const todaysAppointments = appointments.filter(a => {
        const appDate = new Date(a.date);
        appDate.setHours(0,0,0,0);
        return appDate.getTime() === today.getTime() && a.status === 'scheduled';
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    
    const allTreatmentLogs = patients.flatMap(p => p.treatmentHistory);
    
    const revenueToday = allTreatmentLogs
        .filter(log => log.date === todayStr && log.paid)
        .reduce((sum, log) => sum + (log.cost || 0), 0);

    const totalOutstanding = allTreatmentLogs
        .filter(log => !log.paid)
        .reduce((sum, log) => sum + (log.cost || 0), 0);

    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'N/A';
    
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                onRestore(text);
            }
            // Reset the input value to allow selecting the same file again
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    const upcomingAppointmentsForReminder = appointments.filter(a => {
        const appTime = new Date(a.date).getTime();
        const now = new Date().getTime();
        const leadTimeMs = reminderSettings.leadTimeHours * 60 * 60 * 1000;
        return a.status === 'scheduled' && appTime > now && (appTime - now) <= leadTimeMs;
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dashboardGridStyle = isMobileView ? {...styles.dashboardGrid, ...styles.dashboardGridMobile} : styles.dashboardGrid;
    const twoColumnGridStyle: React.CSSProperties = isMobileView 
        ? { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }
        : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };
    
    // FIX: Restructured the style definition to provide a contextual type to the mobile-specific style properties, resolving a TypeScript error where string literals were being widened to the `string` type.
    const dataManagementActionsStyle: React.CSSProperties = {
        ...styles.dataManagementActions,
        ...(isMobileView
            ? {
                  flexDirection: 'column',
                  alignItems: 'stretch',
              }
            : {}),
    };

    return (
        <>
            <div style={styles.viewHeader}>
                 <h1 style={styles.viewTitle}>لوحة التحكم الرئيسية</h1>
            </div>
            <div style={dashboardGridStyle}>
                <div style={styles.statCard}>
                    <h3 style={styles.statCardTitle}>إجمالي المرضى</h3>
                    <p style={styles.statCardValue}>{totalPatients}</p>
                </div>
                 <div style={{...styles.statCard, borderTopColor: '#ffc107'}}>
                    <h3 style={styles.statCardTitle}>مواعيد اليوم</h3>
                    <p style={styles.statCardValue}>{todaysAppointments.length}</p>
                </div>
                <div style={{...styles.statCard, borderTopColor: successColor}}>
                    <h3 style={styles.statCardTitle}>إيرادات اليوم</h3>
                    <p style={styles.statCardValue}>{revenueToday.toLocaleString()}</p>
                </div>
                 <div style={{...styles.statCard, borderTopColor: dangerColor}}>
                    <h3 style={styles.statCardTitle}>إجمالي المستحقات</h3>
                    <p style={styles.statCardValue}>{totalOutstanding.toLocaleString()}</p>
                </div>
            </div>

            <div style={twoColumnGridStyle}>
                <div style={styles.section}>
                    <h2 style={styles.viewTitle}>مواعيد اليوم القادمة</h2>
                     {todaysAppointments.length > 0 ? (
                        <ul style={styles.list}>
                            {todaysAppointments.map(a => (
                                <li key={a.id} style={styles.listItem}>
                                    <span style={styles.listItemName}>{getPatientName(a.patientId)}</span>
                                    <span style={styles.listItemDetails}>{new Date(a.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>لا توجد مواعيد مجدولة اليوم.</p>
                    )}
                </div>

                <div style={styles.section}>
                    <h2 style={styles.viewTitle}>أحدث المرضى</h2>
                    {recentPatients.length > 0 ? (
                        <ul style={styles.list}>
                            {recentPatients.map(p => (
                                <li key={p.id} style={styles.listItem}>
                                    <span style={styles.listItemName}>{p.name}</span>
                                    <span style={styles.listItemDetails}>{new Date(p.createdAt).toLocaleDateString('ar-EG')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>لم يتم إضافة أي مرضى بعد.</p>
                    )}
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.viewTitle}>إعدادات التذكيرات الآلية</h2>
                <p style={{color: '#6c757d', margin: '10px 0 20px', textAlign: 'center'}}>
                    يقوم النظام تلقائيًا "بإرسال" تذكير للمرضى قبل موعدهم. اختر المدة الزمنية المناسبة.
                </p>
                <div style={{...styles.dataManagementActions, ...styles.settingsSection}}>
                    <label style={styles.label} htmlFor="reminder-lead-time">إرسال التذكير قبل:</label>
                    <select 
                        id="reminder-lead-time"
                        style={styles.select} 
                        value={reminderSettings.leadTimeHours} 
                        onChange={(e) => onUpdateReminderSettings(Number(e.target.value))}
                    >
                        <option value={12}>12 ساعة</option>
                        <option value={24}>24 ساعة</option>
                        <option value={48}>48 ساعة</option>
                        <option value={72}>72 ساعة</option>
                    </select>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.viewTitle}>حالة التذكيرات للمواعيد القادمة</h2>
                 {upcomingAppointmentsForReminder.length > 0 ? (
                    <ul style={styles.list}>
                        {upcomingAppointmentsForReminder.map(a => (
                            <li key={a.id} style={styles.listItem}>
                                <div>
                                    <span style={styles.listItemName}>{getPatientName(a.patientId)}</span>
                                    <span style={styles.listItemDetails}> - {new Date(a.date).toLocaleString('ar-EG', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span style={a.reminderSent ? {...styles.reminderIcon, ...styles.reminderSent} : {...styles.reminderIcon, ...styles.reminderPending}} title={a.reminderSent ? "تم إرسال التذكير" : "في انتظار إرسال التذكير"}>
                                    🔔
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>
                        لا توجد مواعيد مجدولة خلال فترة التذكير ({reminderSettings.leadTimeHours} ساعة القادمة).
                    </p>
                )}
            </div>

            <div style={styles.section}>
                <h2 style={styles.viewTitle}>إدارة البيانات</h2>
                <p style={{color: '#6c757d', marginBottom: '20px', textAlign: 'center'}}>
                    يمكنك هنا تصدير جميع بيانات العيادة إلى ملف للحفاظ على نسخة احتياطية، أو استيراد البيانات من ملف نسخة احتياطية موجود.
                </p>
                <div style={dataManagementActionsStyle}>
                    <button 
                        style={{ ...styles.button, ...styles.buttonPrimary }} 
                        onClick={onBackup}>
                        تصدير نسخة احتياطية
                    </button>
                    <button 
                        style={{ ...styles.button, backgroundColor: '#dc3545', color: 'white' }}
                        onClick={() => document.getElementById('restore-input')?.click()}>
                        استيراد نسخة احتياطية
                    </button>
                    <input 
                        type="file" 
                        id="restore-input" 
                        accept=".json" 
                        style={{ display: 'none' }}
                        onChange={handleFileSelect} 
                    />
                </div>
            </div>
        </>
    )
}