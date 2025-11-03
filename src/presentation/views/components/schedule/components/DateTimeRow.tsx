import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../../../core/theme';
import { FormField } from './FormField';

interface DateTimeRowProps {
	date: string;
	time: string;
	onDateChange: (value: string) => void;
	onTimeChange: (value: string) => void;
	dateError?: string;
	timeError?: string;
	loading?: boolean;
}

export const DateTimeRow: React.FC<DateTimeRowProps> = ({
	date,
	time,
	onDateChange,
	onTimeChange,
	dateError,
	timeError,
	loading = false,
}) => {
	return (
		<View style={styles.row}>
			<View style={styles.fieldHalf}>
				<FormField
					label="Fecha"
					value={date}
					onChangeText={onDateChange}
					placeholder="YYYY-MM-DD"
					error={dateError}
					editable={!loading}
				/>
			</View>
			<View style={styles.fieldHalf}>
				<FormField
					label="Hora"
					value={time}
					onChangeText={onTimeChange}
					placeholder="HH:MM"
					error={timeError}
					editable={!loading}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: theme.spacing.md,
	},
	fieldHalf: {
		flex: 1,
	},
});
