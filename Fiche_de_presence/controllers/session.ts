import {refreshToken} from '@/controllers/api'

export const getSessions = async (): Promise<{ id: number; theme: string }[]> => {
    try {
        await refreshToken();
        const response = await fetch('http://192.168.1.205:8000/api/sessions/');
        const data = await response.json();
        return data.map((session: any) => ({
            id: session.id,
            theme: session.theme,
        }));
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw new Error('Failed to fetch sessions');
    }
};
