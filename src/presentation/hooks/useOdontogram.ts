// CUSTOM HOOK: useOdontogram - Hook personalizado para gestión de odontogramas
import { useState, useCallback } from 'react';
import { Odontogram, LesionType, Face } from '../../domain/entities';
import {
	GetOdontogramUseCase,
	GetOdontogramByPatientIdUseCase,
	AddLesionUseCase,
	RemoveLesionUseCase,
	AddTreatmentUseCase,
	RemoveTreatmentUseCase,
} from '../../domain/use-cases';

export const useOdontogram = (
	getOdontogramByPatientIdUseCase: GetOdontogramByPatientIdUseCase,
	addLesionUseCase: AddLesionUseCase,
	removeLesionUseCase: RemoveLesionUseCase,
	addTreatmentUseCase: AddTreatmentUseCase,
	removeTreatmentUseCase: RemoveTreatmentUseCase
) => {
	// HOOK: useState - Estado para odontograma
	const [odontogram, setOdontogram] = useState<Odontogram | null>(null);
	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);
	// HOOK: useState - Estado para error
	const [error, setError] = useState<string | null>(null);

	// HOOK: useCallback - Función memoizada para cargar odontograma
	const loadOdontogram = useCallback(
		async (patientId: string) => {
			setLoading(true);
			setError(null);
			try {
				const data = await getOdontogramByPatientIdUseCase.execute(patientId);
				setOdontogram(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al cargar odontograma');
			} finally {
				setLoading(false);
			}
		},
		[getOdontogramByPatientIdUseCase]
	);

	// HOOK: useCallback - Función memoizada para añadir lesión
	const addLesion = useCallback(
		async (odontogramId: string, toothNumber: string, face: Face, lesionType: LesionType) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await addLesionUseCase.execute(odontogramId, toothNumber, face, lesionType);
				setOdontogram(updated);
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al añadir lesión');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[addLesionUseCase]
	);

	// HOOK: useCallback - Función memoizada para eliminar lesión
	const removeLesion = useCallback(
		async (odontogramId: string, toothNumber: string, face: Face) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await removeLesionUseCase.execute(odontogramId, toothNumber, face);
				setOdontogram(updated);
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al eliminar lesión');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[removeLesionUseCase]
	);

	// HOOK: useCallback - Función memoizada para añadir tratamiento
	const addTreatment = useCallback(
		async (odontogramId: string, toothNumber: string, treatmentType: string) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await addTreatmentUseCase.execute(odontogramId, toothNumber, treatmentType);
				setOdontogram(updated);
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al añadir tratamiento');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[addTreatmentUseCase]
	);

	// HOOK: useCallback - Función memoizada para eliminar tratamiento
	const removeTreatment = useCallback(
		async (odontogramId: string, toothNumber: string) => {
			setLoading(true);
			setError(null);
			try {
				const updated = await removeTreatmentUseCase.execute(odontogramId, toothNumber);
				setOdontogram(updated);
				return updated;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Error al eliminar tratamiento');
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[removeTreatmentUseCase]
	);

	return {
		odontogram,
		loading,
		error,
		loadOdontogram,
		addLesion,
		removeLesion,
		addTreatment,
		removeTreatment,
	};
};

