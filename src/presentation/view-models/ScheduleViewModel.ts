import { Appointment } from '../../domain/entities';
import {
	GetAppointmentsUseCase,
	GetAppointmentByIdUseCase,
	CreateAppointmentUseCase,
	UpdateAppointmentUseCase,
	DeleteAppointmentUseCase,
	GetAppointmentsByPatientUseCase,
	GetAppointmentsByDoctorUseCase,
	ConfirmAppointmentUseCase,
	CancelAppointmentUseCase,
} from '../../domain/use-cases';
import { BaseViewModel } from './BaseViewModel';

// ViewModel para el calendario de citas - Maneja la carga y gestión de citas
export class ScheduleViewModel extends BaseViewModel {
	appointments: Appointment[] = [];

	constructor(
		private getAppointmentsUseCase: GetAppointmentsUseCase,
		private getAppointmentsByDoctorUseCase: GetAppointmentsByDoctorUseCase,
		private createAppointmentUseCase: CreateAppointmentUseCase,
		private updateAppointmentUseCase: UpdateAppointmentUseCase,
		private deleteAppointmentUseCase: DeleteAppointmentUseCase
	) {
		super();
	}

	async loadAppointments(): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.appointments = await this.getAppointmentsUseCase.execute();
			},
			'Error al cargar citas'
		);
	}

	async loadAppointmentsByDoctor(doctorId: string): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.appointments = await this.getAppointmentsByDoctorUseCase.execute(doctorId);
			},
			'Error al cargar citas'
		);
	}

	async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
		const created = await this.executeWithErrorHandling(
			async () => {
				const result = await this.createAppointmentUseCase.execute(appointment);
				this.appointments = [...this.appointments, result];
				return result;
			},
			'Error al crear cita'
		);
		return created;
	}

	async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		const updated = await this.executeWithErrorHandling(
			async () => {
				const result = await this.updateAppointmentUseCase.execute(id, appointment);
				this.appointments = this.appointments.map(a => (a.id === id ? result : a));
				return result;
			},
			'Error al actualizar cita'
		);
		return updated;
	}

	async deleteAppointment(id: string): Promise<void> {
		await this.executeWithErrorHandling(
			async () => {
				await this.deleteAppointmentUseCase.execute(id);
				this.appointments = this.appointments.filter(a => a.id !== id);
			},
			'Error al eliminar cita'
		);
	}
}

// ViewModel para el detalle de una cita - Maneja operaciones específicas sobre una cita
export class AppointmentDetailViewModel extends BaseViewModel {
	appointment: Appointment | null = null;

	constructor(
		private getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
		private updateAppointmentUseCase: UpdateAppointmentUseCase,
		private deleteAppointmentUseCase: DeleteAppointmentUseCase,
		private confirmAppointmentUseCase: ConfirmAppointmentUseCase,
		private cancelAppointmentUseCase: CancelAppointmentUseCase
	) {
		super();
	}

	async loadAppointment(id: string): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.appointment = await this.getAppointmentByIdUseCase.execute(id);
			},
			'Error al cargar cita'
		);
	}

	async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		const updated = await this.executeWithErrorHandling(
			async () => {
				const result = await this.updateAppointmentUseCase.execute(id, appointment);
				this.appointment = result;
				return result;
			},
			'Error al actualizar cita'
		);
		return updated;
	}

	async deleteAppointment(id: string): Promise<void> {
		await this.executeWithErrorHandling(
			async () => {
				await this.deleteAppointmentUseCase.execute(id);
			},
			'Error al eliminar cita'
		);
	}

	async confirmAppointment(id: string): Promise<Appointment> {
		const confirmed = await this.executeWithErrorHandling(
			async () => {
				const result = await this.confirmAppointmentUseCase.execute(id);
				this.appointment = result;
				return result;
			},
			'Error al confirmar cita'
		);
		return confirmed;
	}

	async cancelAppointment(id: string, reason?: string): Promise<void> {
		await this.executeWithErrorHandling(
			async () => {
				await this.cancelAppointmentUseCase.execute(id, reason);
			},
			'Error al cancelar cita'
		);
	}
}

