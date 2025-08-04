import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { movieAPI, Genre } from "../../services/api";
import { UserService } from "../../services/userService";

export default function GenreSelectionScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const genreData = await movieAPI.getGenres();
      setGenres(genreData);
    } catch (error) {
      Alert.alert("Error", "Failed to load genres");
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedGenres.length === 0) {
      Alert.alert("Please select at least one genre");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setSaving(true);
    try {
      // Check if user profile exists, if not create it
      let userProfile = await UserService.getUserProfile(user.uid);

      if (!userProfile) {
        await UserService.createUserProfile(user.uid, user.email || "", {
          preferredGenres: selectedGenres,
        });
      } else {
        await UserService.updatePreferredGenres(user.uid, selectedGenres);
      }

      // Navigate to movie selection
      router.push("/(tabs)"); // For now, go directly to main app
    } catch (error) {
      Alert.alert("Error", "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827",
        }}
      >
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={{ marginTop: 16, fontSize: 18, color: "#9CA3AF" }}>
          Loading genres...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 16,
            color: "#F9FAFB",
          }}
        >
          🎭 Choose Your Favorite Genres
        </Text>
        <Text
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginBottom: 32,
            fontSize: 16,
          }}
        >
          Select the movie genres you enjoy most. This helps us recommend movies
          you'll love.
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              onPress={() => toggleGenre(genre.id)}
              style={{
                margin: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: selectedGenres.includes(genre.id)
                  ? "#F59E0B"
                  : "#374151",
                backgroundColor: selectedGenres.includes(genre.id)
                  ? "#F59E0B"
                  : "#1F2937",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  color: selectedGenres.includes(genre.id)
                    ? "#1F2937"
                    : "#F9FAFB",
                }}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          backgroundColor: "#1F2937",
          paddingTop: 16,
        }}
      >
        <Text
          style={{ textAlign: "center", color: "#9CA3AF", marginBottom: 16 }}
        >
          Selected: {selectedGenres.length} genre
          {selectedGenres.length !== 1 ? "s" : ""}
        </Text>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving || selectedGenres.length === 0}
          style={{
            borderRadius: 12,
            paddingVertical: 14,
            backgroundColor:
              saving || selectedGenres.length === 0 ? "#6B7280" : "#F59E0B",
          }}
        >
          <Text
            style={{
              color:
                saving || selectedGenres.length === 0 ? "#D1D5DB" : "#1F2937",
              textAlign: "center",
              fontWeight: "700",
              fontSize: 18,
            }}
          >
            {saving ? "Saving..." : "🚀 Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
