import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

interface WorkingDaysProps {
	days: number[]; // Array de índices de días (0-6)
}

export const WorkingDays: React.FC<WorkingDaysProps> = ({ days }) => {
	// HOOK: useMemo - Memoizar días de la semana
	const allDays = useMemo(() => ['S', 'M', 'T', 'W', 'T', 'F', 'S'], []);

	return (
		<View style={styles.container}>
			{allDays.map((day, index) => {
				const isWorkingDay = days.includes(index);
				return (
					<View
						key={index}
						style={[
							styles.day,
							isWorkingDay ? styles.dayWorking : styles.dayOff,
						]}
					>
						<Text
							style={[
								styles.dayText,
								isWorkingDay ? styles.dayTextWorking : styles.dayTextOff,
							]}
						>
							{day}
						</Text>
					</View>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: theme.spacing.xs,
	},
	day: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dayWorking: {
		backgroundColor: theme.colors.primary + '30', // blue-100
	},
	dayOff: {
		backgroundColor: theme.colors.gray[100],
	},
	dayText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	dayTextWorking: {
		color: theme.colors.primary,
	},
	dayTextOff: {
		color: theme.colors.gray[400],
	},
});


