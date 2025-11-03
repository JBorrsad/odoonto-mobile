import { BaseApiService } from './BaseApiService';
import { ENDPOINTS } from '../../core/constants/api';

export class PatientApiService extends BaseApiService {
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
}
