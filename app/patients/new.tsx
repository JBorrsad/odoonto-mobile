import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/core/theme';
import { usePatientForm } from '../../src/presentation/hooks/usePatient';
import {
	createPatientUseCase,
	updatePatientUseCase,
} from '../../src/core/utils/dependencies';
import { Sex, Patient } from '../../src/domain/entities';
import { Button } from '../../src/presentation/views/components/Button';

export default function PatientNewPage() {
	const router = useRouter();
	// CUSTOM HOOK: usePatientForm - Hook personalizado para formulario de paciente
	const { loading, error, createPatient } = usePatientForm(
		createPatientUseCase,
		updatePatientUseCase
	);

	// HOOK: useState - Estado para formulario
	const [form, setForm] = useState<Omit<Patient, 'id'>>({
		nombre: '',
		apellido: '',
		fechaNacimiento: '',
		sexo: Sex.MASCULINO,
		telefono: '',
		email: '',
		direccion: {},
	});

	// HOOK: useCallback implícito en el hook - Manejar submit
	const handleSubmit = async () => {
		try {
			await createPatient(form);
			router.back();
		} catch (err) {
			console.error('Error al crear paciente:', err);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>Nuevo Paciente</Text>

				<View style={styles.form}>
					<View style={styles.field}>
						<Text style={styles.label}>Nombre</Text>
						<TextInput
							style={styles.input}
							value={form.nombre}
							onChangeText={text => setForm({ ...form, nombre: text })}
							placeholder="Nombre"
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Apellido</Text>
						<TextInput
							style={styles.input}
							value={form.apellido}
							onChangeText={text => setForm({ ...form, apellido: text })}
							placeholder="Apellido"
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							value={form.email}
							onChangeText={text => setForm({ ...form, email: text })}
							placeholder="email@example.com"
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Teléfono</Text>
						<TextInput
							style={styles.input}
							value={form.telefono}
							onChangeText={text => setForm({ ...form, telefono: text })}
							placeholder="612345678"
							keyboardType="phone-pad"
						/>
					</View>

					<View style={styles.field}>
						<Text style={styles.label}>Fecha de Nacimiento</Text>
						<TextInput
							style={styles.input}
							value={form.fechaNacimiento}
							onChangeText={text => setForm({ ...form, fechaNacimiento: text })}
							placeholder="YYYY-MM-DD"
						/>
					</View>

					{error && <Text style={styles.errorText}>Error: {error}</Text>}

					<View style={styles.actions}>
						<Button
							title="Cancelar"
							onPress={() => router.back()}
							variant="secondary"
							disabled={loading}
						/>
						<Button
							title="Crear"
							onPress={handleSubmit}
							variant="primary"
							loading={loading}
							disabled={loading}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		padding: theme.spacing.md,
	},
	title: {
		fontSize: theme.fontSizes.xxl,
		fontWeight: 'bold',
		color: theme.colors.gray[900],
		marginBottom: theme.spacing.lg,
	},
	form: {
		backgroundColor: theme.colors.white,
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
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
	},
	errorText: {
		color: theme.colors.danger,
		fontSize: theme.fontSizes.sm,
		marginBottom: theme.spacing.md,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: theme.spacing.lg,
		gap: theme.spacing.md,
	},
});

