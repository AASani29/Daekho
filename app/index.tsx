import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { isApiConfigured, config } from "../config";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Debug environment variables
    console.log("Debug: TMDB API Key length:", config.tmdb.apiKey?.length || 0);
    console.log("Debug: API configured:", isApiConfigured());
    
    console.log(
      "Index: Auth loading:",
      loading,
      "User:",
      user ? user.email : "No user"
    );
    if (loading) return; // Wait for auth state to load

    const checkAndRedirect = () => {
      console.log("Index: Checking redirect conditions...");
      console.log("Index: API configured:", isApiConfigured());
      console.log("Index: User authenticated:", !!user);

      if (!isApiConfigured()) {
        // API not configured, go to setup
        console.log("Index: Redirecting to setup");
        router.replace("/setup");
        return;
      }

      if (!user) {
        // User not authenticated, go to login
        console.log("Index: Redirecting to login");
        router.replace("/auth/login");
        return;
      }

      // User is authenticated, check if they need onboarding
      console.log("Index: User authenticated, checking onboarding status...");
      checkUserOnboardingStatus();
    };

    // Small delay to ensure navigation is ready
    const timer = setTimeout(checkAndRedirect, 500);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const checkUserOnboardingStatus = async () => {
    if (!user) return;

    try {
      console.log("Index: Checking user profile for:", user.uid);
      const { UserService } = await import("../services/userService");
      const userProfile = await UserService.getUserProfile(user.uid);

      if (!userProfile) {
        console.log(
          "Index: No user profile found, redirecting to genre selection"
        );
        router.replace("/onboarding/genre-selection");
      } else if (userProfile.preferredGenres.length === 0) {
        console.log(
          "Index: No preferred genres, redirecting to genre selection"
        );
        router.replace("/onboarding/genre-selection");
      } else {
        console.log("Index: User profile complete, redirecting to main app");
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Index: Error checking user profile:", error);
      // Fallback to genre selection
      router.replace("/onboarding/genre-selection");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
        padding: 20,
      }}
    >
      <ActivityIndicator size="large" color="#F59E0B" />
      <Text style={{ marginTop: 16, fontSize: 18, color: "#F9FAFB" }}>
        Loading Daekho...
      </Text>

      {/* Debug info */}
      <View
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#1F2937",
          borderRadius: 12,
          width: "100%",
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <Text style={{ fontSize: 14, color: "#F9FAFB", marginBottom: 8 }}>
          Debug Info:
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
          Loading: {loading.toString()}
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
          User: {user ? user.email : "Not authenticated"}
        </Text>
        <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
          API Configured: {isApiConfigured().toString()}
        </Text>
      </View>

      {/* Manual navigation buttons for debugging */}
      {!loading && (
        <View style={{ marginTop: 20, width: "100%" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#F59E0B",
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={() => router.replace("/auth/login")}
          >
            <Text
              style={{
                color: "#1F2937",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Go to Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#10B981",
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
            }}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text
              style={{
                color: "#1F2937",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Go to Main App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#8B5CF6",
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => router.replace("/onboarding/genre-selection")}
          >
            <Text
              style={{
                color: "#F9FAFB",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Go to Genre Selection
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
