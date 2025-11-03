export interface AppointmentFormData {
	patientId: string;
	doctorId: string;
	date: string;
	time: string;
	durationSlots: string;
	status: string;
	notes: string;
}

export interface AppointmentFormErrors {
	patientId?: string;
	doctorId?: string;
	date?: string;
	time?: string;
	durationSlots?: string;
}

export const validateAppointmentForm = (form: AppointmentFormData): AppointmentFormErrors => {
	const errors: AppointmentFormErrors = {};

	if (!form.patientId) {
		errors.patientId = 'El paciente es obligatorio';
	}

	if (!form.doctorId) {
		errors.doctorId = 'El doctor es obligatorio';
	}

	if (!form.date) {
		errors.date = 'La fecha es obligatoria';
	}

	if (!form.time) {
		errors.time = 'La hora es obligatoria';
	} else {
		const minutes = parseInt(form.time.split(':')[1], 10);
		if (minutes !== 0 && minutes !== 30) {
			errors.time = 'La hora debe ser en punto (:00) o media hora (:30)';
		}
	}

	if (!form.durationSlots) {
		errors.durationSlots = 'La duración es obligatoria';
	}

	return errors;
};

export const formatAppointmentData = (
	form: AppointmentFormData,
	appointmentId?: string
): any => {
	const [hours, minutes] = form.time.split(':').map(n => parseInt(n, 10));
	const start = new Date(form.date);
	start.setHours(hours, minutes, 0, 0);

	const end = new Date(start);
	end.setMinutes(end.getMinutes() + parseInt(form.durationSlots, 10) * 30);

	return {
		id: appointmentId,
		patientId: form.patientId,
		doctorId: form.doctorId,
		start: start.toISOString(),
		end: end.toISOString(),
		durationSlots: parseInt(form.durationSlots, 10),
		status: form.status,
		notes: form.notes,
	};
};
