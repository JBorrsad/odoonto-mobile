import { Appointment, AppointmentStatus } from '../../domain/entities';

export interface AppointmentDTO {
	id: string;
	patientId: string;
	doctorId: string;
	start: string;
	end?: string;
	status: AppointmentStatus;
	treatment?: string;
	patientName?: string;
	durationSlots?: number;
}

export const mapAppointmentDTOToEntity = (dto: AppointmentDTO): Appointment => ({
	id: dto.id,
	patientId: dto.patientId,
	doctorId: dto.doctorId,
	start: dto.start,
	end: dto.end,
	status: dto.status,
	treatment: dto.treatment,
	patientName: dto.patientName,
	durationSlots: dto.durationSlots,
});

export const mapEntityToAppointmentDTO = (entity: Appointment): AppointmentDTO => ({
	id: entity.id,
	patientId: entity.patientId,
	doctorId: entity.doctorId,
	start: entity.start,
	end: entity.end,
	status: entity.status,
	treatment: entity.treatment,
	patientName: entity.patientName,
	durationSlots: entity.durationSlots,
});

