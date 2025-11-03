import { PatientApiService } from './PatientApiService';
import { DoctorApiService } from './DoctorApiService';
import { AppointmentApiService } from './AppointmentApiService';
import { OdontogramApiService } from './OdontogramApiService';

export const patientApiService = new PatientApiService();
export const doctorApiService = new DoctorApiService();
export const appointmentApiService = new AppointmentApiService();
export const odontogramApiService = new OdontogramApiService();

export class ApiService {
	patients = patientApiService;
	doctors = doctorApiService;
	appointments = appointmentApiService;
	odontograms = odontogramApiService;
}

export const apiService = new ApiService();