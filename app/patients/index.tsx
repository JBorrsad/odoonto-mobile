import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/core/theme';
import { getPatientsUseCase, searchPatientsUseCase } from '../../src/core/utils/dependencies';
import { usePatientsPage } from '../../src/presentation/views/pages/patients/hooks/usePatientsPage';
import { PatientsHeader } from '../../src/presentation/views/pages/patients/components/PatientsHeader';
import { PatientsTable } from '../../src/presentation/views/pages/patients/components/PatientsTable';
import { PatientsGrid } from '../../src/presentation/views/pages/patients/components/PatientsGrid';

export default function PatientsPage() {
	const router = useRouter();

	// CUSTOM HOOK: usePatientsPage - Hook personalizado para lógica de PatientsPage
	const { patients, loading, error, viewMode, searchQuery, setSearchQuery, handleViewModeChange } =
		usePatientsPage(getPatientsUseCase, searchPatientsUseCase);

	// HOOK: useCallback - Manejar navegación a detalle de paciente
	const handlePatientPress = React.useCallback(
		(patientId: string) => {
			router.push(`/patients/${patientId}`);
		},
		[router]
	);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando pacientes...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>Error: {error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<PatientsHeader
				patientCount={patients.length}
				viewMode={viewMode}
				onViewModeChange={handleViewModeChange}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{patients.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No se encontraron pacientes</Text>
				</View>
			) : viewMode === 'table' ? (
				<PatientsTable patients={patients} onPatientPress={handlePatientPress} />
			) : (
				<PatientsGrid patients={patients} onPatientPress={handlePatientPress} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.background,
	},
	loadingText: {
		marginTop: theme.spacing.md,
		color: theme.colors.gray[600],
	},
	errorText: {
		color: theme.colors.danger,
		fontSize: theme.fontSizes.md,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.md,
	},
	emptyText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[500],
		textAlign: 'center',
	},
});
