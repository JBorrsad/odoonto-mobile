import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../Button';
import { useAppointmentForm } from './hooks/useAppointmentForm';
import { FormField } from './components/FormField';
import { TextAreaField } from './components/TextAreaField';
import { PatientSelectField } from './components/PatientSelectField';
import { DoctorSelectField } from './components/DoctorSelectField';
import { DateTimeRow } from './components/DateTimeRow';

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
	const {
		form,
		errors,
		patients,
		doctors,
		loadingData,
		error,
		handleChange,
		handleSubmit,
	} = useAppointmentForm({
		appointment,
		patientId,
		onSubmit,
	});

	const selectedPatient = patients.find(p => p.id === form.patientId);
	const patientName = selectedPatient
		? `${selectedPatient.nombre || ''} ${selectedPatient.apellido || ''}`
		: undefined;

	const selectedDoctor = doctors.find(d => d.id === form.doctorId);
	const doctorName = selectedDoctor?.nombreCompleto;

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
				<PatientSelectField
					label="Paciente"
					value={form.patientId}
					patientName={patientName}
					error={errors.patientId}
					disabled={!!patientId}
				/>

				<DoctorSelectField
					label="Doctor"
					value={form.doctorId}
					doctorName={doctorName}
					error={errors.doctorId}
				/>

				<DateTimeRow
					date={form.date}
					time={form.time}
					onDateChange={value => handleChange('date', value)}
					onTimeChange={value => handleChange('time', value)}
					dateError={errors.date}
					timeError={errors.time}
					loading={loading}
				/>

				<FormField
					label="Duración (slots de 30 min)"
					value={form.durationSlots}
					onChangeText={value => handleChange('durationSlots', value)}
					error={errors.durationSlots}
					keyboardType="numeric"
					editable={!loading}
				/>

				<FormField
					label="Estado"
					value={form.status}
					onChangeText={value => handleChange('status', value)}
					placeholder="PENDING, CONFIRMED, etc."
					editable={!loading}
				/>

				<TextAreaField
					label="Notas"
					value={form.notes}
					onChangeText={value => handleChange('notes', value)}
					editable={!loading}
				/>

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
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	},
});