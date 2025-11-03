import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../Button';
import { apiService } from '../../../../data/services/ApiService';

interface AppointmentFormProps {
	appointment?: any;
	onSubmit: (appointmentData: any) => void;
	onCancel: () => void;
	patientId?: string;
	loading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
	appointment,
	onSubmit,
	onCancel,
	patientId,
	loading = false,
}) => {
	// HOOK: useState - Estado para pacientes y doctores
	const [patients, setPatients] = useState<any[]>([]);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [loadingData, setLoadingData] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// HOOK: useState - Estado para formulario
	const [form, setForm] = useState({
		patientId: patientId || '',
		doctorId: '',
		date: '',
		time: '08:00',
		durationSlots: '1',
		status: 'PENDING',
		notes: '',
	});

	// HOOK: useState - Estado para errores
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// HOOK: useEffect - Cargar pacientes y doctores
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingData(true);
				const [patientsResponse, doctorsResponse] = await Promise.all([
					apiService.patients.getPatients(),
					apiService.doctors.getDoctors(),
				]);
				setPatients(patientsResponse.data || []);
				setDoctors(doctorsResponse.data || []);
			} catch (err: any) {
				setError(err.message || 'Error al cargar datos');
			} finally {
				setLoadingData(false);
			}
		};
		fetchData();
	}, []);

	// HOOK: useEffect - Inicializar formulario cuando cambia appointment o patientId
	useEffect(() => {
		if (appointment) {
			const startDate = new Date(appointment.start);
			const dateStr = startDate.toISOString().split('T')[0];
			const timeStr = startDate.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			});

			setForm({
				patientId: appointment.patientId || '',
				doctorId: appointment.doctorId || '',
				date: dateStr,
				time: timeStr,
				durationSlots: appointment.durationSlots?.toString() || '1',
				status: appointment.status || 'PENDING',
				notes: appointment.notes || '',
			});
		} else if (patientId) {
			setForm(prev => ({
				...prev,
				patientId,
			}));
		}
	}, [appointment, patientId]);

	// HOOK: useCallback - Manejar cambio de campos
	const handleChange = useCallback((field: string, value: string) => {
		setForm(prev => ({
			...prev,
			[field]: value,
		}));

		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: '',
			}));
		}
	}, [errors]);

	// HOOK: useCallback - Validar formulario
	const validate = useCallback((): boolean => {
		const newErrors: { [key: string]: string } = {};

		if (!form.patientId) newErrors.patientId = 'El paciente es obligatorio';
		if (!form.doctorId) newErrors.doctorId = 'El doctor es obligatorio';
		if (!form.date) newErrors.date = 'La fecha es obligatoria';
		if (!form.time) newErrors.time = 'La hora es obligatoria';
		if (!form.durationSlots) newErrors.durationSlots = 'La duración es obligatoria';

		const minutes = parseInt(form.time.split(':')[1], 10);
		if (minutes !== 0 && minutes !== 30) {
			newErrors.time = 'La hora debe ser en punto (:00) o media hora (:30)';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [form]);

	// HOOK: useCallback - Manejar submit
	const handleSubmit = useCallback(() => {
		if (validate()) {
			const [hours, minutes] = form.time.split(':').map(n => parseInt(n, 10));
			const start = new Date(form.date);
			start.setHours(hours, minutes, 0, 0);

			const end = new Date(start);
			end.setMinutes(end.getMinutes() + parseInt(form.durationSlots, 10) * 30);

			const appointmentData = {
				id: appointment?.id,
				patientId: form.patientId,
				doctorId: form.doctorId,
				start: start.toISOString(),
				end: end.toISOString(),
				durationSlots: parseInt(form.durationSlots, 10),
				status: form.status,
				notes: form.notes,
			};

			onSubmit(appointmentData);
		}
	}, [form, validate, appointment, onSubmit]);

	if (loadingData) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando datos...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			{error && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)}

			<View style={styles.form}>
				<View style={styles.field}>
					<Text style={styles.label}>Paciente</Text>
					<View style={styles.selectContainer}>
						<Text style={[styles.select, patientId && styles.selectDisabled]}>
							{form.patientId
								? patients.find(p => p.id === form.patientId)
									? `${patients.find(p => p.id === form.patientId)?.nombre || ''} ${
											patients.find(p => p.id === form.patientId)?.apellido || ''
										}`
									: 'Paciente seleccionado'
								: 'Seleccionar paciente'}
						</Text>
					</View>
					{errors.patientId && <Text style={styles.errorText}>{errors.patientId}</Text>}
				</View>

				<View style={styles.field}>
					<Text style={styles.label}>Doctor</Text>
					<TextInput
						style={[styles.select, errors.doctorId && styles.inputError]}
						value={
							form.doctorId
								? doctors.find(d => d.id === form.doctorId)?.nombreCompleto || ''
								: ''
						}
						placeholder="Seleccionar doctor"
						editable={false}
					/>
					{errors.doctorId && <Text style={styles.errorText}>{errors.doctorId}</Text>}
				</View>

				<View style={styles.row}>
					<View style={[styles.field, styles.fieldHalf]}>
						<Text style={styles.label}>Fecha</Text>
						<TextInput
							style={[styles.input, errors.date && styles.inputError]}
							value={form.date}
							onChangeText={value => handleChange('date', value)}
							placeholder="YYYY-MM-DD"
							editable={!loading}
						/>
						{errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
					</View>

					<View style={[styles.field, styles.fieldHalf]}>
						<Text style={styles.label}>Hora</Text>
						<TextInput
							style={[styles.input, errors.time && styles.inputError]}
							value={form.time}
							onChangeText={value => handleChange('time', value)}
							placeholder="HH:MM"
							editable={!loading}
						/>
						{errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
					</View>
				</View>

				<View style={styles.field}>
					<Text style={styles.label}>Duración (slots de 30 min)</Text>
					<TextInput
						style={[styles.input, errors.durationSlots && styles.inputError]}
						value={form.durationSlots}
						onChangeText={value => handleChange('durationSlots', value)}
						keyboardType="numeric"
						editable={!loading}
					/>
					{errors.durationSlots && (
						<Text style={styles.errorText}>{errors.durationSlots}</Text>
					)}
				</View>

				<View style={styles.field}>
					<Text style={styles.label}>Estado</Text>
					<TextInput
						style={styles.input}
						value={form.status}
						onChangeText={value => handleChange('status', value)}
						placeholder="PENDING, CONFIRMED, etc."
						editable={!loading}
					/>
				</View>

				<View style={styles.field}>
					<Text style={styles.label}>Notas</Text>
					<TextInput
						style={styles.textArea}
						value={form.notes}
						onChangeText={value => handleChange('notes', value)}
						multiline
						numberOfLines={3}
						editable={!loading}
					/>
				</View>

				<View style={styles.actions}>
					<Button
						title="Cancelar"
						onPress={onCancel}
						variant="secondary"
						disabled={loading}
					/>
					<Button
						title={appointment ? 'Actualizar' : 'Crear'}
						onPress={handleSubmit}
						variant="primary"
						loading={loading}
						disabled={loading}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		maxHeight: 500,
	},
	loadingContainer: {
		padding: theme.spacing.lg,
		alignItems: 'center',
	},
	loadingText: {
		marginTop: theme.spacing.sm,
		color: theme.colors.gray[600],
	},
	errorContainer: {
		backgroundColor: theme.colors.danger + '20',
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.danger,
		padding: theme.spacing.sm,
		marginBottom: theme.spacing.md,
	},
	errorText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.danger,
	},
	form: {
		gap: theme.spacing.md,
	},
	field: {
		marginBottom: theme.spacing.md,
	},
	fieldHalf: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		gap: theme.spacing.md,
	},
	label: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	input: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
		backgroundColor: theme.colors.white,
	},
	inputError: {
		borderColor: theme.colors.danger,
	},
	selectContainer: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		backgroundColor: theme.colors.white,
	},
	select: {
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
	},
	selectDisabled: {
		backgroundColor: theme.colors.gray[100],
		color: theme.colors.gray[600],
	},
	textArea: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
		backgroundColor: theme.colors.white,
		minHeight: 80,
		textAlignVertical: 'top',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	},
});

