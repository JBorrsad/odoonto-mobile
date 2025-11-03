import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../../../components/Button';

interface DoctorsHeaderProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onAddDoctor: () => void;
}

export const DoctorsHeader: React.FC<DoctorsHeaderProps> = ({
	searchQuery,
	onSearchChange,
	onAddDoctor,
}) => {
	return (
		<View style={styles.header}>
			<Text style={styles.headerTitle}>Staff List</Text>
			<View style={styles.headerActions}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search for anything here..."
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholderTextColor={theme.colors.gray[400]}
				/>
				<TouchableOpacity style={styles.addButton} onPress={onAddDoctor}>
					<Text style={styles.addButtonText}>+</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		flexWrap: 'wrap',
		gap: theme.spacing.sm,
	},
	headerTitle: {
		fontSize: theme.fontSizes.xl,
		fontWeight: '600',
		color: theme.colors.gray[800],
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	searchInput: {
		backgroundColor: theme.colors.gray[100],
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.full,
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[900],
		width: 200,
		paddingLeft: theme.spacing.md,
	},
	addButton: {
		backgroundColor: theme.colors.primary,
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addButtonText: {
		color: theme.colors.white,
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
	},
});
