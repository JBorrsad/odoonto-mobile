import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	Alert,
	ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../../src/core/theme';
import { useAppointment } from '../../src/presentation/hooks/useAppointment';
import { useDoctor } from '../../src/presentation/hooks/useDoctor';
import {
	getAppointmentsUseCase,
	getAppointmentsByDoctorUseCase,
	createAppointmentUseCase,
	updateAppointmentUseCase,
	deleteAppointmentUseCase,
	getDoctorsUseCase,
	searchDoctorsUseCase,
} from '../../src/core/utils/dependencies';
import { CalendarHeader } from '../../src/presentation/views/components/schedule/CalendarHeader';
import { CalendarView } from '../../src/presentation/views/components/schedule/CalendarView';
import { AppointmentForm } from '../../src/presentation/views/components/schedule/AppointmentForm';
import { AppointmentDetail } from '../../src/presentation/views/components/schedule/AppointmentDetail';
import { CustomModal } from '../../src/presentation/views/components/Modal';

type ViewType = 'day' | 'week';

interface AppointmentCalendarData {
	id: string;
	patientId: string;
	doctorId: string;
	start: string;
	end?: string;
	status: string;
	notes?: string;
	patientName?: string;
	doctorName?: string;
	startTime: string;
	endTime: string;
	treatment?: string;
	color?: string;
	startSlot: number;
	endSlot: number;
}

