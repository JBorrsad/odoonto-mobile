// API Base URL - Configura esto según tu entorno
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Endpoints
export const ENDPOINTS = {
	PATIENTS: '/api/patients',
	DOCTORS: '/api/doctors',
	APPOINTMENTS: '/api/appointments',
	ODONTOGRAMS: '/api/odontograms',
	MEDICAL_RECORDS: '/api/medical-records',
} as const;

