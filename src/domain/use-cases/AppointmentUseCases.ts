import { Appointment } from '../entities';
import { IAppointmentRepository } from '../repositories';

export class GetAppointmentsUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(): Promise<Appointment[]> {
		return this.appointmentRepository.getAll();
	}
}

export class GetAppointmentByIdUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(id: string): Promise<Appointment> {
		return this.appointmentRepository.getById(id);
	}
}

export class CreateAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
		return this.appointmentRepository.create(appointment);
	}
}

export class UpdateAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
		return this.appointmentRepository.update(id, appointment);
	}
}

export class DeleteAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(id: string): Promise<void> {
		return this.appointmentRepository.delete(id);
	}
}

export class GetAppointmentsByPatientUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(patientId: string): Promise<Appointment[]> {
		return this.appointmentRepository.getByPatient(patientId);
	}
}

export class GetAppointmentsByDoctorUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(doctorId: string): Promise<Appointment[]> {
		return this.appointmentRepository.getByDoctor(doctorId);
	}
}

export class GetAppointmentsByDoctorAndDateRangeUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(doctorId: string, fromDate: string, toDate: string): Promise<Appointment[]> {
		return this.appointmentRepository.getByDoctorAndDateRange(doctorId, fromDate, toDate);
	}
}

export class ConfirmAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(id: string): Promise<Appointment> {
		return this.appointmentRepository.confirm(id);
	}
}

export class CancelAppointmentUseCase {
	constructor(private readonly appointmentRepository: IAppointmentRepository) {}

	async execute(id: string, reason?: string): Promise<void> {
		return this.appointmentRepository.cancel(id, reason);
	}
}

