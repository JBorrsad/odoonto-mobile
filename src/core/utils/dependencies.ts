// Dependency Injection Container
import {
	GetPatientsUseCase,
	GetPatientByIdUseCase,
	CreatePatientUseCase,
	UpdatePatientUseCase,
	DeletePatientUseCase,
	SearchPatientsUseCase,
} from '../../domain/use-cases/PatientUseCases';
import {
	GetDoctorsUseCase,
	GetDoctorByIdUseCase,
	CreateDoctorUseCase,
	UpdateDoctorUseCase,
	DeleteDoctorUseCase,
	SearchDoctorsUseCase,
	GetDoctorsByEspecialidadUseCase,
} from '../../domain/use-cases/DoctorUseCases';
import {
	GetAppointmentsUseCase,
	GetAppointmentByIdUseCase,
	CreateAppointmentUseCase,
	UpdateAppointmentUseCase,
	DeleteAppointmentUseCase,
	GetAppointmentsByPatientUseCase,
	GetAppointmentsByDoctorUseCase,
	GetAppointmentsByDoctorAndDateRangeUseCase,
	ConfirmAppointmentUseCase,
	CancelAppointmentUseCase,
} from '../../domain/use-cases/AppointmentUseCases';
import {
	GetOdontogramUseCase,
	GetOdontogramByPatientIdUseCase,
	AddLesionUseCase,
	RemoveLesionUseCase,
	AddTreatmentUseCase,
	RemoveTreatmentUseCase,
} from '../../domain/use-cases/OdontogramUseCases';
import {
	patientRepository,
	doctorRepository,
	appointmentRepository,
	odontogramRepository,
} from '../../data/repositories';

// Patient Use Cases
export const getPatientsUseCase = new GetPatientsUseCase(patientRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
export const createPatientUseCase = new CreatePatientUseCase(patientRepository);
export const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
export const deletePatientUseCase = new DeletePatientUseCase(patientRepository);
export const searchPatientsUseCase = new SearchPatientsUseCase(patientRepository);

// Doctor Use Cases
export const getDoctorsUseCase = new GetDoctorsUseCase(doctorRepository);
export const getDoctorByIdUseCase = new GetDoctorByIdUseCase(doctorRepository);
export const createDoctorUseCase = new CreateDoctorUseCase(doctorRepository);
export const updateDoctorUseCase = new UpdateDoctorUseCase(doctorRepository);
export const deleteDoctorUseCase = new DeleteDoctorUseCase(doctorRepository);
export const searchDoctorsUseCase = new SearchDoctorsUseCase(doctorRepository);
export const getDoctorsByEspecialidadUseCase = new GetDoctorsByEspecialidadUseCase(doctorRepository);

// Appointment Use Cases
export const getAppointmentsUseCase = new GetAppointmentsUseCase(appointmentRepository);
export const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(appointmentRepository);
export const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentRepository);
export const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
export const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentRepository);
export const getAppointmentsByPatientUseCase = new GetAppointmentsByPatientUseCase(appointmentRepository);
export const getAppointmentsByDoctorUseCase = new GetAppointmentsByDoctorUseCase(appointmentRepository);
export const getAppointmentsByDoctorAndDateRangeUseCase = new GetAppointmentsByDoctorAndDateRangeUseCase(
	appointmentRepository
);
export const confirmAppointmentUseCase = new ConfirmAppointmentUseCase(appointmentRepository);
export const cancelAppointmentUseCase = new CancelAppointmentUseCase(appointmentRepository);

// Odontogram Use Cases
export const getOdontogramUseCase = new GetOdontogramUseCase(odontogramRepository);
export const getOdontogramByPatientIdUseCase = new GetOdontogramByPatientIdUseCase(odontogramRepository);
export const addLesionUseCase = new AddLesionUseCase(odontogramRepository);
export const removeLesionUseCase = new RemoveLesionUseCase(odontogramRepository);
export const addTreatmentUseCase = new AddTreatmentUseCase(odontogramRepository);
export const removeTreatmentUseCase = new RemoveTreatmentUseCase(odontogramRepository);

