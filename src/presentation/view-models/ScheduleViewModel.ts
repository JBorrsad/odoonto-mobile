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

export class ScheduleViewModel {
	// HOOK: useState - Estado para citas
	appointments: Appointment[] = [];
	loading = false;
	error: string | null = null;

	constructor(
		private getAppointmentsUseCase: GetAppointmentsUseCase,
		private getAppointmentsByDoctorUseCase: GetAppointmentsByDoctorUseCase,
		private createAppointmentUseCase: CreateAppointmentUseCase,
		private updateAppointmentUseCase: UpdateAppointmentUseCase,
		private deleteAppointmentUseCase: DeleteAppointmentUseCase
	) {}

	async loadAppointments(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.appointments = await this.getAppointmentsUseCase.execute();
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar citas';
		} finally {
			this.loading = false;
		}
	}

	async loadAppointmentsByDoctor(doctorId: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.appointments = await this.getAppointmentsByDoctorUseCase.execute(doctorId);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar citas';
		} finally {
			this.loading = false;
		}
	}

	async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
		this.loading = true;
		this.error = null;
		try {
			const created = await this.createAppointmentUseCase.execute(appointment);
			this.appointments = [...this.appointments, created];
			return created;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al crear cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		this.loading = true;
		this.error = null;
		try {
			const updated = await this.updateAppointmentUseCase.execute(id, appointment);
			this.appointments = this.appointments.map(a => (a.id === id ? updated : a));
			return updated;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al actualizar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async deleteAppointment(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.deleteAppointmentUseCase.execute(id);
			this.appointments = this.appointments.filter(a => a.id !== id);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al eliminar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}
}

export class AppointmentDetailViewModel {
	// HOOK: useState - Estado para cita
	appointment: Appointment | null = null;
	loading = false;
	error: string | null = null;

	constructor(
		private getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
		private updateAppointmentUseCase: UpdateAppointmentUseCase,
		private deleteAppointmentUseCase: DeleteAppointmentUseCase,
		private confirmAppointmentUseCase: ConfirmAppointmentUseCase,
		private cancelAppointmentUseCase: CancelAppointmentUseCase
	) {}

	async loadAppointment(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.appointment = await this.getAppointmentByIdUseCase.execute(id);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar cita';
		} finally {
			this.loading = false;
		}
	}

	async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		this.loading = true;
		this.error = null;
		try {
			const updated = await this.updateAppointmentUseCase.execute(id, appointment);
			this.appointment = updated;
			return updated;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al actualizar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async deleteAppointment(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.deleteAppointmentUseCase.execute(id);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al eliminar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async confirmAppointment(id: string): Promise<Appointment> {
		this.loading = true;
		this.error = null;
		try {
			const confirmed = await this.confirmAppointmentUseCase.execute(id);
			this.appointment = confirmed;
			return confirmed;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al confirmar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async cancelAppointment(id: string, reason?: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.cancelAppointmentUseCase.execute(id, reason);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cancelar cita';
			throw err;
		} finally {
			this.loading = false;
		}
	}
}

