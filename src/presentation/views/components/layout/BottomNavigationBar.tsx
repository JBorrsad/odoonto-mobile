import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { theme } from '../../../../core/theme';

interface NavigationItem {
	label: string;
	route: string;
	icon: string;
}

export const BottomNavigationBar: React.FC = () => {
	const router = useRouter();
	const pathname = usePathname();

	// HOOK: useMemo - Definir items de navegación
	const navigationItems: NavigationItem[] = useMemo(
		() => [
			{ label: 'Home', route: '/', icon: '🏠' },
			{ label: 'Pacientes', route: '/patients', icon: '👥' },
			{ label: 'Doctores', route: '/doctors', icon: '👨‍⚕️' },
			{ label: 'Horario', route: '/schedule', icon: '📅' },
		],
		[]
	);

	// HOOK: useMemo - Determinar si una ruta está activa
	const isActive = useCallback(
		(route: string): boolean => {
			if (route === '/') {
				return pathname === '/';
			}
			return pathname?.startsWith(route) || false;
		},
		[pathname]
	);

	// HOOK: useCallback - Manejar navegación
	const handleNavigation = useCallback(
		(route: string) => {
			router.push(route as any);
		},
		[router]
	);

	return (
		<View style={styles.container}>
			{navigationItems.map(item => {
				const active = isActive(item.route);
				return (
					<TouchableOpacity
						key={item.route}
						style={[styles.navItem, active && styles.navItemActive]}
						onPress={() => handleNavigation(item.route)}
						activeOpacity={0.7}
					>
						<Text style={[styles.icon, active && styles.iconActive]}>{item.icon}</Text>
						<Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: theme.colors.white,
		borderTopWidth: 1,
		borderTopColor: theme.colors.gray[200],
		paddingVertical: theme.spacing.sm,
		paddingBottom: theme.spacing.md + 8, // Safe area para notch/gestos
		shadowColor: theme.colors.black,
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	navItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: theme.spacing.xs,
	},
	navItemActive: {
		backgroundColor: theme.colors.primary + '10',
		borderRadius: theme.borderRadius.md,
	},
	icon: {
		fontSize: theme.fontSizes.xl,
		marginBottom: theme.spacing.xs / 2,
	},
	iconActive: {
		opacity: 1,
	},
	label: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
		fontWeight: '500',
	},
	labelActive: {
		color: theme.colors.primary,
		fontWeight: '600',
	},
});

