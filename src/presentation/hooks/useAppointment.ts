// CUSTOM HOOK: useAppointment - Hook personalizado para gestión de citas
import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../../domain/entities';
import {
	GetAppointmentsUseCase,
	GetAppointmentByIdUseCase,
	CreateAppointmentUseCase,
	UpdateAppointmentUseCase,
	DeleteAppointmentUseCase,
	GetAppointmentsByPatientUseCase,
	GetAppointmentsByDoctorUseCase,
	ConfirmAppointmentUseCase,
	CancelAppointmentUseCase,
} from '../../domain/use-cases';

export const useAppointment = (
	getAppointmentsUseCase: GetAppointmentsUseCase,
	getAppointmentsByDoctorUseCase: GetAppointmentsByDoctorUseCase,
	createAppointmentUseCase: CreateAppointmentUseCase,
	updateAppointmentUseCase: UpdateAppointmentUseCase,
	deleteAppointmentUseCase: DeleteAppointmentUseCase
) => {
	// HOOK: useState - Estado para citas
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para cargar citas
	const loadAppointments = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getAppointmentsUseCase.execute();
			setAppointments(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error al cargar citas');
		} finally {
			setLoading(false);
		}
	}, [getAppointmentsUseCase]);

	// HOOK: useCallback - Función memoizada para cargar citas por doctor
	const loadAppointmentsByDoctor = useCallback(
		async (doctorId: string) => {
			setLoading(true);
			setError(null);
			try {
				const data = await getAppointmentsByDoctorUseCase.execute(doctorId);
				setAppointments(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al cargar citas');
			} finally {
				setLoading(false);
			}
		},
		[getAppointmentsByDoctorUseCase]
	);

	// HOOK: useCallback - Función memoizada para crear cita
	const createAppointment = useCallback(
		async (appointment: Omit<Appointment, 'id'>) => {
			setLoading(true);
			setError(null);
			try {
				const created = await createAppointmentUseCase.execute(appointment);
				setAppointments(prev => [...prev, created]);
				return created;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al crear cita');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[createAppointmentUseCase]
	);

	// HOOK: useCallback - Función memoizada para actualizar cita
	const updateAppointment = useCallback(
		async (id: string, appointment: Partial<Appointment>) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await updateAppointmentUseCase.execute(id, appointment);
				setAppointments(prev => prev.map(a => (a.id === id ? updated : a)));
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al actualizar cita');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[updateAppointmentUseCase]
	);

	// HOOK: useCallback - Función memoizada para eliminar cita
	const deleteAppointment = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);
			try {
				await deleteAppointmentUseCase.execute(id);
				setAppointments(prev => prev.filter(a => a.id !== id));
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al eliminar cita');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[deleteAppointmentUseCase]
	);

	// HOOK: useEffect - Cargar citas al montar
	useEffect(() => {
		loadAppointments();
	}, [loadAppointments]);

	return {
		appointments,
		loading,
		error,
		loadAppointments,
		loadAppointmentsByDoctor,
		createAppointment,
		updateAppointment,
		deleteAppointment,
	};
};

