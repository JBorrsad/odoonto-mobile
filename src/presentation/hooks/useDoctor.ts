// CUSTOM HOOK: useDoctor - Hook personalizado para gestión de doctores
import { useState, useEffect, useCallback } from 'react';
import { Doctor } from '../../domain/entities';
import {
	GetDoctorsUseCase,
	GetDoctorByIdUseCase,
	CreateDoctorUseCase,
	UpdateDoctorUseCase,
	DeleteDoctorUseCase,
	SearchDoctorsUseCase,
} from '../../domain/use-cases';

export const useDoctor = (
	getDoctorsUseCase: GetDoctorsUseCase,
	searchDoctorsUseCase: SearchDoctorsUseCase
) => {
	// HOOK: useState - Estado para doctores
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para cargar doctores
	const loadDoctors = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getDoctorsUseCase.execute();
			setDoctors(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error al cargar doctores');
		} finally {
			setLoading(false);
		}
	}, [getDoctorsUseCase]);

	// HOOK: useCallback - Función memoizada para buscar doctores
	const searchDoctors = useCallback(
		async (query: string) => {
			setLoading(true);
			setError(null);
			try {
				const data = await searchDoctorsUseCase.execute(query);
				setDoctors(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al buscar doctores');
			} finally {
				setLoading(false);
			}
		},
		[searchDoctorsUseCase]
	);

	// HOOK: useEffect - Cargar doctores al montar
	useEffect(() => {
		loadDoctors();
	}, [loadDoctors]);

	return {
		doctors,
		loading,
		error,
		loadDoctors,
		searchDoctors,
	};
};

export const useDoctorForm = (
	createDoctorUseCase: CreateDoctorUseCase,
	updateDoctorUseCase: UpdateDoctorUseCase
) => {
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para crear doctor
	const createDoctor = useCallback(
		async (doctor: Omit<Doctor, 'id'>) => {
			setLoading(true);
			setError(null);
			try {
				return await createDoctorUseCase.execute(doctor);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al crear doctor');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[createDoctorUseCase]
	);

	// HOOK: useCallback - Función memoizada para actualizar doctor
	const updateDoctor = useCallback(
		async (id: string, doctor: Partial<Doctor>) => {
			setLoading(true);
			setError(null);
			try {
				return await updateDoctorUseCase.execute(id, doctor);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al actualizar doctor');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[updateDoctorUseCase]
	);

	return {
		loading,
		error,
		createDoctor,
		updateDoctor,
	};
};

