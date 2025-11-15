import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { getNinjas } from '@/controllers/ninjas';
import { postPresence, getPresence, generatePDF } from '@/controllers/presence';
import { useLocalSearchParams } from 'expo-router';

const NinjaList = () => {
    const [ninjas, setNinjas] = useState<{ id: number, nom: string, prenom: string, classe: string }[]>([]);
    const [checked, setChecked] = useState<number[]>([]);
    const [hasPresence, setHasPresence] = useState(false);
    const { id } = useLocalSearchParams();

    // Chargement des ninjas + présences existantes
    useEffect(() => {
        const loadData = async () => {
            try {
                const [ninjaData, presenceData] = await Promise.all([
                    getNinjas(),
                    getPresence()
                ]);

                setNinjas(ninjaData);

                const sessionId = parseInt(id[0], 10);
                if (isNaN(sessionId)) return;

                const sessionPresences = presenceData.filter((p: any) => p.session === sessionId);

                // Extraire les IDs des ninjas présents
                const presentNinjaIds = sessionPresences
                    .filter((p: any) => p.present === true)
                    .map((p: any) => p.ninja);

                setChecked(presentNinjaIds);
                setHasPresence(presentNinjaIds.length > 0);
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            }
        };

        loadData();
    }, [id]);

    const toggleCheck = (ninjaId: number) => {
        setChecked(prev =>
            prev.includes(ninjaId)
                ? prev.filter(id => id !== ninjaId)
                : [...prev, ninjaId]
        );
    };

    const validatePresence = async () => {
        const sessionId = parseInt(id[0], 10);
        if (isNaN(sessionId)) return;

        try {
            // Mettre à jour ou créer la présence pour chaque ninja
            for (const ninja of ninjas) {
                await postPresence(sessionId, ninja.id, checked.includes(ninja.id));
            }

            // Recharger les présences pour mise à jour
            const data = await getPresence();
            const sessionPresences = data.filter((p: any) => p.session === sessionId);
            const presentIds = sessionPresences
                .filter((p: any) => p.present)
                .map((p: any) => p.ninja);

            setChecked(presentIds);
            setHasPresence(presentIds.length > 0);

            console.log("Présence validée avec succès");
        } catch (error) {
            console.error("Erreur lors de la validation :", error);
        }
    };

    const generatePdfNow = async () => {
        const sessionId = parseInt(id[0], 10);
        if (isNaN(sessionId)) return;

        await generatePDF(sessionId);
    };

    if (ninjas.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
                    Chargement des ninjas...
                </Text>
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
                                {checked.includes(ninja.id) && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                        <View style={styles.ninjaInfo}>
                            <Text style={styles.ninjaText}>
                                {ninja.nom} {ninja.prenom}
                            </Text>
                            <Text style={styles.ninjaClasse}>{ninja.classe}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bouton Valider */}
            <LinearGradient
                colors={['#ff5f6d', '#c850c0']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buttonGradient}
            >
                <TouchableOpacity style={styles.button} onPress={validatePresence}>
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* Bouton Générer PDF */}
            <TouchableOpacity
                onPress={generatePdfNow}
                disabled={!hasPresence}
                style={[
                    styles.pdfButton,
                    !hasPresence && styles.pdfButtonDisabled
                ]}
            >
                <Feather name="file-text" size={22} color={hasPresence ? "#fff" : "#ccc"} />
                <Text style={[
                    styles.pdfButtonText,
                    !hasPresence && { color: "#ccc" }
                ]}>
                    Générer PDF
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 80,
    },
    list: {
        flex: 1,
    },
    ninjaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 12,
    },
    checkboxBox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#c850c0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#ff5f6d',
        borderColor: '#ff5f6d',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ninjaInfo: {
        flex: 1,
    },
    ninjaText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    ninjaClasse: {
        fontSize: 14,
        color: '#888',
    },
    buttonGradient: {
        borderRadius: 24,
        marginTop: 30,
        overflow: 'hidden',
    },
    button: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8b5cf6',
        paddingVertical: 12,
        borderRadius: 18,
        marginTop: 16,
        gap: 8,
    },
    pdfButtonDisabled: {
        backgroundColor: '#e5e0ff',
    },
    pdfButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default NinjaList;