export default function SchedulePage() {
	const { patientId } = useLocalSearchParams<{ patientId?: string }>();

	// CUSTOM HOOK: useAppointment - Hook personalizado para gestión de citas
	const { appointments, loading, error, loadAppointments, createAppointment, updateAppointment, deleteAppointment } = useAppointment(
		getAppointmentsUseCase,
		getAppointmentsByDoctorUseCase,
		createAppointmentUseCase,
		updateAppointmentUseCase,
		deleteAppointmentUseCase
	);

	// CUSTOM HOOK: useDoctor - Hook personalizado para gestión de doctores
	const { doctors, loadDoctors } = useDoctor(
		getDoctorsUseCase,
		searchDoctorsUseCase
	);

	// HOOK: useState - Estado para fecha actual
	const [date, setDate] = useState<Date>(new Date(2025, 4, 16));

	// HOOK: useState - Estado para tipo de vista
	const [viewType, setViewType] = useState<ViewType>('day');

	// HOOK: useState - Estado para doctor seleccionado
	const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

	// HOOK: useState - Estado para modales
	const [showNewModal, setShowNewModal] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// HOOK: useState - Estado para cita actual
	const [currentAppointment, setCurrentAppointment] = useState<AppointmentCalendarData | null>(null);

	// HOOK: useState - Estado para loading de operaciones
	const [operationLoading, setOperationLoading] = useState(false);

	// HOOK: useRef - Referencia para evitar múltiples llamadas
	const dataLoadedRef = useRef(false);

	// HOOK: useEffect - Cargar datos al montar
	useEffect(() => {
		if (!dataLoadedRef.current) {
			dataLoadedRef.current = true;
			loadAppointments();
			loadDoctors();
		}
	}, [loadAppointments, loadDoctors]);


	// HOOK: useMemo - Contar citas para la fecha seleccionada
	const appointmentsForDate = useMemo(() => {
		return appointments.filter(appointment => {
			const apptDate = new Date(appointment.start);
			return apptDate.toDateString() === date.toDateString();
		});
	}, [appointments, date]);

	// HOOK: useMemo - Transformar citas al formato del calendario
	const formattedAppointments = useMemo((): AppointmentCalendarData[] => {
		return appointmentsForDate.map(appointment => {
			const start = new Date(appointment.start);
			const end = appointment.end ? new Date(appointment.end) : new Date(start.getTime() + 30 * 60000);

			// Calcular slots (8:00 = slot 0, cada 30 min = 1 slot)
			const startHour = start.getHours();
			const startMinutes = start.getMinutes();
			const startSlot = (startHour - 8) * 2 + (startMinutes === 30 ? 1 : 0);

			const endHour = end.getHours();
			const endMinutes = end.getMinutes();
			const endSlot = (endHour - 8) * 2 + (endMinutes === 30 ? 1 : 0) - 1;

			const startTimeStr = start.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			});
			const endTimeStr = end.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			});

			// Colores para las citas
			const colors = ['pink', 'green', 'blue', 'yellow'];
			const colorIndex = parseInt(appointment.id) % colors.length;

			return {
				...appointment,
				startTime: startTimeStr,
				endTime: endTimeStr,
				treatment: appointment.treatment || 'Consulta',
				color: colors[colorIndex],
				startSlot,
				endSlot: Math.max(startSlot, endSlot),
				patientName: appointment.patientName || appointment.patientId,
				doctorName: appointment.doctorId, // TODO: Obtener nombre del doctor desde la lista de doctores
				doctorId: appointment.doctorId,
			};
		});
	}, [appointmentsForDate]);

	// HOOK: useMemo - Formatear doctores para el calendario
	const formattedDoctors = useMemo(() => {
		return doctors.map(doctor => ({
			id: doctor.id,
			name: doctor.nombreCompleto,
			appointments: formattedAppointments.filter(a => a.doctorId === doctor.id).length,
			patients: new Set(formattedAppointments.filter(a => a.doctorId === doctor.id).map(a => a.patientId)).size,
		}));
	}, [doctors, formattedAppointments]);

	// HOOK: useCallback - Manejar navegación día anterior
	const handlePrevDay = useCallback(() => {
		const newDate = new Date(date);
		newDate.setDate(date.getDate() - 1);
		setDate(newDate);
	}, [date]);

	// HOOK: useCallback - Manejar navegación día siguiente
	const handleNextDay = useCallback(() => {
		const newDate = new Date(date);
		newDate.setDate(date.getDate() + 1);
		setDate(newDate);
	}, [date]);

	// HOOK: useCallback - Manejar navegación semana anterior
	const handlePrevWeek = useCallback(() => {
		const newDate = new Date(date);
		newDate.setDate(date.getDate() - 7);
		setDate(newDate);
	}, [date]);

	// HOOK: useCallback - Manejar navegación semana siguiente
	const handleNextWeek = useCallback(() => {
		const newDate = new Date(date);
		newDate.setDate(date.getDate() + 7);
		setDate(newDate);
	}, [date]);

	// HOOK: useCallback - Manejar ir a hoy
	const handleToday = useCallback(() => {
		setDate(new Date(2025, 4, 16)); // Fijar a 16 de mayo de 2025 para demostración
	}, []);

	// HOOK: useCallback - Manejar cambio de doctor
	const handleDoctorChange = useCallback((doctorId: string | null) => {
		setSelectedDoctor(doctorId);
	}, []);

	// HOOK: useCallback - Manejar clic en slot
	const handleSlotPress = useCallback(
		(slotIndex: number, dentistId: string) => {
			// Calcular hora del slot
			const hour = 8 + Math.floor(slotIndex / 2);
			const minutes = (slotIndex % 2) * 30;
			const slotDate = new Date(date);
			slotDate.setHours(hour, minutes, 0, 0);

			setCurrentAppointment({
				id: '',
				patientId: patientId || '',
				doctorId: dentistId,
				start: slotDate.toISOString(),
				status: 'PENDING',
				startSlot: slotIndex - 2,
				endSlot: slotIndex - 1,
				startTime: slotDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
				endTime: new Date(slotDate.getTime() + 30 * 60000).toLocaleTimeString('es-ES', {
					hour: '2-digit',
					minute: '2-digit',
				}),
				treatment: 'Consulta',
			} as AppointmentCalendarData);
			setShowNewModal(true);
		},
		[date, patientId]
	);

	// HOOK: useCallback - Manejar clic en cita
	const handleAppointmentPress = useCallback((appointment: AppointmentCalendarData) => {
		setCurrentAppointment(appointment);
		setShowDetailModal(true);
	}, []);

	// HOOK: useCallback - Manejar crear cita
	const handleCreateAppointment = useCallback(
		async (formData: any) => {
			try {
				setOperationLoading(true);
				await createAppointment(formData);
				setShowNewModal(false);
				setCurrentAppointment(null);
				loadAppointments();
			} catch (err: any) {
				Alert.alert('Error', err.message || 'Error al crear la cita');
			} finally {
				setOperationLoading(false);
			}
		},
		[createAppointment, loadAppointments]
	);

	// HOOK: useCallback - Manejar actualizar cita (se usa en AppointmentDetail)
	const handleUpdateAppointment = useCallback(
		async (formData: any) => {
			try {
				setOperationLoading(true);
				await updateAppointment(formData.id, formData);
				loadAppointments();
			} catch (err: any) {
				Alert.alert('Error', err.message || 'Error al actualizar la cita');
			} finally {
				setOperationLoading(false);
			}
		},
		[updateAppointment, loadAppointments]
	);

	// HOOK: useCallback - Manejar eliminar cita
	const handleDeleteAppointment = useCallback(async () => {
		if (!currentAppointment) {
			setShowDeleteConfirm(false);
			return;
		}

		try {
			setOperationLoading(true);
			await deleteAppointment(currentAppointment.id);
			setShowDetailModal(false);
			setShowDeleteConfirm(false);
			setCurrentAppointment(null);
			loadAppointments();
		} catch (err: any) {
			Alert.alert('Error', err.message || 'Error al eliminar la cita');
		} finally {
			setOperationLoading(false);
		}
	}, [currentAppointment, deleteAppointment, loadAppointments]);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
				<Text style={styles.loadingText}>Cargando horario...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>Error: {error}</Text>
				<Text style={styles.errorText} onPress={loadAppointments}>
					Reintentar
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{/* Header del calendario */}
			<CalendarHeader
				date={date}
				onPrevious={viewType === 'day' ? handlePrevDay : handlePrevWeek}
				onNext={viewType === 'day' ? handleNextDay : handleNextWeek}
				onToday={handleToday}
				view={viewType}
				onViewChange={setViewType}
				onDoctorChange={handleDoctorChange}
				doctors={doctors}
				selectedDoctor={selectedDoctor}
				appointmentsCount={appointmentsForDate.length}
			/>

			{/* Vista del calendario */}
			<ScrollView style={styles.calendarContainer}>
				<CalendarView
					date={date}
					view={viewType}
					selectedDoctor={selectedDoctor}
					doctors={formattedDoctors}
					appointments={formattedAppointments}
					onSlotPress={handleSlotPress}
					onAppointmentPress={handleAppointmentPress}
				/>
			</ScrollView>

			{/* Modales */}
			<CustomModal
				visible={showNewModal && currentAppointment !== null}
				onClose={() => {
					setShowNewModal(false);
					if (!showDetailModal && !showDeleteConfirm) {
						setCurrentAppointment(null);
					}
				}}
				title="Nueva Cita"
			>
				{currentAppointment && (
					<AppointmentForm
						appointment={currentAppointment}
						onSubmit={handleCreateAppointment}
						onCancel={() => {
							setShowNewModal(false);
							if (!showDetailModal && !showDeleteConfirm) {
								setCurrentAppointment(null);
							}
						}}
						patientId={patientId}
						loading={operationLoading}
					/>
				)}
			</CustomModal>

			<CustomModal
				visible={showDetailModal && currentAppointment !== null}
				onClose={() => {
					setShowDetailModal(false);
					if (!showNewModal && !showDeleteConfirm) {
						setCurrentAppointment(null);
					}
				}}
				title="Detalles de la Cita"
			>
				{currentAppointment && (
					<AppointmentDetail
						appointment={currentAppointment}
						onClose={() => {
							setShowDetailModal(false);
							if (!showNewModal && !showDeleteConfirm) {
								setCurrentAppointment(null);
							}
						}}
						onEdit={(appt) => {
							setShowDetailModal(false);
							setCurrentAppointment(appt);
							setShowNewModal(true);
						}}
						onDelete={() => {
							setShowDeleteConfirm(true);
						}}
				onUpdate={(updatedAppt) => {
					if (updatedAppt) {
						setCurrentAppointment(updatedAppt as AppointmentCalendarData);
					}
					loadAppointments();
				}}
					/>
				)}
			</CustomModal>

			<CustomModal
				visible={showDeleteConfirm && currentAppointment !== null}
				onClose={() => {
					setShowDeleteConfirm(false);
					if (!showNewModal && !showDetailModal) {
						setCurrentAppointment(null);
					}
				}}
				title="Confirmar Eliminación"
			>
				<View style={styles.deleteConfirmContent}>
					<Text style={styles.deleteConfirmText}>
						¿Estás seguro de que deseas eliminar esta cita?
					</Text>
					<View style={styles.deleteConfirmActions}>
						<Text
							style={styles.deleteConfirmButton}
							onPress={() => {
								setShowDeleteConfirm(false);
								if (!showNewModal && !showDetailModal) {
									setCurrentAppointment(null);
								}
							}}
						>
							Cancelar
						</Text>
						<Text
							style={[styles.deleteConfirmButton, styles.deleteConfirmButtonDanger]}
							onPress={handleDeleteAppointment}
						>
							Eliminar
						</Text>
					</View>
				</View>
			</CustomModal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
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
	calendarContainer: {
		flex: 1,
	},
	deleteConfirmContent: {
		padding: theme.spacing.md,
	},
	deleteConfirmText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.lg,
	},
	deleteConfirmActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: theme.spacing.sm,
	},
	deleteConfirmButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		backgroundColor: theme.colors.gray[200],
		color: theme.colors.gray[700],
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
	},
	deleteConfirmButtonDanger: {
		backgroundColor: theme.colors.danger,
		color: theme.colors.white,
	},
});
