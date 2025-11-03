import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../Button';
import { apiService } from '../../../../data/services/ApiService';

interface AppointmentDetailProps {
	appointment: any;
	onClose: () => void;
	onEdit?: (appointment: any) => void;
	onDelete?: () => void;
	onUpdate?: (appointment: any) => void;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
	appointment,
	onClose,
	onEdit,
	onDelete,
	onUpdate,
}) => {
	// HOOK: useState - Estado para estado de la cita
	const [status, setStatus] = useState(appointment?.status || 'PENDING');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// HOOK: useMemo - Formatear fecha
	const formatDate = useCallback((dateString: string | undefined): string => {
		if (!dateString) return 'N/A';

		const date = new Date(dateString);
		return new Intl.DateTimeFormat('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	}, []);

	// HOOK: useMemo - Obtener duración
	const getDuration = useCallback((slots: number | undefined): string => {
		if (!slots) return 'N/A';

		if (slots === 1) return '30 minutos';
		if (slots === 2) return '1 hora';
		if (slots === 3) return '1 hora 30 minutos';
		if (slots === 4) return '2 horas';
		if (slots === 5) return '2 horas 30 minutos';
		if (slots === 6) return '3 horas';

		return `${slots * 30} minutos`;
	}, []);

	// HOOK: useMemo - Obtener etiqueta de estado
	const getStatusLabel = useCallback((statusCode: string): string => {
		const statusMap: { [key: string]: string } = {
			PENDING: 'Sin confirmar',
			CONFIRMED: 'Confirmada',
			WAITING_ROOM: 'En sala de espera',
			IN_PROGRESS: 'En curso',
			COMPLETED: 'Completada',
			CANCELLED: 'Cancelada',
		};

		return statusMap[statusCode] || statusCode;
	}, []);

	// HOOK: useMemo - Obtener estilo de estado
	const getStatusStyle = useCallback((statusCode: string) => {
		const statusStyles: { [key: string]: { bg: string; text: string } } = {
			PENDING: { bg: theme.colors.warning + '20', text: theme.colors.warning },
			CONFIRMED: { bg: theme.colors.success + '20', text: theme.colors.success },
			WAITING_ROOM: { bg: theme.colors.primary + '20', text: theme.colors.primary },
			IN_PROGRESS: { bg: '#9333ea20', text: '#9333ea' },
			COMPLETED: { bg: theme.colors.gray[100], text: theme.colors.gray[700] },
			CANCELLED: { bg: theme.colors.danger + '20', text: theme.colors.danger },
		};

		return statusStyles[statusCode] || { bg: theme.colors.gray[100], text: theme.colors.gray[700] };
	}, []);

	// HOOK: useCallback - Manejar cambio de estado
	const handleStatusChange = useCallback(
		async (newStatus: string) => {
			setStatus(newStatus);

			try {
				setLoading(true);
				setError(null);

				await apiService.updateAppointment(appointment.id, {
					...appointment,
					status: newStatus,
				});

				if (onUpdate) {
					onUpdate({
						...appointment,
						status: newStatus,
					});
				}
			} catch (err: any) {
				setError('Error al actualizar el estado de la cita');
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[appointment, onUpdate]
	);

	if (!appointment) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>No hay información de la cita</Text>
			</View>
		);
	}

	const statusStyle = getStatusStyle(appointment.status);

	return (
		<ScrollView style={styles.container}>
			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<Text style={styles.title}>Detalles de la Cita</Text>

			<View style={styles.infoGrid}>
				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Fecha y hora:</Text>
					<Text style={styles.infoValue}>{formatDate(appointment.start)}</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Duración:</Text>
					<Text style={styles.infoValue}>{getDuration(appointment.durationSlots)}</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Paciente:</Text>
					<Text style={styles.infoValue}>
						{appointment.patientName || appointment.patientId || 'N/A'}
					</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Doctor:</Text>
					<Text style={styles.infoValue}>
						{appointment.doctorName || appointment.doctorId || 'N/A'}
					</Text>
				</View>

				<View style={styles.infoItem}>
					<Text style={styles.infoLabel}>Estado:</Text>
					<View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
						<Text style={[styles.statusText, { color: statusStyle.text }]}>
							{getStatusLabel(appointment.status)}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.field}>
				<Text style={styles.label}>Cambiar estado:</Text>
				<View style={styles.statusButtons}>
					{['PENDING', 'CONFIRMED', 'WAITING_ROOM', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
						statusOption => (
							<TouchableOpacity
								key={statusOption}
								style={[
									styles.statusButton,
									status === statusOption && styles.statusButtonActive,
									{ backgroundColor: status === statusOption ? getStatusStyle(statusOption).bg : theme.colors.gray[100] },
								]}
								onPress={() => handleStatusChange(statusOption)}
								disabled={loading}
							>
								<Text
									style={[
										styles.statusButtonText,
										{ color: status === statusOption ? getStatusStyle(statusOption).text : theme.colors.gray[700] },
									]}
								>
									{getStatusLabel(statusOption)}
								</Text>
							</TouchableOpacity>
						)
					)}
				</View>
			</View>

			{appointment.notes && (
				<View style={styles.field}>
					<Text style={styles.label}>Notas:</Text>
					<View style={styles.notesContainer}>
						<Text style={styles.notesText}>{appointment.notes}</Text>
					</View>
				</View>
			)}

			<View style={styles.actions}>
				{onEdit && (
					<Button title="Editar" onPress={() => onEdit(appointment)} variant="secondary" />
				)}
				{onDelete && (
					<Button title="Eliminar" onPress={onDelete} variant="danger" />
				)}
				<Button title="Cerrar" onPress={onClose} variant="primary" />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: theme.spacing.md,
		maxHeight: 600,
	},
	errorContainer: {
		backgroundColor: theme.colors.danger + '20',
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.danger,
		padding: theme.spacing.sm,
		marginBottom: theme.spacing.md,
	},
	errorText: {
		color: theme.colors.danger,
		fontSize: theme.fontSizes.sm,
	},
	title: {
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
		color: theme.colors.gray[900],
		marginBottom: theme.spacing.md,
	},
	infoGrid: {
		gap: theme.spacing.md,
		marginBottom: theme.spacing.lg,
	},
	infoItem: {
		marginBottom: theme.spacing.md,
	},
	infoLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
		marginBottom: theme.spacing.xs,
	},
	infoValue: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	statusBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		alignSelf: 'flex-start',
	},
	statusText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	field: {
		marginBottom: theme.spacing.md,
	},
	label: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.sm,
	},
	statusButtons: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: theme.spacing.sm,
	},
	statusButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
	},
	statusButtonActive: {
		borderWidth: 2,
	},
	statusButtonText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	notesContainer: {
		backgroundColor: theme.colors.gray[50],
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
	},
	notesText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[700],
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	},
});

