import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../../core/constants/api';

export class ApiService {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});

		// Interceptor para manejar errores
		this.client.interceptors.response.use(
			response => response,
			error => {
				if (error.response?.status === 404 && error.config?.url?.includes('/odontogram')) {
					// Para odontogramas, 404 es esperado si no existe
					return Promise.reject(error);
				}
				console.error('API Error:', error.response?.data || error.message);
				return Promise.reject(error);
			}
		);
	}

	getPatients() {
		return this.client.get(ENDPOINTS.PATIENTS);
	}

	getPatientById(id: string) {
		return this.client.get(`${ENDPOINTS.PATIENTS}/${id}`);
	}

	createPatient(patient: unknown) {
		return this.client.post(ENDPOINTS.PATIENTS, patient);
	}

	updatePatient(id: string, patient: unknown) {
		return this.client.put(`${ENDPOINTS.PATIENTS}/${id}`, patient);
	}

	deletePatient(id: string) {
		return this.client.delete(`${ENDPOINTS.PATIENTS}/${id}`);
	}

	searchPatients(query: string) {
		return this.client.get(`${ENDPOINTS.PATIENTS}/search`, { params: { query } });
	}

	getPatientOdontogram(patientId: string) {
		return this.client.get(`${ENDPOINTS.PATIENTS}/${patientId}/odontogram`);
	}

	getDoctors() {
		return this.client.get(ENDPOINTS.DOCTORS);
	}

	getDoctorById(id: string) {
		return this.client.get(`${ENDPOINTS.DOCTORS}/${id}`);
	}

	createDoctor(doctor: unknown) {
		return this.client.post(ENDPOINTS.DOCTORS, doctor);
	}

	updateDoctor(id: string, doctor: unknown) {
		return this.client.put(`${ENDPOINTS.DOCTORS}/${id}`, doctor);
	}

	deleteDoctor(id: string) {
		return this.client.delete(`${ENDPOINTS.DOCTORS}/${id}`);
	}

	searchDoctors(query: string) {
		return this.client.get(`${ENDPOINTS.DOCTORS}/search`, { params: { query } });
	}

	getDoctorsByEspecialidad(especialidad: string) {
		return this.client.get(`${ENDPOINTS.DOCTORS}/especialidad/${especialidad}`);
	}

	getAppointments() {
		return this.client.get(ENDPOINTS.APPOINTMENTS);
	}

	getAppointmentById(id: string) {
		return this.client.get(`${ENDPOINTS.APPOINTMENTS}/${id}`);
	}

	createAppointment(appointment: unknown) {
		return this.client.post(ENDPOINTS.APPOINTMENTS, appointment);
	}

	updateAppointment(id: string, appointment: unknown) {
		return this.client.put(`${ENDPOINTS.APPOINTMENTS}/${id}`, appointment);
	}

	deleteAppointment(id: string) {
		return this.client.delete(`${ENDPOINTS.APPOINTMENTS}/${id}`);
	}

	getAppointmentsByPatient(patientId: string) {
		return this.client.get(`${ENDPOINTS.APPOINTMENTS}/patient/${patientId}`);
	}

	getAppointmentsByDoctor(doctorId: string) {
		return this.client.get(`${ENDPOINTS.APPOINTMENTS}/doctor/${doctorId}`);
	}

	getAppointmentsByDoctorAndDateRange(doctorId: string, fromDate: string, toDate: string) {
		return this.client.get(`${ENDPOINTS.APPOINTMENTS}/doctor/${doctorId}`, {
			params: { from: fromDate, to: toDate },
		});
	}

	confirmAppointment(id: string) {
		return this.client.put(`${ENDPOINTS.APPOINTMENTS}/${id}/confirm`);
	}

	cancelAppointment(id: string, reason?: string) {
		return this.client.delete(`${ENDPOINTS.APPOINTMENTS}/${id}/cancel`, {
			params: reason ? { reason } : {},
		});
	}

	getOdontogramById(id: string) {
		return this.client.get(`${ENDPOINTS.ODONTOGRAMS}/${id}`);
	}

	addLesion(odontogramId: string, toothNumber: string, face: string, lesionType: string) {
		return this.client.post(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/faces/${face}/lesions`,
			null,
			{ params: { lesionType } }
		);
	}

	removeLesion(odontogramId: string, toothNumber: string, face: string) {
		return this.client.delete(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/faces/${face}/lesions`
		);
	}

	addTreatment(odontogramId: string, toothNumber: string, treatmentType: string) {
		return this.client.post(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/treatments`,
			null,
			{ params: { treatmentType } }
		);
	}

	removeTreatment(odontogramId: string, toothNumber: string) {
		return this.client.delete(`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/treatments`);
	}
}

export const apiService = new ApiService();

