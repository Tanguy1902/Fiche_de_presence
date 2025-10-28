import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getSessions } from '@/controllers/session';

export default function SessionList() {
    const router = useRouter();
    const [sessions, setSessions] = React.useState<{ id: number; theme: string }[]>([]);

    React.useEffect(() => {
        // Suppose getSessions returns a Promise<{ id: number; theme: string }[]>
        getSessions().then(setSessions);
    }, []);

    const handlePress = (id: number) => {
        router.push(`/session/${id}`)
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.sessionItem}
                        onPress={() => handlePress(item.id)}
                    >
                        <Text style={styles.sessionText}>{item.theme}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f0fc',
        padding: 16,
    },
    listContent: {
        paddingBottom: 16,
    },
    sessionItem: {
        backgroundColor: '#a259f7',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: '#f72585',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    sessionText: {
        color: '#fefefe',
        fontSize: 18,
        fontWeight: 'bold',
    },
});