import React from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles, successColor, dangerColor } from '../styles';
<<<<<<< HEAD

export const DashboardView: React.FC<{ 
    patients: Patient[]; 
    doctors: Doctor[]; 
=======
import { calculateAge, getSpecialtyName } from '../utils';

export const DashboardView: React.FC<{
    patients: Patient[];
    doctors: Doctor[];
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
    appointments: Appointment[];
    onBackup: () => void;
    onRestore: (jsonString: string) => void;
    reminderSettings: { leadTimeHours: number };
    onUpdateReminderSettings: (leadTimeHours: number) => void;
    isMobileView: boolean;
}> = ({ patients, doctors, appointments, onBackup, onRestore, reminderSettings, onUpdateReminderSettings, isMobileView }) => {
    const totalPatients = patients.length;
    const totalDoctors = doctors.length;
<<<<<<< HEAD
    
=======

>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const todaysAppointments = appointments.filter(a => {
        const appDate = new Date(a.date);
<<<<<<< HEAD
        appDate.setHours(0,0,0,0);
        return appDate.getTime() === today.getTime() && a.status === 'scheduled';
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    
    const allTreatmentLogs = patients.flatMap(p => p.treatmentHistory);
    
=======
        appDate.setHours(0, 0, 0, 0);
        return appDate.getTime() === today.getTime() && a.status === 'scheduled';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    const allTreatmentLogs = patients.flatMap(p => p.treatmentHistory);

>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
    const revenueToday = allTreatmentLogs
        .filter(log => log.date === todayStr && log.paid)
        .reduce((sum, log) => sum + (log.cost || 0), 0);

    const totalOutstanding = allTreatmentLogs
        .filter(log => !log.paid)
        .reduce((sum, log) => sum + (log.cost || 0), 0);

<<<<<<< HEAD
    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'N/A';
    
=======
    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'مريض محذوف';
    // const getDoctor = (id: string) => doctors.find(d => d.id === id); // No longer needed here

>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
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
<<<<<<< HEAD
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dashboardGridStyle = isMobileView ? {...styles.dashboardGrid, ...styles.dashboardGridMobile} : styles.dashboardGrid;
    const twoColumnGridStyle: React.CSSProperties = isMobileView 
        ? { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }
        : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };
    
    // FIX: Restructured the style definition to provide a contextual type to the mobile-specific style properties, resolving a TypeScript error where string literals were being widened to the `string` type.
=======
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dashboardGridStyle = isMobileView ? { ...styles.dashboardGrid, ...styles.dashboardGridMobile } : styles.dashboardGrid;
    const twoColumnGridStyle: React.CSSProperties = isMobileView
        ? { display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }
        : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };

>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
    const dataManagementActionsStyle: React.CSSProperties = {
        ...styles.dataManagementActions,
        ...(isMobileView
            ? {
<<<<<<< HEAD
                  flexDirection: 'column',
                  alignItems: 'stretch',
              }
=======
                flexDirection: 'column',
                alignItems: 'stretch',
            }
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
            : {}),
    };

    return (
        <>
            <div style={styles.viewHeader}>
<<<<<<< HEAD
                 <h1 style={styles.viewTitle}>لوحة التحكم الرئيسية</h1>
=======
                <h1 style={styles.viewTitle}>لوحة التحكم الرئيسية</h1>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
            </div>
            <div style={dashboardGridStyle}>
                <div style={styles.statCard}>
                    <h3 style={styles.statCardTitle}>إجمالي المرضى</h3>
                    <p style={styles.statCardValue}>{totalPatients}</p>
                </div>
<<<<<<< HEAD
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
=======
                <div style={{ ...styles.statCard, borderTopColor: '#ffc107' }}>
                    <h3 style={styles.statCardTitle}>مواعيد اليوم</h3>
                    <p style={styles.statCardValue}>{todaysAppointments.length}</p>
                </div>
                <div style={{ ...styles.statCard, borderTopColor: successColor }}>
                    <h3 style={styles.statCardTitle}>إيرادات اليوم</h3>
                    <p style={styles.statCardValue}>{revenueToday.toLocaleString()} ج.م</p>
                </div>
                <div style={{ ...styles.statCard, borderTopColor: dangerColor }}>
                    <h3 style={styles.statCardTitle}>إجمالي المستحقات</h3>
                    <p style={styles.statCardValue}>{totalOutstanding.toLocaleString()} ج.م</p>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                </div>
            </div>

            <div style={twoColumnGridStyle}>
                <div style={styles.section}>
                    <h2 style={styles.viewTitle}>مواعيد اليوم القادمة</h2>
<<<<<<< HEAD
                     {todaysAppointments.length > 0 ? (
=======
                    {todaysAppointments.length > 0 ? (
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                        <ul style={styles.list}>
                            {todaysAppointments.map(a => (
                                <li key={a.id} style={styles.listItem}>
                                    <span style={styles.listItemName}>{getPatientName(a.patientId)}</span>
                                    <span style={styles.listItemDetails}>{new Date(a.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
<<<<<<< HEAD
                        <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>لا توجد مواعيد مجدولة اليوم.</p>
=======
                        <p style={{ fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>لا توجد مواعيد مجدولة اليوم.</p>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
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
<<<<<<< HEAD
                        <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>لم يتم إضافة أي مرضى بعد.</p>
=======
                        <p style={{ fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>لم يتم إضافة أي مرضى بعد.</p>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                    )}
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.viewTitle}>إعدادات التذكيرات الآلية</h2>
<<<<<<< HEAD
                <p style={{color: '#6c757d', margin: '10px 0 20px', textAlign: 'center'}}>
                    يقوم النظام تلقائيًا "بإرسال" تذكير للمرضى قبل موعدهم. اختر المدة الزمنية المناسبة.
                </p>
                <div style={{...styles.dataManagementActions, ...styles.settingsSection}}>
                    <label style={styles.label} htmlFor="reminder-lead-time">إرسال التذكير قبل:</label>
                    <select 
                        id="reminder-lead-time"
                        style={styles.select} 
                        value={reminderSettings.leadTimeHours} 
=======
                <p style={{ color: '#6c757d', margin: '10px 0 20px', textAlign: 'center' }}>
                    يقوم النظام تلقائيًا "بإرسال" تذكير للمرضى قبل موعدهم. اختر المدة الزمنية المناسبة.
                </p>
                <div style={{ ...styles.dataManagementActions, ...styles.settingsSection }}>
                    <label style={styles.label} htmlFor="reminder-lead-time">إرسال التذكير قبل:</label>
                    <select
                        id="reminder-lead-time"
                        style={styles.select}
                        value={reminderSettings.leadTimeHours}
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
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
<<<<<<< HEAD
                 {upcomingAppointmentsForReminder.length > 0 ? (
=======
                {upcomingAppointmentsForReminder.length > 0 ? (
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                    <ul style={styles.list}>
                        {upcomingAppointmentsForReminder.map(a => (
                            <li key={a.id} style={styles.listItem}>
                                <div>
                                    <span style={styles.listItemName}>{getPatientName(a.patientId)}</span>
                                    <span style={styles.listItemDetails}> - {new Date(a.date).toLocaleString('ar-EG', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
<<<<<<< HEAD
                                <span style={a.reminderSent ? {...styles.reminderIcon, ...styles.reminderSent} : {...styles.reminderIcon, ...styles.reminderPending}} title={a.reminderSent ? "تم إرسال التذكير" : "في انتظار إرسال التذكير"}>
=======
                                <span style={a.reminderSent ? { ...styles.reminderIcon, ...styles.reminderSent } : { ...styles.reminderIcon, ...styles.reminderPending }} title={a.reminderSent ? "تم إرسال التذكير" : "في انتظار إرسال التذكير"}>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                                    🔔
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
<<<<<<< HEAD
                    <p style={{fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0'}}>
=======
                    <p style={{ fontSize: '14px', color: '#6c757d', textAlign: 'center', padding: '20px 0' }}>
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                        لا توجد مواعيد مجدولة خلال فترة التذكير ({reminderSettings.leadTimeHours} ساعة القادمة).
                    </p>
                )}
            </div>

            <div style={styles.section}>
                <h2 style={styles.viewTitle}>إدارة البيانات</h2>
<<<<<<< HEAD
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
=======
                <p style={{ color: '#6c757d', marginBottom: '20px', textAlign: 'center' }}>
                    يمكنك هنا تصدير جميع بيانات العيادة إلى ملف للحفاظ على نسخة احتياطية، أو استيراد البيانات من ملف نسخة احتياطية موجود.
                </p>
                <div style={dataManagementActionsStyle}>
                    <button
                        style={{ ...styles.button, ...styles.buttonPrimary }}
                        onClick={onBackup}>
                        تصدير نسخة احتياطية
                    </button>
                    <button
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                        style={{ ...styles.button, backgroundColor: '#dc3545', color: 'white' }}
                        onClick={() => document.getElementById('restore-input')?.click()}>
                        استيراد نسخة احتياطية
                    </button>
<<<<<<< HEAD
                    <input 
                        type="file" 
                        id="restore-input" 
                        accept=".json" 
                        style={{ display: 'none' }}
                        onChange={handleFileSelect} 
=======
                    <input
                        type="file"
                        id="restore-input"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
                    />
                </div>
            </div>
        </>
    )
<<<<<<< HEAD
}
=======
}
>>>>>>> 9da656e (Initial commit for CuraPT clinic app)
