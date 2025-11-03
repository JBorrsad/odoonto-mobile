import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

interface CardProps {
	children: React.ReactNode;
	title?: string;
	style?: object;
}

export const Card: React.FC<CardProps> = ({ children, title, style }) => {
	return (
		<View style={[styles.card, style]}>
			{title && (
				<View style={styles.header}>
					<Text style={styles.title}>{title}</Text>
				</View>
			)}
			<View style={styles.content}>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		shadowColor: theme.colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
		marginVertical: theme.spacing.sm,
		marginHorizontal: theme.spacing.md,
	},
	header: {
		padding: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		backgroundColor: theme.colors.gray[50],
	},
	title: {
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	content: {
		padding: theme.spacing.md,
	},
});

