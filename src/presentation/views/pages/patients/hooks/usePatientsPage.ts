// CUSTOM HOOK: usePatientsPage - Hook personalizado para lógica de PatientsPage
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Patient } from '../../../../../domain/entities';
import { usePatient } from '../../../../hooks/usePatient';
import { GetPatientsUseCase, SearchPatientsUseCase } from '../../../../../domain/use-cases';

export interface FormattedPatient {
	id: string;
	name: string;
	phone: string;
	email: string;
	address: string;
	registered: string;
	lastVisit: string;
	lastTreatment: string;
	initials: string;
	nombre: string;
	apellido: string;
	telefono: string;
	direccion: any;
	fechaNacimiento: string;
}

export const usePatientsPage = (
	getPatientsUseCase: GetPatientsUseCase,
	searchPatientsUseCase: SearchPatientsUseCase
) => {
	// HOOK: useState - Estado para modo de vista
	const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

	// HOOK: useState - Estado para búsqueda
	const [searchQuery, setSearchQuery] = useState('');

	// CUSTOM HOOK: usePatient - Hook personalizado para gestión de pacientes
	const { patients, loading, error, loadPatients } = usePatient(
		getPatientsUseCase,
		searchPatientsUseCase
	);

	// HOOK: useEffect - Cargar pacientes al montar
	useEffect(() => {
		loadPatients();
	}, [loadPatients]);

	// HOOK: useCallback - Función para formatear dirección (memoizada)
	const formatAddress = useCallback((direccion: any): string => {
		if (!direccion) return 'Sin dirección registrada';

		const parts: string[] = [];
		if (direccion.calle) parts.push(direccion.calle);
		if (direccion.numero) parts.push(direccion.numero);
		if (direccion.colonia) parts.push(direccion.colonia);
		if (direccion.ciudad) parts.push(direccion.ciudad);

		return parts.length > 0 ? parts.join(', ') : 'Sin dirección registrada';
	}, []);

	// HOOK: useCallback - Función para formatear fecha (memoizada)
	const formatDate = useCallback((dateString: string | undefined): string => {
		if (!dateString) return 'Sin fecha';

		try {
			const date = new Date(dateString);
			return new Intl.DateTimeFormat('es-ES', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}).format(date);
		} catch (error) {
			return 'Fecha inválida';
		}
	}, []);

	// HOOK: useMemo - Formatear pacientes con todos los campos necesarios
	const formattedPatients = useMemo((): FormattedPatient[] => {
		return patients.map(patient => {
			const initial = `${patient.nombre?.charAt(0) || ''}${patient.apellido?.charAt(0) || ''}`;

			return {
				id: patient.id,
				name: `${patient.nombre || 'Sin nombre'} ${patient.apellido || 'Sin apellido'}`.trim(),
				phone: patient.telefono || 'Sin teléfono',
				email: patient.email || 'Sin email',
				address: formatAddress(patient.direccion),
				registered: formatDate(patient.fechaNacimiento),
				lastVisit: '01 May 2021', // Placeholder - este dato no está en el backend aún
				lastTreatment: 'Tooth Scaling', // Placeholder - este dato no está en el backend aún
				initials: initial,
				nombre: patient.nombre || '',
				apellido: patient.apellido || '',
				telefono: patient.telefono || '',
				direccion: patient.direccion,
				fechaNacimiento: patient.fechaNacimiento || '',
			};
		});
	}, [patients, formatAddress, formatDate]);

	// HOOK: useMemo - Filtrar pacientes según búsqueda
	const filteredPatients = useMemo(() => {
		if (!searchQuery.trim()) return formattedPatients;

		const query = searchQuery.toLowerCase();
		return formattedPatients.filter(
			patient =>
				patient.name.toLowerCase().includes(query) ||
				patient.email.toLowerCase().includes(query) ||
				patient.phone.includes(query)
		);
	}, [formattedPatients, searchQuery]);

	// HOOK: useCallback - Manejar cambio de modo de vista
	const handleViewModeChange = useCallback((mode: 'table' | 'grid') => {
		setViewMode(mode);
	}, []);

	return {
		patients: filteredPatients,
		loading,
		error,
		viewMode,
		searchQuery,
		setSearchQuery,
		handleViewModeChange,
	};
};


