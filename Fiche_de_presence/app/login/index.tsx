import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLogin } from "@/controllers/login";

export default function Login() {
    const [identifiant, setIdentifiant] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);
    const translateY = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () => {
            setIsInputFocused(true);
            Animated.timing(translateY, {
                toValue: -120,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setIsInputFocused(false);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [translateY]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
                <Text style={styles.title}>DojoCheck</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Identifiant"
                    placeholderTextColor="#BCA6E2"
                    value={identifiant}
                    onChangeText={setIdentifiant}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#BCA6E2"
                    secureTextEntry
                    value={motDePasse}
                    onChangeText={setMotDePasse}
                />
                <TouchableOpacity style={styles.button} onPress={useLogin().login.bind(null, identifiant, motDePasse)}>
                    <LinearGradient
                        colors={["#FF4D9D", "#A44AFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Connexion</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2E005C",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#3C0C74",
        borderRadius: 16,
        padding: 32,
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
        elevation: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 32,
        letterSpacing: 1,
    },
    input: {
        width: "100%",
        height: 48,
        backgroundColor: "#4B1A8C",
        borderRadius: 8,
        paddingHorizontal: 16,
        color: "#FFF",
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        width: "100%",
        height: 48,
        borderRadius: 8,
        overflow: "hidden",
    },
    gradient: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    }
});
