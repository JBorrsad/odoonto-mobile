import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	TextInput,
	Alert,
} from 'react-native';
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
import { DoctorAvatar } from '../../src/presentation/views/components/DoctorAvatar';
import { WorkingDays } from '../../src/presentation/views/components/WorkingDays';
import { DoctorForm } from '../../src/presentation/views/components/DoctorForm';
import { CustomModal } from '../../src/presentation/views/components/Modal';
import { Button } from '../../src/presentation/views/components/Button';

type FormattedDoctor = Doctor & {
	initials: string;
	workingDays: number[];
	phone: string;
	email: string;
	services: string[];
	isFullTime: boolean;
};

type TabType = 'Doctor Staff' | 'General Staff';

export default function DoctorsPage() {

	// CUSTOM HOOK: useDoctor - Hook personalizado para gestión de doctores
	const { doctors, loading, error, loadDoctors } = useDoctor(
		getDoctorsUseCase,
		searchDoctorsUseCase
	);

	// CUSTOM HOOK: useDoctorForm - Hook personalizado para formulario de doctor
	const { loading: formLoading, createDoctor, updateDoctor } = useDoctorForm(
		createDoctorUseCase,
		updateDoctorUseCase
	);

	// HOOK: useState - Estado para tab seleccionado
	const [selectedTab, setSelectedTab] = useState<TabType>('Doctor Staff');

	// HOOK: useState - Estado para búsqueda
	const [searchQuery, setSearchQuery] = useState('');

	// HOOK: useState - Estado para modal de formulario
	const [showForm, setShowForm] = useState(false);

	// HOOK: useState - Estado para doctor en edición
	const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);


	// HOOK: useRef - Referencia para evitar múltiples llamadas
	const dataLoadedRef = useRef(false);

	// HOOK: useEffect - Cargar doctores al montar
	useEffect(() => {
		if (!dataLoadedRef.current) {
			dataLoadedRef.current = true;
			loadDoctors();
		}
	}, [loadDoctors]);

	// HOOK: useMemo - Función para generar iniciales (memoizada)
	const generateInitials = useCallback((nombreCompleto: string): string => {
		const nameParts = nombreCompleto ? nombreCompleto.split(' ') : ['D', 'R'];
		return `${nameParts[0]?.charAt(0) || 'D'}${nameParts.length > 1 ? nameParts[1].charAt(0) : 'R'}`;
	}, []);

	// HOOK: useMemo - Función para generar días trabajando (memoizada)
	const generateWorkingDays = useCallback((doctorId: string): number[] => {
		const workingDays: number[] = [];
		const idSeed = doctorId.slice(-4);
		for (let i = 0; i < 7; i++) {
			if (idSeed.charCodeAt(i % idSeed.length) % 2 === 0) {
				workingDays.push(i);
			}
		}
		return workingDays;
	}, []);

	// HOOK: useMemo - Función para generar teléfono (memoizada)
	const generatePhone = useCallback((doctorId: string): string => {
		const idSum = doctorId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
		return `${100 + (idSum % 900)} 555-${(1000 + (idSum % 9000)).toString().padStart(4, '0')}`;
	}, []);

	// HOOK: useMemo - Función para generar email (memoizada)
	const generateEmail = useCallback((nombreCompleto: string): string => {
		const nameParts = nombreCompleto ? nombreCompleto.split(' ') : ['doctor'];
		return `${nameParts[0].toLowerCase()}@avicena.com`;
	}, []);

	// HOOK: useMemo - Función para generar servicios (memoizada)
	const generateServices = useCallback((especialidad: string): string[] => {
		const services: string[] = [];
		if (
			especialidad.includes('1') ||
			especialidad.includes('3') ||
			especialidad.includes('5')
		) {
			services.push('Dental service');
		}
		if (especialidad.includes('2') || especialidad.includes('4')) {
			services.push('Oral Disease service');
		}
		if (services.length === 0) {
			services.push('Dental service');
		}
		return services;
	}, []);

	// HOOK: useMemo - Formatear doctores con información adicional
	const formattedDoctors = useMemo((): FormattedDoctor[] => {
		return doctors.map(doctor => {
			const initials = generateInitials(doctor.nombreCompleto);
			const workingDays = generateWorkingDays(doctor.id);
			const phone = generatePhone(doctor.id);
			const email = generateEmail(doctor.nombreCompleto);
			const services = generateServices(doctor.especialidad);
			const isFullTime = doctor.id.charCodeAt(0) % 2 === 0;

			return {
				...doctor,
				initials,
				workingDays,
				phone,
				email,
				services,
				isFullTime,
			};
		});
	}, [
		doctors,
		generateInitials,
		generateWorkingDays,
		generatePhone,
		generateEmail,
		generateServices,
	]);

	// HOOK: useMemo - Filtrar doctores según búsqueda y tab
	const filteredDoctors = useMemo(() => {
		let filtered = formattedDoctors;

		// Filtrar por búsqueda
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				doctor =>
					doctor.nombreCompleto.toLowerCase().includes(query) ||
					doctor.especialidad.toLowerCase().includes(query) ||
					doctor.email.toLowerCase().includes(query)
			);
		}

		// Filtrar por tab (por ahora todos son Doctor Staff)
		// En el futuro se puede filtrar por tipo de staff

		return filtered;
	}, [formattedDoctors, searchQuery]);

	// HOOK: useCallback - Manejar agregar doctor
	const handleAddDoctor = useCallback(() => {
		setEditingDoctor(null);
		setShowForm(true);
	}, []);

	// HOOK: useCallback - Manejar editar doctor
	const handleEditDoctor = useCallback((doctor: Doctor) => {
		setEditingDoctor(doctor);
		setShowForm(true);
	}, []);

	// HOOK: useCallback - Manejar eliminar doctor
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
							loadDoctors(); // Recargar lista
						} catch (err: any) {
							Alert.alert('Error', err.message || 'Error al eliminar el doctor');
						}
					},
					},
				]
			);
		},
		[deleteDoctorUseCase, loadDoctors]
	);

	// HOOK: useCallback - Manejar submit del formulario
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
				loadDoctors(); // Recargar lista
			} catch (err: any) {
				Alert.alert(
					'Error',
					err.message ||
						`Error al ${editingDoctor ? 'actualizar' : 'crear'} el doctor`
				);
			}
		},
		[editingDoctor, createDoctor, updateDoctor, loadDoctors]
	);

	// HOOK: useCallback - Manejar cambio de tab
	const handleTabChange = useCallback((tab: TabType) => {
		setSelectedTab(tab);
	}, []);

	// HOOK: useCallback - Renderizar fila de tabla
	const renderTableRow = useCallback(
		({ item }: { item: FormattedDoctor }) => (
			<View style={styles.tableRow}>
				<View style={styles.tableCell}>
					<View style={styles.doctorNameCell}>
						<DoctorAvatar nombreCompleto={item.nombreCompleto} initial={item.initials} />
						<View style={styles.doctorNameInfo}>
							<Text style={styles.doctorNameText}>{item.nombreCompleto}</Text>
							<Text style={styles.doctorSpecialtyText}>Pediatric Dentistry</Text>
						</View>
					</View>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.phone}</Text>
					<Text style={styles.tableCellTextSmall}>{item.email}</Text>
				</View>
				<View style={styles.tableCell}>
					<WorkingDays days={item.workingDays} />
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>
						{item.services.join(', ')}
						{item.services.length > 1 && (
							<Text style={styles.tableCellTextSmall}>
								{' '}
								+{item.services.length - 1}
							</Text>
						)}
					</Text>
				</View>
				<View style={styles.tableCell}>
					<View
						style={[
							styles.typeBadge,
							item.isFullTime
								? styles.typeBadgeFullTime
								: styles.typeBadgePartTime,
						]}
					>
						<Text
							style={[
								styles.typeBadgeText,
								item.isFullTime
									? styles.typeBadgeTextFullTime
									: styles.typeBadgeTextPartTime,
							]}
						>
							{item.isFullTime ? 'FULL-TIME' : 'PART-TIME'}
						</Text>
					</View>
				</View>
				<View style={styles.tableCell}>
					<TouchableOpacity
						style={styles.menuButton}
						onPress={() => {
							// Menu de opciones (editar/eliminar)
							Alert.alert(
								'Opciones',
								'Selecciona una opción',
								[
									{
										text: 'Editar',
										onPress: () => handleEditDoctor(item),
									},
									{
										text: 'Eliminar',
										style: 'destructive',
										onPress: () => handleDeleteDoctor(item.id),
									},
									{
										text: 'Cancelar',
										style: 'cancel',
									},
								]
							);
						}}
					>
						<Text style={styles.menuButtonText}>⋮</Text>
					</TouchableOpacity>
				</View>
			</View>
		),
		[handleEditDoctor, handleDeleteDoctor]
	);

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
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Staff List</Text>
				<View style={styles.headerActions}>
					<TextInput
						style={styles.searchInput}
						placeholder="Search for anything here..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholderTextColor={theme.colors.gray[400]}
					/>
					<TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
						<Text style={styles.addButtonText}>+</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Tabs */}
			<View style={styles.tabsContainer}>
				<TouchableOpacity
					style={[
						styles.tab,
						selectedTab === 'Doctor Staff' && styles.tabActive,
					]}
					onPress={() => handleTabChange('Doctor Staff')}
				>
					<Text
						style={[
							styles.tabText,
							selectedTab === 'Doctor Staff' && styles.tabTextActive,
						]}
					>
						Doctor Staff
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, selectedTab === 'General Staff' && styles.tabActive]}
					onPress={() => handleTabChange('General Staff')}
				>
					<Text
						style={[
							styles.tabText,
							selectedTab === 'General Staff' && styles.tabTextActive,
						]}
					>
						General Staff
					</Text>
				</TouchableOpacity>
			</View>

			{/* Doctor count and filters */}
			<View style={styles.statsContainer}>
				<View style={styles.statsLeft}>
					<Text style={styles.doctorCount}>120</Text>
					<Text style={styles.doctorCountLabel}>Doctor</Text>
				</View>
				<View style={styles.statsRight}>
					<TouchableOpacity style={styles.filterButton}>
						<Text style={styles.filterButtonText}>Filters</Text>
					</TouchableOpacity>
					<Button title="Add Doctor" onPress={handleAddDoctor} variant="primary" />
				</View>
			</View>

			{/* Tabla de doctores */}
			{filteredDoctors.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						No se encontraron doctores en la base de datos. Por favor, verifica la
						conexión al servidor o agrega nuevos doctores.
					</Text>
				</View>
			) : (
				<ScrollView horizontal style={styles.tableContainer}>
					<View style={styles.table}>
						{/* Header de tabla */}
						<View style={styles.tableHeader}>
							<Text style={styles.tableHeaderText}>NAME</Text>
							<Text style={styles.tableHeaderText}>CONTACT</Text>
							<Text style={styles.tableHeaderText}>WORKING DAYS</Text>
							<Text style={styles.tableHeaderText}>ASSIGNED TREATMENT</Text>
							<Text style={styles.tableHeaderText}>TYPE</Text>
							<Text style={styles.tableHeaderText}></Text>
						</View>

						{/* Filas de tabla */}
						{filteredDoctors.map(item => (
							<View key={item.id}>{renderTableRow({ item })}</View>
						))}
					</View>
				</ScrollView>
			)}

			{/* Modal de formulario */}
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
	headerTitle: {
		fontSize: theme.fontSizes.xl,
		fontWeight: '600',
		color: theme.colors.gray[800],
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	searchInput: {
		backgroundColor: theme.colors.gray[100],
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.full,
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[900],
		width: 200,
		paddingLeft: theme.spacing.md,
	},
	addButton: {
		backgroundColor: theme.colors.primary,
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addButtonText: {
		color: theme.colors.white,
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
	},
	tabsContainer: {
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		paddingHorizontal: theme.spacing.md,
	},
	tab: {
		padding: theme.spacing.md,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
		marginRight: theme.spacing.md,
	},
	tabActive: {
		borderBottomColor: theme.colors.primary,
	},
	tabText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '500',
		color: theme.colors.gray[500],
	},
	tabTextActive: {
		color: theme.colors.primary,
		fontWeight: '600',
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	statsLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	doctorCount: {
		fontSize: theme.fontSizes.xl,
		fontWeight: '600',
		color: theme.colors.gray[800],
		marginRight: theme.spacing.xs,
	},
	doctorCountLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	statsRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	filterButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.gray[100],
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		gap: theme.spacing.xs,
	},
	filterButtonText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
	tableContainer: {
		flex: 1,
	},
	table: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		overflow: 'hidden',
		minWidth: '100%',
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		padding: theme.spacing.md,
	},
	tableHeaderText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
		color: theme.colors.gray[500],
		textTransform: 'uppercase',
		flex: 1,
		minWidth: 120,
	},
	tableRow: {
		flexDirection: 'row',
		padding: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	tableCell: {
		flex: 1,
		minWidth: 120,
		justifyContent: 'center',
	},
	doctorNameCell: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	doctorNameInfo: {
		flex: 1,
	},
	doctorNameText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	doctorSpecialtyText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
		marginTop: theme.spacing.xs / 2,
	},
	tableCellText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.primary,
	},
	tableCellTextSmall: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
	},
	typeBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.full,
		alignSelf: 'flex-start',
	},
	typeBadgeFullTime: {
		backgroundColor: theme.colors.success + '20',
	},
	typeBadgePartTime: {
		backgroundColor: theme.colors.warning + '20',
	},
	typeBadgeText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	typeBadgeTextFullTime: {
		color: theme.colors.success,
	},
	typeBadgeTextPartTime: {
		color: theme.colors.warning,
	},
	menuButton: {
		padding: theme.spacing.xs,
		alignSelf: 'flex-end',
	},
	menuButtonText: {
		fontSize: theme.fontSizes.xl,
		color: theme.colors.gray[400],
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		margin: theme.spacing.md,
	},
	emptyText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[500],
		textAlign: 'center',
	},
});
