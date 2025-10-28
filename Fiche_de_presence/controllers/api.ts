import AsyncStorage from '@react-native-async-storage/async-storage';

export async function refreshToken() {
    try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await fetch('http://192.168.1.205:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const { access } = data;

        if (!access) throw new Error('Access token not found in response');

        await AsyncStorage.setItem('api_token', access);
        return access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}
