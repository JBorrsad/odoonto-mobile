import { Appointment } from '../entities';

export interface IAppointmentRepository {
	getAll(): Promise<Appointment[]>;
	getById(id: string): Promise<Appointment>;
	create(appointment: Omit<Appointment, 'id'>): Promise<Appointment>;
	update(id: string, appointment: Partial<Appointment>): Promise<Appointment>;
	delete(id: string): Promise<void>;
	getByPatient(patientId: string): Promise<Appointment[]>;
	getByDoctor(doctorId: string): Promise<Appointment[]>;
	getByDoctorAndDateRange(
		doctorId: string,
		fromDate: string,
		toDate: string
	): Promise<Appointment[]>;
	confirm(id: string): Promise<Appointment>;
	cancel(id: string, reason?: string): Promise<void>;
}

