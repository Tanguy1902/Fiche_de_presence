import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getNinjas } from '@/controllers/ninjas'; // Adapte selon ton export

const NinjaList = () => {
    const [ninjas, setNinjas] = useState<{ id: number, nom: string, prenom: string, classe: string }[]>([]);
    const [checked, setChecked] = useState<number[]>([]);

    useEffect(() => {
        // Si getNinjas est async
        const fetchNinjas = async () => {
            const data = await getNinjas();
            setNinjas(data);
        };
        fetchNinjas();
    }, []);

    const toggleCheck = (id: number) => {
        setChecked(prev =>
            prev.includes(id) ? prev.filter(ninjaId => ninjaId !== id) : [...prev, id]
        );
    };

    if (ninjas.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Aucun ninja trouvé</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.list}>
                {ninjas.map(ninja => (
                    <View key={ninja.id} style={styles.ninjaRow}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => toggleCheck(ninja.id)}
                        >
                            <View style={[
                                styles.checkboxBox,
                                checked.includes(ninja.id) && styles.checkboxChecked
                            ]}>
                                {checked.includes(ninja.id) && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.ninjaInfo}>
                            <Text style={styles.ninjaText}>{ninja.nom} {ninja.prenom}</Text>
                            <Text style={styles.ninjaClasse}>{ninja.classe}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <LinearGradient
                colors={['#ff5f6d', '#c850c0']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buttonGradient}
            >
                <TouchableOpacity style={styles.button} onPress={() => { } }>
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff', marginBottom:50 },
    list: { flex: 1 },
    ninjaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    checkbox: { marginRight: 12 },
    checkboxBox: {
        width: 24, height: 24, borderRadius: 6,
        borderWidth: 2, borderColor: '#c850c0', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#fff'
    },
    checkboxChecked: { backgroundColor: '#ff5f6d', borderColor: '#ff5f6d' },
    checkmark: { color: '#fff', fontWeight: 'bold' },
    ninjaInfo: { flex: 1 },
    ninjaText: { fontSize: 16, fontWeight: 'bold' },
    ninjaClasse: { fontSize: 14, color: '#888' },
    buttonGradient: {
        borderRadius: 24,
        marginTop: 40,
        overflow: 'hidden',
    },
    button: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', fontWeight: 'bold', fontSize: 18,
        letterSpacing: 1,
    },
});

export default NinjaList;