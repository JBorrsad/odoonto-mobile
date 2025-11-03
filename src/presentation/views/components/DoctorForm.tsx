import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { theme } from '../../../core/theme';
import { Button } from './Button';

interface DoctorFormProps {
	doctor?: any;
	onSubmit: (formData: any) => void;
	onCancel: () => void;
	loading?: boolean;
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
	doctor,
	onSubmit,
	onCancel,
	loading = false,
}) => {
	// HOOK: useState - Estado para formulario
	const [form, setForm] = useState({
		nombreCompleto: '',
		especialidad: '',
	});

	// HOOK: useState - Estado para errores
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// HOOK: useEffect - Inicializar formulario cuando cambia doctor
	useEffect(() => {
		if (doctor) {
			setForm({
				nombreCompleto: doctor.nombreCompleto || '',
				especialidad: doctor.especialidad || '',
			});
		}
	}, [doctor]);

	// HOOK: useCallback - Manejar cambio de campos
	const handleChange = useCallback((field: string, value: string) => {
		setForm(prev => ({
			...prev,
			[field]: value,
		}));

		// Limpiar error cuando el usuario comienza a corregir
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

		if (!form.nombreCompleto.trim()) {
			newErrors.nombreCompleto = 'El nombre completo es obligatorio';
		}
		if (!form.especialidad.trim()) {
			newErrors.especialidad = 'La especialidad es obligatoria';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [form]);

	// HOOK: useCallback - Manejar submit
	const handleSubmit = useCallback(() => {
		if (validate()) {
			onSubmit(form);
		}
	}, [form, validate, onSubmit]);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.form}>
				<View style={styles.field}>
					<Text style={styles.label}>Nombre Completo</Text>
					<TextInput
						style={[styles.input, errors.nombreCompleto && styles.inputError]}
						value={form.nombreCompleto}
						onChangeText={value => handleChange('nombreCompleto', value)}
						placeholder="Nombre completo del doctor"
						editable={!loading}
					/>
					{errors.nombreCompleto && (
						<Text style={styles.errorText}>{errors.nombreCompleto}</Text>
					)}
				</View>

				<View style={styles.field}>
					<Text style={styles.label}>Especialidad</Text>
					<TextInput
						style={[styles.input, errors.especialidad && styles.inputError]}
						value={form.especialidad}
						onChangeText={value => handleChange('especialidad', value)}
						placeholder="Especialidad del doctor"
						editable={!loading}
					/>
					{errors.especialidad && (
						<Text style={styles.errorText}>{errors.especialidad}</Text>
					)}
				</View>

				<View style={styles.actions}>
					<Button
						title="Cancelar"
						onPress={onCancel}
						variant="secondary"
						disabled={loading}
					/>
					<Button
						title={doctor ? 'Actualizar' : 'Crear'}
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
		maxHeight: 400,
	},
	form: {
		gap: theme.spacing.md,
	},
	field: {
		marginBottom: theme.spacing.md,
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
	errorText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: theme.spacing.sm,
		marginTop: theme.spacing.lg,
	},
});


