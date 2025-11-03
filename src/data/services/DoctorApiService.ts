import { BaseApiService } from './BaseApiService';
import { ENDPOINTS } from '../../core/constants/api';

export class DoctorApiService extends BaseApiService {
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
}
