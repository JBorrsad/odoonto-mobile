import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
	FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../../src/core/theme';
import { usePatientDetail } from '../../src/presentation/hooks/usePatient';
import {
	getPatientByIdUseCase,
	updatePatientUseCase,
	deletePatientUseCase,
} from '../../src/core/utils/dependencies';
import { Card } from '../../src/presentation/views/components/Card';
import { Button } from '../../src/presentation/views/components/Button';
import { apiService } from '../../src/data/services/ApiService';
import { Odontogram } from '../../src/presentation/views/components/Odontogram';

type TabType = 'info' | 'odontogram' | 'appointments';

interface Appointment {
	id: string;
	patientId: string;
	doctorId: string;
	start: string;
	end?: string;
	status: string;
	notes?: string;
	patientName?: string;
	doctorName?: string;
}

export default function PatientDetailPage() {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	// CUSTOM HOOK: usePatientDetail - Hook personalizado para detalle de paciente
	const { patient, loading, error, loadPatient, deletePatient } = usePatientDetail(
		getPatientByIdUseCase,
		updatePatientUseCase,
		deletePatientUseCase
	);

	// HOOK: useState - Estado para tabs
	const [activeTab, setActiveTab] = useState<TabType>('info');

	// HOOK: useState - Estado para odontograma
	const [odontogram, setOdontogram] = useState<any>(null);

	// HOOK: useState - Estado para citas
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	// HOOK: useState - Estado para loading de odontograma y citas
	const [loadingOdontogram, setLoadingOdontogram] = useState(false);
	const [loadingAppointments, setLoadingAppointments] = useState(false);

	// HOOK: useState - Estado para edición
	const [isEditing, setIsEditing] = useState(false);

	// HOOK: useState - Estado para loading de operaciones
	const [deleteLoading, setDeleteLoading] = useState(false);

	// HOOK: useRef - Referencia para evitar múltiples llamadas
	const dataLoadedRef = useRef(false);

	// HOOK: useEffect - Cargar paciente al montar o cuando cambia el id
	useEffect(() => {
		if (id && !dataLoadedRef.current) {
			dataLoadedRef.current = true;
			loadPatient(id);
		}
	}, [id, loadPatient]);

	// HOOK: useEffect - Cargar odontograma y citas cuando el paciente esté cargado
	useEffect(() => {
		if (patient && id) {
			loadOdontogram();
			loadAppointments();
		}
	}, [patient, id]);

	// HOOK: useCallback - Función memoizada para cargar odontograma
	const loadOdontogram = useCallback(async () => {
		if (!id) return;

		setLoadingOdontogram(true);
		try {
			const response = await apiService.getPatientOdontogram(id);
			setOdontogram(response.data);
		} catch (err: any) {
			// Solo mostrar error si no es un 404 o 500 (odontograma no existe aún)
			if (err.response?.status !== 404 && err.response?.status !== 500) {
				console.error('Error inesperado al cargar odontograma:', err);
			}
			setOdontogram(null);
		} finally {
			setLoadingOdontogram(false);
		}
	}, [id]);

	// HOOK: useCallback - Función memoizada para cargar citas
	const loadAppointments = useCallback(async () => {
		if (!id) return;

		setLoadingAppointments(true);
		try {
			const response = await apiService.getAppointmentsByPatient(id);
			setAppointments(response.data || []);
		} catch (err) {
			console.error('Error al cargar citas:', err);
			setAppointments([]);
		} finally {
			setLoadingAppointments(false);
		}
	}, [id]);

	// HOOK: useMemo - Calcular edad del paciente
	const patientAge = useMemo(() => {
		if (!patient?.fechaNacimiento) return 'N/A';

		try {
			const birth = new Date(patient.fechaNacimiento);
			const today = new Date();
			let age = today.getFullYear() - birth.getFullYear();
			const monthDiff = today.getMonth() - birth.getMonth();

			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
				age--;
			}

			return age;
		} catch (error) {
			return 'N/A';
		}
	}, [patient?.fechaNacimiento]);

	// HOOK: useMemo - Determinar si es niño (menor de 18 años)
	const isChild = useMemo(() => {
		if (typeof patientAge === 'number') {
			return patientAge < 18;
		}
		return false;
	}, [patientAge]);

	// HOOK: useCallback - Función memoizada para formatear dirección
	const formatAddress = useCallback((direccion: any): string => {
		if (!direccion) return 'Sin dirección registrada';

		const parts: string[] = [];
		if (direccion.calle) parts.push(direccion.calle);
		if (direccion.numero) parts.push(direccion.numero);
		if (direccion.colonia) parts.push(direccion.colonia);
		if (direccion.ciudad) parts.push(direccion.ciudad);
		if (direccion.estado) parts.push(direccion.estado);

		return parts.length > 0 ? parts.join(', ') : 'Sin dirección registrada';
	}, []);

	// HOOK: useCallback - Función memoizada para formatear fecha
	const formatDate = useCallback((dateString: string | undefined): string => {
		if (!dateString) return 'N/A';

		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(date);
		} catch (error) {
			return 'N/A';
		}
	}, []);

	// HOOK: useCallback - Función memoizada para obtener clase de estado
	const getStatusStyle = useCallback((status: string) => {
		const statusLower = status?.toLowerCase();
		switch (statusLower) {
			case 'confirmed':
			case 'confirmada':
				return { bg: theme.colors.success + '20', text: theme.colors.success };
			case 'pending':
			case 'pendiente':
				return { bg: theme.colors.warning + '20', text: theme.colors.warning };
			case 'waiting_room':
			case 'en_sala':
				return { bg: theme.colors.primary + '20', text: theme.colors.primary };
			case 'in_progress':
			case 'en_curso':
				return { bg: '#9333ea20', text: '#9333ea' }; // purple
			default:
				return { bg: theme.colors.gray[100], text: theme.colors.gray[700] };
		}
	}, []);

	// HOOK: useCallback - Manejar eliminación de paciente
	const handleDeletePatient = useCallback(async () => {
		if (!patient || !id) return;

		Alert.alert(
			'Confirmar Eliminación',
			'¿Estás seguro de que deseas eliminar este paciente? Esta acción no se puede deshacer.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						setDeleteLoading(true);
						try {
							await deletePatient(id);
							router.back();
						} catch (err) {
							setDeleteLoading(false);
							Alert.alert('Error', 'No se pudo eliminar el paciente');
						}
					},
				},
			]
		);
	}, [patient, id, deletePatient, router]);

	// HOOK: useCallback - Manejar actualización de odontograma
	const handleOdontogramUpdate = useCallback((updatedOdontogram: any) => {
		setOdontogram(updatedOdontogram);
	}, []);

	// HOOK: useCallback - Manejar cambio de tab
	const handleTabChange = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, []);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando paciente...</Text>
			</View>
		);
	}

	if (error || !patient) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>Error: {error || 'Paciente no encontrado'}</Text>
				<Button title="Volver" onPress={() => router.back()} variant="secondary" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header con nombre y botones */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.headerTitle}>
						{patient.nombre} {patient.apellido}
					</Text>
				</View>
				<View style={styles.headerRight}>
					{!isEditing && (
						<>
							<Button
								title="Editar"
								onPress={() => setIsEditing(true)}
								variant="secondary"
							/>
							<Button
								title="Eliminar"
								onPress={handleDeletePatient}
								variant="danger"
								loading={deleteLoading}
							/>
						</>
					)}
					<Button title="Volver" onPress={() => router.back()} variant="secondary" />
				</View>
			</View>

			{/* Tabs */}
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'info' && styles.tabActive]}
					onPress={() => handleTabChange('info')}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === 'info' && styles.tabTextActive,
						]}
					>
						Información
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'odontogram' && styles.tabActive]}
					onPress={() => handleTabChange('odontogram')}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === 'odontogram' && styles.tabTextActive,
						]}
					>
						Odontograma
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === 'appointments' && styles.tabActive]}
					onPress={() => handleTabChange('appointments')}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === 'appointments' && styles.tabTextActive,
						]}
					>
						Historial de Citas
					</Text>
				</TouchableOpacity>
			</View>

			{/* Contenido según tab activo */}
			<ScrollView style={styles.content}>
				{activeTab === 'info' && (
					<Card title="Información Personal">
						<View style={styles.infoGrid}>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Edad:</Text>
								<Text style={styles.infoValue}>{patientAge} años</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Sexo:</Text>
								<Text style={styles.infoValue}>
									{patient.sexo === 'MASCULINO'
										? 'Masculino'
										: patient.sexo === 'FEMENINO'
											? 'Femenino'
											: patient.sexo || 'No especificado'}
								</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
								<Text style={styles.infoValue}>
									{patient.fechaNacimiento
										? new Date(patient.fechaNacimiento).toLocaleDateString('es-ES')
										: 'No registrada'}
								</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Teléfono:</Text>
								<Text style={styles.infoValue}>{patient.telefono || 'Sin teléfono'}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Email:</Text>
								<Text style={styles.infoValue}>{patient.email || 'Sin email'}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={styles.infoLabel}>Dirección:</Text>
								<Text style={styles.infoValue}>{formatAddress(patient.direccion)}</Text>
							</View>
						</View>

						{/* Próxima Cita */}
						<View style={styles.nextAppointmentSection}>
							<Text style={styles.sectionTitle}>Próxima Cita</Text>
							{appointments && appointments.length > 0 ? (
								<View style={styles.nextAppointmentCard}>
									<Text style={styles.nextAppointmentDate}>
										{formatDate(appointments[0].start)}
									</Text>
									<Text style={styles.nextAppointmentDoctor}>
										Dr. {appointments[0].doctorName || appointments[0].doctorId || 'N/A'}
									</Text>
									<Text style={styles.nextAppointmentNotes}>
										{appointments[0].notes || 'Sin notas'}
									</Text>
									<View
										style={[
											styles.statusBadge,
											{ backgroundColor: getStatusStyle(appointments[0].status).bg },
										]}
									>
										<Text
											style={[
												styles.statusText,
												{ color: getStatusStyle(appointments[0].status).text },
											]}
										>
											{appointments[0].status || 'Sin estado'}
										</Text>
									</View>
								</View>
							) : (
								<Text style={styles.noAppointmentText}>No hay citas programadas</Text>
							)}
						</View>
					</Card>
				)}

				{activeTab === 'odontogram' && (
					<Card title="Odontograma">
						{loadingOdontogram ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="small" color={theme.colors.primary} />
								<Text style={styles.loadingText}>Cargando odontograma...</Text>
							</View>
						) : (
							<Odontogram
								patientId={id!}
								data={odontogram}
								isChild={isChild}
								isEditable={true}
								onUpdate={handleOdontogramUpdate}
							/>
						)}
					</Card>
				)}

				{activeTab === 'appointments' && (
					<Card
						title="Historial de Citas"
						style={styles.appointmentsCard}
					>
						<View style={styles.appointmentsHeader}>
							<TouchableOpacity
								style={styles.newAppointmentButton}
								onPress={() => router.push(`/schedule?patientId=${id}`)}
							>
								<Text style={styles.newAppointmentButtonText}>Nueva Cita</Text>
							</TouchableOpacity>
						</View>

						{loadingAppointments ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="small" color={theme.colors.primary} />
								<Text style={styles.loadingText}>Cargando citas...</Text>
							</View>
						) : appointments && appointments.length > 0 ? (
							<FlatList
								data={appointments}
								keyExtractor={item => item.id}
								renderItem={({ item }) => (
									<View style={styles.appointmentItem}>
										<View style={styles.appointmentItemHeader}>
											<Text style={styles.appointmentDate}>{formatDate(item.start)}</Text>
											<View
												style={[
													styles.statusBadge,
													{ backgroundColor: getStatusStyle(item.status).bg },
												]}
											>
												<Text
													style={[
														styles.statusText,
														{ color: getStatusStyle(item.status).text },
													]}
												>
													{item.status || 'Sin estado'}
												</Text>
											</View>
										</View>
										<Text style={styles.appointmentDoctor}>
											Dr. {item.doctorName || item.doctorId || 'N/A'}
										</Text>
										{item.notes && (
											<Text style={styles.appointmentNotes}>{item.notes}</Text>
										)}
									</View>
								)}
								scrollEnabled={false}
							/>
						) : (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>No hay citas en el historial</Text>
							</View>
						)}
					</Card>
				)}
			</ScrollView>
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
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		flexWrap: 'wrap',
		gap: theme.spacing.sm,
	},
	headerLeft: {
		flex: 1,
	},
	headerTitle: {
		fontSize: theme.fontSizes.xl,
		fontWeight: 'bold',
		color: theme.colors.gray[900],
	},
	headerRight: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
		flexWrap: 'wrap',
	},
	tabsContainer: {
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	tab: {
		flex: 1,
		padding: theme.spacing.md,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
		alignItems: 'center',
	},
	tabActive: {
		borderBottomColor: theme.colors.primary,
	},
	tabText: {
		fontSize: theme.fontSizes.md,
		fontWeight: '500',
		color: theme.colors.gray[500],
	},
	tabTextActive: {
		color: theme.colors.primary,
		fontWeight: '600',
	},
	content: {
		flex: 1,
	},
	infoGrid: {
		gap: theme.spacing.md,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: theme.spacing.sm,
	},
	infoLabel: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[500],
	},
	infoValue: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[900],
	},
	sectionTitle: {
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
		color: theme.colors.gray[900],
		marginBottom: theme.spacing.md,
		marginTop: theme.spacing.lg,
	},
	nextAppointmentSection: {
		marginTop: theme.spacing.lg,
	},
	nextAppointmentCard: {
		backgroundColor: theme.colors.gray[50],
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		marginTop: theme.spacing.sm,
	},
	nextAppointmentDate: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
		marginBottom: theme.spacing.xs,
	},
	nextAppointmentDoctor: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
		marginBottom: theme.spacing.xs,
	},
	nextAppointmentNotes: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	noAppointmentText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
		marginTop: theme.spacing.sm,
	},
	statusBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		alignSelf: 'flex-start',
		marginTop: theme.spacing.xs,
	},
	statusText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	appointmentsCard: {
		marginBottom: theme.spacing.lg,
	},
	appointmentsHeader: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: theme.spacing.md,
	},
	newAppointmentButton: {
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	newAppointmentButtonText: {
		color: theme.colors.white,
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
	},
	appointmentItem: {
		paddingVertical: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	appointmentItemHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing.xs,
	},
	appointmentDate: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	appointmentDoctor: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
		marginBottom: theme.spacing.xs,
	},
	appointmentNotes: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[700],
		marginTop: theme.spacing.xs,
	},
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: theme.spacing.lg,
	},
	emptyContainer: {
		alignItems: 'center',
		paddingVertical: theme.spacing.xl,
	},
	emptyText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[500],
		textAlign: 'center',
	},
});
