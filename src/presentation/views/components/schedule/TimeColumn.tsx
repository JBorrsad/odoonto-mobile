import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';

export const TimeColumn: React.FC = () => {
	// HOOK: useMemo - Generar horas del día (8:00 - 20:00 cada 30 minutos)
	const hours = useMemo(() => {
		const slots: Array<{ time: string; isHalfHour: boolean }> = [];
		for (let hour = 8; hour <= 20; hour++) {
			slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, isHalfHour: false });
			if (hour < 20) {
				slots.push({ time: '', isHalfHour: true });
			}
		}
		return slots;
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.header} />
			{hours.map((hour, index) => (
				<View key={index} style={styles.slot}>
					{!hour.isHalfHour && (
						<Text style={styles.timeText}>{hour.time}</Text>
					)}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 64,
		paddingRight: theme.spacing.sm,
		borderRightWidth: 1,
		borderRightColor: theme.colors.gray[200],
	},
	header: {
		height: 64,
	},
	slot: {
		height: 48,
		position: 'relative',
	},
	timeText: {
		position: 'absolute',
		top: -2,
		right: theme.spacing.xs,
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
		color: theme.colors.gray[500],
	},
});


