import { refreshToken } from '@/controllers/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getNinjas(): Promise<any[]> {
    await refreshToken();
    const apiToken = await AsyncStorage.getItem('api_token');
    if (!apiToken) throw new Error('API token not found');
    const response = await fetch('http://192.168.43.1:8000/api/ninjas/', {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ninjas: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
}