import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../../../core/theme';
import { TimeColumn } from './TimeColumn';
import { DentistColumn } from './DentistColumn';

interface AppointmentCalendarData {
	id: string;
	patientName: string;
	startTime: string;
	endTime: string;
	treatment?: string;
	status?: string;
	color?: string;
	startSlot: number;
	endSlot: number;
	doctorId?: string;
}

interface DentistData {
	id: string;
	name: string;
	appointments: number;
	patients: number;
}

interface CalendarViewProps {
	date: Date;
	view: 'day' | 'week';
	selectedDoctor?: string | null;
	doctors: DentistData[];
	appointments: AppointmentCalendarData[];
	onSlotPress?: (slotIndex: number, dentistId: string) => void;
	onAppointmentPress?: (appointment: AppointmentCalendarData) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
	selectedDoctor,
	doctors,
	appointments,
	onSlotPress,
	onAppointmentPress,
}) => {
	// HOOK: useMemo - Filtrar doctores según selección
	const filteredDoctors = useMemo(() => {
		if (selectedDoctor) {
			return doctors.filter(d => d.id === selectedDoctor);
		}
		return doctors;
	}, [doctors, selectedDoctor]);

	// HOOK: useMemo - Agrupar citas por doctor
	const appointmentsByDoctor = useMemo(() => {
		const grouped: { [key: string]: AppointmentCalendarData[] } = {};
		filteredDoctors.forEach(doctor => {
			grouped[doctor.id] = appointments.filter(a => a.doctorId === doctor.id);
		});
		return grouped;
	}, [filteredDoctors, appointments]);

	return (
		<ScrollView horizontal style={styles.container}>
			<View style={styles.calendarContainer}>
				<TimeColumn />

				{filteredDoctors.map(doctor => (
					<DentistColumn
						key={doctor.id}
						dentist={doctor}
						appointments={appointmentsByDoctor[doctor.id] || []}
						onSlotPress={onSlotPress}
						onAppointmentPress={onAppointmentPress}
					/>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
	calendarContainer: {
		flexDirection: 'row',
		minWidth: '100%',
	},
});
