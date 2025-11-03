export enum AppointmentStatus {
	PENDIENTE = 'PENDIENTE',
	CONFIRMADA = 'CONFIRMADA',
	COMPLETADA = 'COMPLETADA',
	EN_CURSO = 'EN_CURSO',
	CANCELADA = 'CANCELADA',
}

export interface Appointment {
	id: string;
	patientId: string;
	doctorId: string;
	start: string; // ISO date string
	end?: string; // ISO date string
	status: AppointmentStatus;
	treatment?: string;
	patientName?: string;
	durationSlots?: number;
}

