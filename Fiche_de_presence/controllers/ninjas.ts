import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from '@/controllers/api'

export async function getNinjas(): Promise<any[]> {
    await refreshToken();
    const apiToken = await AsyncStorage.getItem('api_token');
    if (!apiToken) throw new Error('API token not found');
    console.log(apiToken)
    const response = await fetch('http://192.168.1.205:8000/api/ninjas/', {
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
    console.log(data);
    return data;
}