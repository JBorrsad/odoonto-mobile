import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { BottomNavigationBar } from '../src/presentation/views/components/layout/BottomNavigationBar';

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<View style={{ flex: 1 }}>
				<Stack />
				<BottomNavigationBar />
			</View>
		</SafeAreaProvider>
	);
}
