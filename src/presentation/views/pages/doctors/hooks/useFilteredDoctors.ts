import { useMemo } from 'react';
import { FormattedDoctor } from '../hooks/useFormattedDoctors';

export const useFilteredDoctors = (
	formattedDoctors: FormattedDoctor[],
	searchQuery: string
): FormattedDoctor[] => {
	return useMemo(() => {
		let filtered = formattedDoctors;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				doctor =>
					doctor.nombreCompleto.toLowerCase().includes(query) ||
					doctor.especialidad.toLowerCase().includes(query) ||
					doctor.email.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [formattedDoctors, searchQuery]);
};
