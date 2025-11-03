import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';

interface AppointmentProps {
	id?: string;
	patientName: string;
	startTime: string;
	endTime: string;
	treatment?: string;
	status?: string;
	color?: string;
	onPress?: () => void;
	height?: number;
}

export const Appointment: React.FC<AppointmentProps> = ({
	id,
	patientName,
	startTime,
	endTime,
	treatment,
	status,
	color,
	onPress,
	height = 48,
}) => {
	// HOOK: useMemo - Determinar color según estado
	const appointmentColor = useMemo(() => {
		if (color) return color;

		switch (status?.toLowerCase()) {
			case 'confirmed':
			case 'confirmada':
				return theme.colors.success;
			case 'pending':
			case 'pendiente':
				return theme.colors.warning;
			case 'waiting_room':
			case 'en_sala':
				return theme.colors.primary;
			case 'in_progress':
			case 'en_curso':
				return '#9333ea'; // purple
			default:
				return theme.colors.gray[400];
		}
	}, [color, status]);

	const appointmentStyles = [
		styles.appointment,
		{
			backgroundColor: appointmentColor + '20',
			borderColor: appointmentColor,
			height: height,
			minHeight: 48,
		},
	];

	return (
		<TouchableOpacity
			style={appointmentStyles}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<Text style={[styles.patientName, { color: appointmentColor }]} numberOfLines={1}>
				{patientName}
			</Text>
			<Text style={styles.time} numberOfLines={1}>
				{startTime} - {endTime}
			</Text>
			{treatment && (
				<Text style={styles.treatment} numberOfLines={1}>
					{treatment}
				</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	appointment: {
		borderWidth: 1,
		borderRadius: theme.borderRadius.sm,
		padding: theme.spacing.xs,
		marginHorizontal: theme.spacing.xs,
		marginVertical: 1,
		justifyContent: 'center',
	},
	patientName: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
		marginBottom: theme.spacing.xs / 2,
	},
	time: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[600],
		marginBottom: theme.spacing.xs / 2,
	},
	treatment: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
	},
});

