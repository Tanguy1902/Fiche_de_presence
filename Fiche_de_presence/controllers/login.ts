import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://192.168.43.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                setError(`Login failed: ${errorText}`);
                console.error('Login failed:', errorText);
                setLoading(false);
                return null;
            }

            const data = await response.json();
            const apiToken = data.access;
            const refresh = data.refresh;

            if (!apiToken) {
                setError('Invalid credentials or token not found.');
                setLoading(false);
                return null;
            }

            setLoading(false);
            await AsyncStorage.setItem('api_token', apiToken);
            await AsyncStorage.setItem('refresh_token', refresh);
            await AsyncStorage.setItem('user', username);
            console.log('Login successful, token stored.');
            router.replace('/');
            return apiToken;
        } catch (e) {
            console.error('Login error:', e);
            setError('Login failed.');
            setLoading(false);
            return null;
        }
    };

    return { login, loading, error };
};
