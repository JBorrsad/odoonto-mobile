import { Appointment } from '../../domain/entities';
import { IAppointmentRepository } from '../../domain/repositories';
import { apiService } from '../services/ApiService';
import {
	mapAppointmentDTOToEntity,
	mapEntityToAppointmentDTO,
	AppointmentDTO,
} from '../models/AppointmentDTO';

export class AppointmentRepository implements IAppointmentRepository {
	async getAll(): Promise<Appointment[]> {
		const response = await apiService.appointments.getAppointments();
		return response.data.map((dto: AppointmentDTO) => mapAppointmentDTOToEntity(dto));
	}

	async getById(id: string): Promise<Appointment> {
		const response = await apiService.appointments.getAppointmentById(id);
		return mapAppointmentDTOToEntity(response.data);
	}

	async create(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
		const dto = mapEntityToAppointmentDTO(appointment as Appointment);
		const response = await apiService.appointments.createAppointment(dto);
		return mapAppointmentDTOToEntity(response.data);
	}

	async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		const response = await apiService.appointments.updateAppointment(id, appointment);
		return mapAppointmentDTOToEntity(response.data);
	}

	async delete(id: string): Promise<void> {
		await apiService.appointments.deleteAppointment(id);
	}

	async getByPatient(patientId: string): Promise<Appointment[]> {
		const response = await apiService.appointments.getAppointmentsByPatient(patientId);
		return response.data.map((dto: AppointmentDTO) => mapAppointmentDTOToEntity(dto));
	}

	async getByDoctor(doctorId: string): Promise<Appointment[]> {
		const response = await apiService.appointments.getAppointmentsByDoctor(doctorId);
		return response.data.map((dto: AppointmentDTO) => mapAppointmentDTOToEntity(dto));
	}

	async getByDoctorAndDateRange(
		doctorId: string,
		fromDate: string,
		toDate: string
	): Promise<Appointment[]> {
		const response = await apiService.appointments.getAppointmentsByDoctorAndDateRange(doctorId, fromDate, toDate);
		return response.data.map((dto: AppointmentDTO) => mapAppointmentDTOToEntity(dto));
	}

	async confirm(id: string): Promise<Appointment> {
		const response = await apiService.appointments.confirmAppointment(id);
		return mapAppointmentDTOToEntity(response.data);
	}

	async cancel(id: string, reason?: string): Promise<void> {
		await apiService.appointments.cancelAppointment(id, reason);
	}
}

