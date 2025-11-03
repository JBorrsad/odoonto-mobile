export {
	GetPatientsUseCase,
	GetPatientByIdUseCase,
	CreatePatientUseCase,
	UpdatePatientUseCase,
	DeletePatientUseCase,
	SearchPatientsUseCase,
} from './PatientUseCases';

export {
	GetDoctorsUseCase,
	GetDoctorByIdUseCase,
	CreateDoctorUseCase,
	UpdateDoctorUseCase,
	DeleteDoctorUseCase,
	SearchDoctorsUseCase,
	GetDoctorsByEspecialidadUseCase,
} from './DoctorUseCases';

export {
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
} from './AppointmentUseCases';

export {
	GetOdontogramUseCase,
	GetOdontogramByPatientIdUseCase,
	AddLesionUseCase,
	RemoveLesionUseCase,
	AddTreatmentUseCase,
	RemoveTreatmentUseCase,
} from './OdontogramUseCases';

