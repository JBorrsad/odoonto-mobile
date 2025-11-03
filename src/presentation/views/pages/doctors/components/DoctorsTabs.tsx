import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';

type TabType = 'Doctor Staff' | 'General Staff';

interface DoctorsTabsProps {
	selectedTab: TabType;
	onTabChange: (tab: TabType) => void;
}

export const DoctorsTabs: React.FC<DoctorsTabsProps> = ({ selectedTab, onTabChange }) => {
	return (
		<View style={styles.tabsContainer}>
			<TouchableOpacity
				style={[styles.tab, selectedTab === 'Doctor Staff' && styles.tabActive]}
				onPress={() => onTabChange('Doctor Staff')}
			>
				<Text
					style={[
						styles.tabText,
						selectedTab === 'Doctor Staff' && styles.tabTextActive,
					]}
				>
					Doctor Staff
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab, selectedTab === 'General Staff' && styles.tabActive]}
				onPress={() => onTabChange('General Staff')}
			>
				<Text
					style={[
						styles.tabText,
						selectedTab === 'General Staff' && styles.tabTextActive,
					]}
				>
					General Staff
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	tabsContainer: {
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		paddingHorizontal: theme.spacing.md,
	},
	tab: {
		padding: theme.spacing.md,
		borderBottomWidth: 2,
		borderBottomColor: 'transparent',
		marginRight: theme.spacing.md,
	},
	tabActive: {
		borderBottomColor: theme.colors.primary,
	},
	tabText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '500',
		color: theme.colors.gray[500],
	},
	tabTextActive: {
		color: theme.colors.primary,
		fontWeight: '600',
	},
});
