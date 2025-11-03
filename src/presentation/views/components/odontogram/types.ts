export type LesionType = 'CARIES' | 'OBTURACION' | 'CORONA' | 'AUSENTE' | 'ENDODONCIA';
export type Face = 'VESTIBULAR' | 'PALATINO' | 'MESIAL' | 'DISTAL' | 'OCLUSAL';

export interface LesionTypeOption {
	value: LesionType;
	label: string;
	color: string;
}

export const LESION_TYPES: LesionTypeOption[] = [
	{ value: 'CARIES', label: 'Caries', color: '#ef4444' },
	{ value: 'OBTURACION', label: 'Obturación', color: '#22c55e' },
	{ value: 'CORONA', label: 'Corona', color: '#eab308' },
	{ value: 'AUSENTE', label: 'Ausente', color: '#6b7280' },
	{ value: 'ENDODONCIA', label: 'Endodoncia', color: '#a855f7' },
];

export const ADULT_TEETH_IDS = [
	'18',
	'17',
	'16',
	'15',
	'14',
	'13',
	'12',
	'11',
	'21',
	'22',
	'23',
	'24',
	'25',
	'26',
	'27',
	'28',
	'48',
	'47',
	'46',
	'45',
	'44',
	'43',
	'42',
	'41',
	'31',
	'32',
	'33',
	'34',
	'35',
	'36',
	'37',
	'38',
];

export const CHILD_TEETH_IDS = [
	'55',
	'54',
	'53',
	'52',
	'51',
	'61',
	'62',
	'63',
	'64',
	'65',
	'85',
	'84',
	'83',
	'82',
	'81',
	'71',
	'72',
	'73',
	'74',
	'75',
];
