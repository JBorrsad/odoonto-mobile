// CUSTOM HOOK: useApi - Hook personalizado para configuración de API
import { useMemo } from 'react';
import { API_BASE_URL } from '../../core/constants/api';

export const useApi = () => {
	// HOOK: useMemo - Memoizar configuración de API
	const apiConfig = useMemo(
		() => ({
			baseURL: API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		}),
		[]
	);

	return apiConfig;
};

