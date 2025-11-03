// CUSTOM HOOK: usePatient - Hook personalizado para gestión de pacientes
import { useState, useEffect, useCallback } from 'react';
import { Patient } from '../../domain/entities';
import {
	GetPatientsUseCase,
	GetPatientByIdUseCase,
	CreatePatientUseCase,
	UpdatePatientUseCase,
	DeletePatientUseCase,
	SearchPatientsUseCase,
} from '../../domain/use-cases';

export const usePatient = (
	getPatientsUseCase: GetPatientsUseCase,
	searchPatientsUseCase: SearchPatientsUseCase
) => {
	// HOOK: useState - Estado para pacientes
	const [patients, setPatients] = useState<Patient[]>([]);
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para cargar pacientes
	const loadPatients = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getPatientsUseCase.execute();
			setPatients(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error al cargar pacientes');
		} finally {
			setLoading(false);
		}
	}, [getPatientsUseCase]);

	// HOOK: useCallback - Función memoizada para buscar pacientes
	const searchPatients = useCallback(
		async (query: string) => {
			setLoading(true);
			setError(null);
			try {
				const data = await searchPatientsUseCase.execute(query);
				setPatients(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al buscar pacientes');
			} finally {
				setLoading(false);
			}
		},
		[searchPatientsUseCase]
	);

	// HOOK: useEffect - Cargar pacientes al montar
	useEffect(() => {
		loadPatients();
	}, [loadPatients]);

	return {
		patients,
		loading,
		error,
		loadPatients,
		searchPatients,
	};
};

export const usePatientDetail = (
	getPatientByIdUseCase: GetPatientByIdUseCase,
	updatePatientUseCase: UpdatePatientUseCase,
	deletePatientUseCase: DeletePatientUseCase
) => {
	// HOOK: useState - Estado para paciente
	const [patient, setPatient] = useState<Patient | null>(null);
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para cargar paciente
	const loadPatient = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);
			try {
				const data = await getPatientByIdUseCase.execute(id);
				setPatient(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al cargar paciente');
			} finally {
				setLoading(false);
			}
		},
		[getPatientByIdUseCase]
	);

	// HOOK: useCallback - Función memoizada para actualizar paciente
	const updatePatient = useCallback(
		async (id: string, patientData: Partial<Patient>) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await updatePatientUseCase.execute(id, patientData);
				setPatient(updated);
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al actualizar paciente');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[updatePatientUseCase]
	);

	// HOOK: useCallback - Función memoizada para eliminar paciente
	const deletePatient = useCallback(
		async (id: string) => {
			setLoading(true);
			setError(null);
			try {
				await deletePatientUseCase.execute(id);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al eliminar paciente');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[deletePatientUseCase]
	);

	return {
		patient,
		loading,
		error,
		loadPatient,
		updatePatient,
		deletePatient,
	};
};

export const usePatientForm = (
	createPatientUseCase: CreatePatientUseCase,
	updatePatientUseCase: UpdatePatientUseCase
) => {
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para crear paciente
	const createPatient = useCallback(
		async (patient: Omit<Patient, 'id'>) => {
			setLoading(true);
			setError(null);
			try {
				return await createPatientUseCase.execute(patient);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al crear paciente');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[createPatientUseCase]
	);

	// HOOK: useCallback - Función memoizada para actualizar paciente
	const updatePatient = useCallback(
		async (id: string, patient: Partial<Patient>) => {
			setLoading(true);
			setError(null);
			try {
				return await updatePatientUseCase.execute(id, patient);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al actualizar paciente');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[updatePatientUseCase]
	);

	return {
		loading,
		error,
		createPatient,
		updatePatient,
	};
};

