import React, { useState, useMemo, useCallback } from 'react';
import { Patient, Doctor, Appointment } from '../types';
import { styles } from '../styles';
import { DayAppointmentsModal } from '../components/DayAppointmentsModal';
import { getSpecialtyName } from '../utils';

const AppointmentCalendar: React.FC<{
    appointments: Appointment[];
    doctors: Doctor[];
    onDayClick: (date: string) => void;
    isMobileView: boolean;
}> = ({ appointments, doctors, onDayClick, isMobileView }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const appointmentsByDate = useMemo(() => {
        const map = new Map<string, Appointment[]>();
        appointments.forEach(app => {
            const dateStr = app.date.split('T')[0];
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(app);
        });
        return map;
    }, [appointments]);

    const doctorColorMap = useMemo(() => {
        return new Map(doctors.map(d => [d.id, d.color]));
    }, [doctors]);

    return (
        <div style={styles.calendarContainer}>
            <div style={styles.calendarHeader}>
                <button style={styles.calendarNavButton} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&#8592;</button>
                <h2>{currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</h2>
                <button style={styles.calendarNavButton} onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&#8594;</button>
            </div>
            <div style={styles.calendarGrid}>
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(d => <div key={d} style={styles.calendarDayName}>{d}</div>)}
                {days.map(d => {
                    const dateStr = d.toISOString().split('T')[0];
                    const isToday = d.getTime() === today.getTime();
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const dayAppointments = appointmentsByDate.get(dateStr) || [];
                    const uniqueDoctorIds = [...new Set(dayAppointments.map(a => a.doctorId))];
                    
                    let dayStyle = isMobileView ? {...styles.calendarDay, ...styles.calendarDayMobile} : {...styles.calendarDay};
                    if (!isCurrentMonth) dayStyle = {...dayStyle, ...styles.calendarDayOtherMonth};
                    if (isToday) dayStyle = {...dayStyle, ...styles.calendarDayToday};

                    const dayNumberStyle = isMobileView ? {...styles.calendarDayNumber, ...styles.calendarDayNumberMobile} : styles.calendarDayNumber;

                    return (
                        <div key={dateStr} style={dayStyle} onClick={() => onDayClick(dateStr)}>
                            <div style={dayNumberStyle}>{d.getDate()}</div>
                            {uniqueDoctorIds.length > 0 && (
                                <div style={styles.appointmentIndicatorsContainer}>
                                    {uniqueDoctorIds.slice(0, 4).map(doctorId => (
                                        <div 
                                            key={doctorId} 
                                            style={{
                                                ...styles.appointmentColorDot, 
                                                backgroundColor: doctorColorMap.get(doctorId) || '#ccc'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const AppointmentsView: React.FC<{
    appointments: Appointment[];
    patients: Patient[];
    doctors: Doctor[];
    onAddAppointment: () => void;
    onUpdateStatus: (appointmentId: string, status: Appointment['status']) => void;
    isMobileView: boolean;
}> = ({ appointments, patients, doctors, onAddAppointment, onUpdateStatus, isMobileView }) => {
    
    const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'board' | 'doctor'>('list');
    const [filterPatient, setFilterPatient] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterStatus, setFilterStatus] = useState<Appointment['status'] | ''>('');
    const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [boardDate, setBoardDate] = useState(new Date().toISOString().split('T')[0]);
    const [dayModalDate, setDayModalDate] = useState<string | null>(null);
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
    const [expandedDoctors, setExpandedDoctors] = useState<Record<string, boolean>>({});

    const getPatientName = useCallback((id: string) => patients.find(p => p.id === id)?.name || 'مريض محذوف', [patients]);
    const getDoctor = useCallback((id: string) => doctors.find(d => d.id === id), [doctors]);

    const toggleDayExpansion = (date: string) => {
        setExpandedDays(prev => ({ ...prev, [date]: !(prev[date] ?? true) }));
    };

    const toggleDoctorExpansion = (doctorId: string) => {
        setExpandedDoctors(prev => ({ ...prev, [doctorId]: !(prev[doctorId] ?? true) }));
    };

    const clearFilters = () => {
        setFilterPatient('');
        setFilterDoctor('');
        setFilterStatus('');
        setFilterDate('');
    };

    const filteredAppointments = useMemo(() => {
        return appointments
            .filter(a => {
                const patientName = getPatientName(a.patientId).toLowerCase();
                return (
                    (!filterPatient || patientName.includes(filterPatient.toLowerCase())) &&
                    (!filterDoctor || a.doctorId === filterDoctor) &&
                    (!filterStatus || a.status === filterStatus)
                );
            })
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments, filterPatient, filterDoctor, filterStatus, getPatientName]);
    
    const listAppointments = useMemo(() => {
        if (!filterDate) return filteredAppointments;
        return filteredAppointments.filter(a => a.date.startsWith(filterDate));
    }, [filteredAppointments, filterDate]);

    const groupedAppointments = useMemo(() => {
        return listAppointments.reduce((groups, app) => {
            const dateStr = app.date.split('T')[0];
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(app);
            return groups;
        }, {} as Record<string, Appointment[]>);
    }, [listAppointments]);
    
    const appointmentsByDoctor = useMemo(() => {
        return doctors.reduce((acc, doctor) => {
            acc[doctor.id] = filteredAppointments.filter(app => app.doctorId === doctor.id);
            return acc;
        }, {} as Record<string, Appointment[]>);
    }, [filteredAppointments, doctors]);

    const boardAppointments = useMemo(() => {
        return filteredAppointments.filter(a => a.date.startsWith(boardDate));
    }, [filteredAppointments, boardDate]);

    const sortedGroupKeys = Object.keys(groupedAppointments);
        
    const statusMap = {
        scheduled: { text: 'مجدول', style: styles.statusScheduled, color: '#ffc107' },
        completed: { text: 'مكتمل', style: styles.statusCompleted, color: '#28a745' },
        canceled: { text: 'ملغي', style: styles.statusCanceled, color: '#dc3545' }
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const viewHeaderStyle = isMobileView ? {...styles.viewHeader, ...styles.viewHeaderMobile} : styles.viewHeader;
    const viewHeaderActionsStyle = isMobileView ? {...styles.viewHeaderActions, ...styles.viewHeaderActionsMobile} : styles.viewHeaderActions;
    const addButtonStyle = isMobileView ? {...styles.addButton, width: '100%'} : styles.addButton;
    const filtersContainerStyle = isMobileView ? {...styles.filtersContainer, ...styles.filtersContainerMobile} : styles.filtersContainer;
    const boardContainerStyle = isMobileView ? {...styles.boardContainer, ...styles.boardContainerMobile} : styles.boardContainer;

    return (
        <>
           <div style={viewHeaderStyle}>
                <h1 style={styles.viewTitle}>المواعيد</h1>
                <div style={viewHeaderActionsStyle}>
                     <div style={{...styles.viewToggle, flexWrap: 'wrap'}}>
                        <button 
                            style={viewMode === 'list' ? {...styles.toggleButton, ...styles.toggleButtonActive} : styles.toggleButton} 
                            onClick={() => setViewMode('list')}>
                            قائمة
                        </button>
                        <button 
                            style={viewMode === 'board' ? {...styles.toggleButton, ...styles.toggleButtonActive} : styles.toggleButton} 
                            onClick={() => setViewMode('board')}>
                            لوحة
                        </button>
                         <button 
                            style={viewMode === 'doctor' ? {...styles.toggleButton, ...styles.toggleButtonActive} : styles.toggleButton} 
                            onClick={() => setViewMode('doctor')}>
                            حسب الطبيب
                        </button>
                        <button 
                            style={viewMode === 'calendar' ? {...styles.toggleButton, ...styles.toggleButtonActive} : styles.toggleButton} 
                            onClick={() => setViewMode('calendar')}>
                            تقويم
                        </button>
                    </div>
                     <button style={addButtonStyle} onClick={onAddAppointment}>
                        <span>&#43;</span> حجز موعد
                    </button>
                </div>
            </div>

            {(viewMode === 'list' || viewMode === 'board' || viewMode === 'doctor') && (
                 <div style={filtersContainerStyle}>
                    {viewMode === 'list' && (
                        <input type="date" style={isMobileView ? {...styles.input, ...styles.fullWidth} : {...styles.input, flexGrow: 1}} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    )}
                    {viewMode === 'board' && (
                        <input type="date" style={isMobileView ? {...styles.input, ...styles.fullWidth} : {...styles.input, flexGrow: 1}} value={boardDate} onChange={e => setBoardDate(e.target.value)} />
                    )}
                    <input type="text" placeholder="ابحث باسم المريض..." style={isMobileView ? {...styles.input, ...styles.fullWidth} : {...styles.input, flexGrow: 2}} value={filterPatient} onChange={e => setFilterPatient(e.target.value)} />
                    {(viewMode === 'list' || viewMode === 'board') && (
                        <select style={isMobileView ? {...styles.select, ...styles.fullWidth} : {...styles.select, flexGrow: 1}} value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}>
                            <option value="">كل الأطباء</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    )}
                    {(viewMode === 'list' || viewMode === 'doctor') && (
                        <select style={isMobileView ? {...styles.select, ...styles.fullWidth} : {...styles.select, flexGrow: 1}} value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
                            <option value="">كل الحالات</option>
                            <option value="scheduled">مجدول</option>
                            <option value="completed">مكتمل</option>
                            <option value="canceled">ملغي</option>
                        </select>
                    )}
                    <button onClick={clearFilters} style={{...styles.button, ...styles.buttonSecondary, ...(isMobileView && styles.fullWidth)}}>مسح الفلاتر</button>
                </div>
            )}
            
            {viewMode === 'board' && (
                <div style={boardContainerStyle}>
                    {(['scheduled', 'completed', 'canceled'] as const).map(status => {
                        const appointmentsInColumn = boardAppointments.filter(a => a.status === status);
                        return (
                            <div key={status} style={styles.boardColumn}>
                                <div style={{...styles.boardColumnHeader, borderBottomColor: statusMap[status].color}}>
                                    <h3 style={styles.boardColumnTitle}>{statusMap[status].text}</h3>
                                    <span style={styles.boardColumnCount}>{appointmentsInColumn.length}</span>
                                </div>
                                {appointmentsInColumn.map(a => {
                                    const doctor = getDoctor(a.doctorId);
                                    return (
                                        <div key={a.id} style={{...styles.boardCard, borderInlineStartColor: doctor?.color || '#ccc'}}>
                                            <div style={{...styles.boardCardTime, color: doctor?.color || '#333'}}>{new Date(a.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div style={styles.boardCardPatient}>{getPatientName(a.patientId)}</div>
                                            <div style={styles.boardCardReason}>{a.reason}</div>
                                            <div style={styles.boardCardDoctor}>د. {doctor?.name || 'طبيب محذوف'}</div>
                                            <div style={styles.boardCardActions}>
                                                {a.status === 'scheduled' && <button style={styles.iconButton} title="إكمال" onClick={() => onUpdateStatus(a.id, 'completed')}>✅</button>}
                                                {a.status !== 'canceled' && <button style={styles.iconButton} title="إلغاء" onClick={() => onUpdateStatus(a.id, 'canceled')}>❌</button>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )}

            {viewMode === 'list' && (
                <div style={styles.appointmentList}>
                    {sortedGroupKeys.length > 0 ? (
                        sortedGroupKeys.map(dateStr => {
                            const dayAppointments = groupedAppointments[dateStr];
                            const isExpanded = expandedDays[dateStr] ?? true;

                            return (
                                <div key={dateStr} style={styles.dayGroup}>
                                    <button style={styles.dayGroupHeader} onClick={() => toggleDayExpansion(dateStr)}>
                                        <span>{formatDate(dateStr)} ({dayAppointments.length})</span>
                                        <span style={{...styles.dayGroupToggleIcon, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</span>
                                    </button>
                                    {isExpanded && (
                                        <div style={styles.dayGroupContent}>
                                            {dayAppointments.map((a, index) => {
                                                const doctor = getDoctor(a.doctorId);
                                                const itemStyle: React.CSSProperties = {
                                                    ...(isMobileView ? styles.appointmentItemMobile : styles.appointmentItem),
                                                    borderInlineStartColor: doctor?.color || '#ccc',
                                                };
                                                if (index === dayAppointments.length - 1) {
                                                    itemStyle.borderBottom = 'none';
                                                }
                                                if(isMobileView) {
                                                    return (
                                                         <div key={a.id} style={itemStyle}>
                                                            <div style={styles.appointmentItemMobileHeader}>
                                                                <div style={styles.appointmentTime}>{new Date(a.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                                                                <div style={{...styles.appointmentStatus, ...statusMap[a.status].style}}>{statusMap[a.status].text}</div>
                                                            </div>
                                                            <div>
                                                                <div style={styles.appointmentPatient}>{getPatientName(a.patientId)}</div>
                                                                <div style={{fontSize: '14px', color: '#6c757d'}}>{a.reason}</div>
                                                            </div>
                                                            <div style={{...styles.appointmentDoctor, width: '100%', justifyContent: 'space-between'}}>
                                                                <span>د. {doctor?.name || 'طبيب محذوف'}</span>
                                                                {a.status === 'scheduled' && (
                                                                    <span style={a.reminderSent ? {...styles.reminderIcon, ...styles.reminderSent} : {...styles.reminderIcon, ...styles.reminderPending}} title={a.reminderSent ? "تم إرسال التذكير" : "في انتظار إرسال التذكير"}>
                                                                        🔔
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div style={{...styles.appointmentActions, borderTop: '1px solid #eee', width: '100%', paddingTop: '10px', justifyContent: 'flex-end'}}>
                                                                {a.status === 'scheduled' && <button style={styles.iconButton} title="إكمال" onClick={() => onUpdateStatus(a.id, 'completed')}>✅</button>}
                                                                {a.status !== 'canceled' && <button style={styles.iconButton} title="إلغاء" onClick={() => onUpdateStatus(a.id, 'canceled')}>❌</button>}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return (
                                                    <div key={a.id} style={itemStyle}>
                                                        <div>
                                                            <div style={styles.appointmentTime}>{new Date(a.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                                                            <div style={{...styles.appointmentStatus, ...statusMap[a.status].style}}>{statusMap[a.status].text}</div>
                                                        </div>
                                                        <div>
                                                            <div style={styles.appointmentPatient}>{getPatientName(a.patientId)}</div>
                                                            <div style={{fontSize: '14px', color: '#6c757d'}}>{a.reason}</div>
                                                        </div>
                                                        <div style={styles.appointmentDoctor}>
                                                            د. {doctor?.name || 'طبيب محذوف'}
                                                            {a.status === 'scheduled' && (
                                                                <span style={a.reminderSent ? {...styles.reminderIcon, ...styles.reminderSent} : {...styles.reminderIcon, ...styles.reminderPending}} title={a.reminderSent ? "تم إرسال التذكير" : "في انتظار إرسال التذكير"}>
                                                                    🔔
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={styles.appointmentActions}>
                                                            {a.status === 'scheduled' && <button style={styles.iconButton} title="إكمال" onClick={() => onUpdateStatus(a.id, 'completed')}>✅</button>}
                                                            {a.status !== 'canceled' && <button style={styles.iconButton} title="إلغاء" onClick={() => onUpdateStatus(a.id, 'canceled')}>❌</button>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div style={styles.emptyState}>
                            <p style={styles.emptyStateText}>لا توجد مواعيد تطابق هذه المعايير.</p>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'doctor' && (
                 <div style={styles.appointmentList}>
                    {doctors.length > 0 ? (
                        doctors.map(doctor => {
                            const doctorAppointments = appointmentsByDoctor[doctor.id];
                            if (!doctorAppointments || (doctorAppointments.length === 0 && (filterPatient || filterStatus))) {
                                return null;
                            }
                            const isExpanded = expandedDoctors[doctor.id] ?? true;
            
                            return (
                                <div key={doctor.id} style={styles.dayGroup}>
                                    <button style={{...styles.dayGroupHeader, borderInlineStart: `5px solid ${doctor.color}`}} onClick={() => toggleDoctorExpansion(doctor.id)}>
                                        <span>{doctor.name} ({getSpecialtyName(doctor.specialty)}) - ({doctorAppointments.length} مواعيد)</span>
                                        <span style={{...styles.dayGroupToggleIcon, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}>▼</span>
                                    </button>
                                    {isExpanded && (
                                        <div style={styles.dayGroupContent}>
                                            {doctorAppointments.length > 0 ? (
                                                doctorAppointments.map((a, index) => {
                                                    const itemStyle: React.CSSProperties = { ...styles.appointmentItemInDoctorView };
                                                    if (index === doctorAppointments.length - 1) { itemStyle.borderBottom = 'none'; }
                                                    return (
                                                        <div key={a.id} style={itemStyle}>
                                                            <div>
                                                                <div style={styles.appointmentTime}>{new Date(a.date).toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                                                                <div style={{...styles.appointmentStatus, ...statusMap[a.status].style}}>{statusMap[a.status].text}</div>
                                                            </div>
                                                            <div>
                                                                <div style={styles.appointmentPatient}>{getPatientName(a.patientId)}</div>
                                                                <div style={{fontSize: '14px', color: '#6c757d'}}>{a.reason}</div>
                                                            </div>
                                                            <div style={styles.appointmentActions}>
                                                                {a.status === 'scheduled' && <button style={styles.iconButton} title="إكمال" onClick={() => onUpdateStatus(a.id, 'completed')}>✅</button>}
                                                                {a.status !== 'canceled' && <button style={styles.iconButton} title="إلغاء" onClick={() => onUpdateStatus(a.id, 'canceled')}>❌</button>}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div style={{padding: '20px', textAlign: 'center', color: '#6c757d'}}>لا توجد مواعيد لهذا الطبيب تطابق الفلاتر.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div style={styles.emptyState}>
                            <p style={styles.emptyStateText}>لا يوجد أطباء لعرض مواعيدهم.</p>
                        </div>
                    )}
                </div>
            )}
            
            {viewMode === 'calendar' && (
                <AppointmentCalendar 
                    appointments={appointments}
                    doctors={doctors}
                    onDayClick={(dateStr) => {
                        setDayModalDate(dateStr);
                    }}
                    isMobileView={isMobileView}
                />
            )}
            
            {dayModalDate && (
                <DayAppointmentsModal 
                    date={dayModalDate}
                    appointments={appointments}
                    patients={patients}
                    doctors={doctors}
                    onClose={() => setDayModalDate(null)}
                    isMobileView={isMobileView}
                />
            )}
        </>
    );
};