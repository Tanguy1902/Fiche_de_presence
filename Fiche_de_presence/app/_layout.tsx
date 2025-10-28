import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      setShowLogout(!!user);
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerRight: showLogout
          ? () => (
              <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() => {
                  AsyncStorage.clear().then(() => {
                    setShowLogout(false);
                    router.replace("/login");
                  });
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="black" />
              </TouchableOpacity>
            )
          : undefined,
        headerTitle: "",
      }}
    />
  );
}
