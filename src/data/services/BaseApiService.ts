import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../../core/constants/api';

export abstract class BaseApiService {
	protected client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		this.client.interceptors.response.use(
			response => response,
			error => {
				if (error.response?.status === 404 && error.config?.url?.includes('/odontogram')) {
					return Promise.reject(error);
				}
				console.error('API Error:', error.response?.data || error.message);
				return Promise.reject(error);
			}
		);
	}
}
