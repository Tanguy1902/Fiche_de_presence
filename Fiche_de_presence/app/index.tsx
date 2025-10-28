import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        router.push("/login");
      } 
    };
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur la Fiche de présence !</Text>
      <Text style={styles.subtitle}>
        Gérer la présence de vos ninjas facilement
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/session")}>
        <LinearGradient
            colors={["#FF4D9D", "#A44AFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
        >
            <Text style={styles.buttonText}>Voir la liste des sessions</Text>
        </LinearGradient>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    marginTop:-100,
    flex: 1,
    backgroundColor: "#2E005C",
    justifyContent: "center",
    alignItems: "center",
},
  title: {
    fontSize: 32,
    marginBottom: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    color: "#fff",
    textAlign: "center",
  },
  button: {
    width: "90%",
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
