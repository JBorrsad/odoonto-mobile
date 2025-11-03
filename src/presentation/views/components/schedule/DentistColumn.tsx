import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { DoctorAvatar } from '../DoctorAvatar';
import { Appointment } from './Appointment';

interface AppointmentData {
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
	isStart?: boolean;
}

interface DentistColumnProps {
	dentist: {
		id: string;
		name: string;
		appointments: number;
		patients: number;
	};
	appointments: AppointmentData[];
	onSlotPress?: (slotIndex: number, dentistId: string) => void;
	onAppointmentPress?: (appointment: AppointmentData) => void;
}

export const DentistColumn: React.FC<DentistColumnProps> = ({
	dentist,
	appointments,
	onSlotPress,
	onAppointmentPress,
}) => {
	// HOOK: useMemo - Crear slots para cada media hora (8am a 8pm = 25 slots)
	const slots = useMemo(() => {
		const slotArray: Array<AppointmentData | null> = Array(25).fill(null);

		appointments.forEach(appointment => {
			const adjustedStartSlot = appointment.startSlot + 2; // Ajuste para inicio a las 8:00
			const adjustedEndSlot = appointment.endSlot + 2;

			for (let i = adjustedStartSlot; i <= adjustedEndSlot; i++) {
				if (i === adjustedStartSlot) {
					slotArray[i] = { ...appointment, isStart: true };
				} else {
					slotArray[i] = { ...appointment, isStart: false };
				}
			}
		});

		return slotArray;
	}, [appointments]);

	// HOOK: useCallback - Manejar clic en slot
	const handleSlotPress = useCallback(
		(slotIndex: number) => {
			if (onSlotPress) {
				onSlotPress(slotIndex, dentist.id);
			}
		},
		[onSlotPress, dentist.id]
	);

	// HOOK: useCallback - Manejar clic en cita
	const handleAppointmentPress = useCallback(
		(appointment: AppointmentData) => {
			if (onAppointmentPress) {
				onAppointmentPress(appointment);
			}
		},
		[onAppointmentPress]
	);

	return (
		<View style={styles.container}>
			{/* Header del doctor */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<DoctorAvatar nombreCompleto={dentist.name} />
					<View style={styles.doctorInfo}>
						<Text style={styles.doctorName}>{dentist.name}</Text>
						<Text style={styles.appointmentsCount}>
							Citas de hoy: {dentist.appointments} paciente(s)
						</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.menuButton}>
					<Text style={styles.menuIcon}>⋮</Text>
				</TouchableOpacity>
			</View>

			{/* Slots de tiempo */}
			{slots.map((slot, index) => {
				const shouldRenderAppointment = slot && (slot as any).isStart;
				const isHalfHour = index % 2 !== 0;

				return (
					<TouchableOpacity
						key={index}
						style={[
							styles.slot,
							index > 0 && styles.slotBordered,
							isHalfHour && styles.slotHalfHour,
						]}
						onPress={() => handleSlotPress(index)}
						activeOpacity={0.7}
					>
						{shouldRenderAppointment && (
							<View
								style={[
									styles.appointmentContainer,
									{
										height:
											((slot as AppointmentData).endSlot -
												(slot as AppointmentData).startSlot +
												1) *
											48,
									},
								]}
							>
								<Appointment
									id={(slot as AppointmentData).id}
									patientName={(slot as AppointmentData).patientName}
									startTime={(slot as AppointmentData).startTime}
									endTime={(slot as AppointmentData).endTime}
									treatment={(slot as AppointmentData).treatment}
									status={(slot as AppointmentData).status}
									color={(slot as AppointmentData).color}
									onPress={() => handleAppointmentPress(slot as AppointmentData)}
									height={
										((slot as AppointmentData).endSlot - (slot as AppointmentData).startSlot + 1) *
										48
									}
								/>
							</View>
						)}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		minWidth: 250,
		borderRightWidth: 1,
		borderRightColor: theme.colors.gray[200],
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 64,
		paddingHorizontal: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	doctorInfo: {
		marginLeft: theme.spacing.sm,
		flex: 1,
	},
	doctorName: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	appointmentsCount: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[400],
		marginTop: theme.spacing.xs / 2,
	},
	menuButton: {
		padding: theme.spacing.xs,
	},
	menuIcon: {
		fontSize: theme.fontSizes.lg,
		color: theme.colors.gray[400],
	},
	slot: {
		height: 48,
		position: 'relative',
	},
	slotBordered: {
		borderTopWidth: 1,
		borderTopColor: theme.colors.gray[200],
	},
	slotHalfHour: {
		borderStyle: 'dashed',
	},
	appointmentContainer: {
		position: 'absolute',
		top: 0,
		left: theme.spacing.xs,
		right: theme.spacing.xs,
		zIndex: 10,
	},
});
