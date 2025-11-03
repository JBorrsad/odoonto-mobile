import { useMemo } from 'react';
import { Doctor } from '../../../../domain/entities';
import { formatDoctorUtils } from './formatDoctorUtils';

export type FormattedDoctor = Doctor & {
	initials: string;
	workingDays: number[];
	phone: string;
	email: string;
	services: string[];
	isFullTime: boolean;
};

export const useFormattedDoctors = (doctors: Doctor[]): FormattedDoctor[] => {
	return useMemo(() => {
		return doctors.map(doctor => {
			const initials = formatDoctorUtils.generateInitials(doctor.nombreCompleto);
			const workingDays = formatDoctorUtils.generateWorkingDays(doctor.id);
			const phone = formatDoctorUtils.generatePhone(doctor.id);
			const email = formatDoctorUtils.generateEmail(doctor.nombreCompleto);
			const services = formatDoctorUtils.generateServices(doctor.especialidad);
			const isFullTime = doctor.id.charCodeAt(0) % 2 === 0;

			return {
				...doctor,
				initials,
				workingDays,
				phone,
				email,
				services,
				isFullTime,
			};
		});
	}, [doctors]);
};
