export enum LesionType {
	CARIES = 'CARIES',
	PERDIDA = 'PERDIDA',
	OBTURACION = 'OBTURACION',
	CORONA = 'CORONA',
	ENDODONCIA = 'ENDODONCIA',
}

export enum Face {
	VESTIBULAR = 'VESTIBULAR',
	LINGUAL = 'LINGUAL',
	MESIAL = 'MESIAL',
	DISTAL = 'DISTAL',
	OCLUSAL = 'OCLUSAL',
}

export interface ToothData {
	faces?: Partial<Record<Face, LesionType>>;
	treatments?: string[];
}

export interface Odontogram {
	id: string;
	patientId: string;
	teeth: Record<string, ToothData>;
	isTemporary?: boolean;
}

