import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../src/core/theme';
import { useDoctor, useDoctorForm } from '../../src/presentation/hooks/useDoctor';
import {
	getDoctorsUseCase,
	searchDoctorsUseCase,
	createDoctorUseCase,
	updateDoctorUseCase,
	deleteDoctorUseCase,
} from '../../src/core/utils/dependencies';
import { Doctor } from '../../src/domain/entities';
import { DoctorForm } from '../../src/presentation/views/components/DoctorForm';
import { CustomModal } from '../../src/presentation/views/components/Modal';
import { Button } from '../../src/presentation/views/components/Button';
import { DoctorsHeader } from '../../src/presentation/views/pages/doctors/components/DoctorsHeader';
import { DoctorsTabs } from '../../src/presentation/views/pages/doctors/components/DoctorsTabs';
import { DoctorsStats } from '../../src/presentation/views/pages/doctors/components/DoctorsStats';
import { DoctorsTable } from '../../src/presentation/views/pages/doctors/components/DoctorsTable';
import { useFormattedDoctors } from '../../src/presentation/views/pages/doctors/hooks/useFormattedDoctors';
import { useFilteredDoctors } from '../../src/presentation/views/pages/doctors/hooks/useFilteredDoctors';

type TabType = 'Doctor Staff' | 'General Staff';

export default function DoctorsPage() {
	const { doctors, loading, error, loadDoctors } = useDoctor(
		getDoctorsUseCase,
		searchDoctorsUseCase
	);

	const { loading: formLoading, createDoctor, updateDoctor } = useDoctorForm(
		createDoctorUseCase,
		updateDoctorUseCase
	);

	const [selectedTab, setSelectedTab] = useState<TabType>('Doctor Staff');
	const [searchQuery, setSearchQuery] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

	const dataLoadedRef = useRef(false);

	useEffect(() => {
		if (!dataLoadedRef.current) {
			dataLoadedRef.current = true;
			loadDoctors();
		}
	}, [loadDoctors]);

	const formattedDoctors = useFormattedDoctors(doctors);
	const filteredDoctors = useFilteredDoctors(formattedDoctors, searchQuery);

	const handleAddDoctor = useCallback(() => {
		setEditingDoctor(null);
		setShowForm(true);
	}, []);

	const handleEditDoctor = useCallback((doctor: Doctor) => {
		setEditingDoctor(doctor);
		setShowForm(true);
	}, []);

	const handleDeleteDoctor = useCallback(
		async (doctorId: string) => {
			Alert.alert(
				'Confirmar Eliminación',
				'¿Estás seguro de que deseas eliminar este doctor? Esta acción no se puede deshacer.',
				[
					{
						text: 'Cancelar',
						style: 'cancel',
					},
					{
						text: 'Eliminar',
						style: 'destructive',
						onPress: async () => {
							try {
								await deleteDoctorUseCase.execute(doctorId);
								loadDoctors();
							} catch (err: any) {
								Alert.alert('Error', err.message || 'Error al eliminar el doctor');
							}
						},
					},
				]
			);
		},
		[loadDoctors]
	);

	const handleSubmitForm = useCallback(
		async (formData: any) => {
			try {
				if (editingDoctor) {
					await updateDoctor(editingDoctor.id, formData);
				} else {
					await createDoctor(formData);
				}
				setShowForm(false);
				setEditingDoctor(null);
				loadDoctors();
			} catch (err: any) {
				Alert.alert(
					'Error',
					err.message || `Error al ${editingDoctor ? 'actualizar' : 'crear'} el doctor`
				);
			}
		},
		[editingDoctor, createDoctor, updateDoctor, loadDoctors]
	);

	const handleTabChange = useCallback((tab: TabType) => {
		setSelectedTab(tab);
	}, []);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando doctores...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>Error: {error}</Text>
				<Button title="Reintentar" onPress={loadDoctors} variant="primary" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<DoctorsHeader
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onAddDoctor={handleAddDoctor}
			/>

			<DoctorsTabs selectedTab={selectedTab} onTabChange={handleTabChange} />

			<DoctorsStats doctorCount={filteredDoctors.length} onAddDoctor={handleAddDoctor} />

			<DoctorsTable
				doctors={filteredDoctors}
				onEdit={handleEditDoctor}
				onDelete={handleDeleteDoctor}
			/>

			<CustomModal
				visible={showForm}
				onClose={() => {
					setShowForm(false);
					setEditingDoctor(null);
				}}
				title={editingDoctor ? 'Editar Doctor' : 'Crear Doctor'}
			>
				<DoctorForm
					doctor={editingDoctor || undefined}
					onSubmit={handleSubmitForm}
					onCancel={() => {
						setShowForm(false);
						setEditingDoctor(null);
					}}
					loading={formLoading}
				/>
			</CustomModal>
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
		padding: theme.spacing.md,
	},
	loadingText: {
		marginTop: theme.spacing.md,
		color: theme.colors.gray[600],
	},
	errorText: {
		color: theme.colors.danger,
		fontSize: theme.fontSizes.md,
		marginBottom: theme.spacing.md,
		textAlign: 'center',
	},
});