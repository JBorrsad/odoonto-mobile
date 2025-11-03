import { BaseApiService } from './BaseApiService';
import { ENDPOINTS } from '../../core/constants/api';

export class AppointmentApiService extends BaseApiService {
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
}
