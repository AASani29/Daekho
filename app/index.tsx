import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { isApiConfigured } from "../config";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check if API is configured and redirect accordingly
    const checkAndRedirect = () => {
      if (isApiConfigured()) {
        // API is configured, go to tabs
        router.replace("/(tabs)");
      } else {
        // API not configured, go to setup
        router.replace("/setup");
      }
    };

    // Small delay to ensure navigation is ready
    const timer = setTimeout(checkAndRedirect, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-4 text-lg text-gray-600">Loading Daekho...</Text>
    </View>
  );
}
