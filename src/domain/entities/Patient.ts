export interface Address {
	calle?: string;
	numero?: string;
	colonia?: string;
	codigoPostal?: string;
	ciudad?: string;
	estado?: string;
	pais?: string;
}

export enum Sex {
	MASCULINO = 'MASCULINO',
	FEMENINO = 'FEMENINO',
}

export interface Patient {
	id: string;
	nombre: string;
	apellido: string;
	fechaNacimiento: string;
	sexo: Sex;
	telefono: string;
	email: string;
	direccion?: Address;
}

