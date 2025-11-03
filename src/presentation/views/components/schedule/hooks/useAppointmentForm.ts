import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../../../data/services/ApiService';
import {
	AppointmentFormData,
	AppointmentFormErrors,
	validateAppointmentForm,
	formatAppointmentData,
} from '../utils/appointmentFormUtils';

interface UseAppointmentFormProps {
	appointment?: any;
	patientId?: string;
	onSubmit: (appointmentData: any) => void;
}

export const useAppointmentForm = ({
	appointment,
	patientId,
	onSubmit,
}: UseAppointmentFormProps) => {
	const [patients, setPatients] = useState<any[]>([]);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [loadingData, setLoadingData] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<AppointmentFormData>({
		patientId: patientId || '',
		doctorId: '',
		date: '',
		time: '08:00',
		durationSlots: '1',
		status: 'PENDING',
		notes: '',
	});

	const [errors, setErrors] = useState<AppointmentFormErrors>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoadingData(true);
				const [patientsResponse, doctorsResponse] = await Promise.all([
					apiService.patients.getPatients(),
					apiService.doctors.getDoctors(),
				]);
				setPatients(patientsResponse.data || []);
				setDoctors(doctorsResponse.data || []);
			} catch (err: any) {
				setError(err.message || 'Error al cargar datos');
			} finally {
				setLoadingData(false);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (appointment) {
			const startDate = new Date(appointment.start);
			const dateStr = startDate.toISOString().split('T')[0];
			const timeStr = startDate.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			});

			setForm({
				patientId: appointment.patientId || '',
				doctorId: appointment.doctorId || '',
				date: dateStr,
				time: timeStr,
				durationSlots: appointment.durationSlots?.toString() || '1',
				status: appointment.status || 'PENDING',
				notes: appointment.notes || '',
			});
		} else if (patientId) {
			setForm(prev => ({
				...prev,
				patientId,
			}));
		}
	}, [appointment, patientId]);

	const handleChange = useCallback((field: keyof AppointmentFormData, value: string) => {
		setForm(prev => ({
			...prev,
			[field]: value,
		}));

		if (errors[field as keyof AppointmentFormErrors]) {
			setErrors(prev => ({
				...prev,
				[field]: undefined,
			}));
		}
	}, [errors]);

	const handleSubmit = useCallback(() => {
		const validationErrors = validateAppointmentForm(form);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const appointmentData = formatAppointmentData(form, appointment?.id);
		onSubmit(appointmentData);
	}, [form, appointment, onSubmit]);

	return {
		form,
		errors,
		patients,
		doctors,
		loadingData,
		error,
		handleChange,
		handleSubmit,
	};
};
