import { PatientRepository } from './PatientRepository';
import { DoctorRepository } from './DoctorRepository';
import { AppointmentRepository } from './AppointmentRepository';
import { OdontogramRepository } from './OdontogramRepository';

// Instancias singleton de los repositorios
export const patientRepository = new PatientRepository();
export const doctorRepository = new DoctorRepository();
export const appointmentRepository = new AppointmentRepository();
export const odontogramRepository = new OdontogramRepository();

