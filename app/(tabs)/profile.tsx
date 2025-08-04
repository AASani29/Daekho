import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { UserService, UserProfile } from "../../services/userService";
import { Movie, movieAPI, Genre } from "../../services/api";
import { MovieCard } from "../../components/MovieCard";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load user profile
      const profile = await UserService.getUserProfile(user.uid);
      setUserProfile(profile);

      // Load genres
      const genreData = await movieAPI.getGenres();
      setGenres(genreData);

      // Load watched movies details
      if (profile && profile.watchedMovies.length > 0) {
        const moviePromises = profile.watchedMovies
          .slice(0, 10)
          .map((movieId) => movieAPI.getMovieDetails(movieId));
        const movies = await Promise.allSettled(moviePromises);
        const validMovies = movies
          .filter(
            (result): result is PromiseFulfilledResult<Movie> =>
              result.status === "fulfilled"
          )
          .map((result) => result.value);
        setWatchedMovies(validMovies);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={{ marginTop: 16, fontSize: 18, color: "#9CA3AF" }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#9CA3AF",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Profile not found. Please complete the setup.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/onboarding/genre-selection")}
            style={{
              backgroundColor: "#F59E0B",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#1F2937", fontWeight: "600" }}>
              Complete Setup
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#1F2937",
            paddingHorizontal: 24,
            paddingVertical: 32,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#F9FAFB",
                  marginBottom: 8,
                }}
              >
                Your Profile 👤
              </Text>
              <Text
                style={{ color: "#9CA3AF", marginBottom: 16, fontSize: 16 }}
              >
                {user?.email}
              </Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#F59E0B",
                    }}
                  >
                    {userProfile.watchedMovies.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
                    Watched
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#F59E0B",
                    }}
                  >
                    {userProfile.likedMovies.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#9CA3AF" }}>Liked</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#F59E0B",
                    }}
                  >
                    {userProfile.preferredGenres.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#9CA3AF" }}>Genres</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#DC2626",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#F9FAFB", fontWeight: "600" }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View
          style={{
            backgroundColor: "#1F2937",
            marginHorizontal: 16,
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#F9FAFB",
              marginBottom: 12,
            }}
          >
            🎬 Your Preferences
          </Text>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ color: "#F9FAFB", fontWeight: "600", marginBottom: 8 }}
            >
              Favorite Genres
            </Text>
            <Text style={{ color: "#9CA3AF" }}>
              {getGenreNames(userProfile.preferredGenres) ||
                "No genres selected"}
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ color: "#F9FAFB", fontWeight: "600", marginBottom: 8 }}
            >
              Minimum Rating
            </Text>
            <Text style={{ color: "#F59E0B" }}>
              ⭐ {userProfile.preferredRating.toFixed(1)} and above
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/onboarding/genre-selection")}
            style={{
              backgroundColor: "#F59E0B",
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "#1F2937",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Update Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recently Watched */}
        {watchedMovies.length > 0 && (
          <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#F9FAFB" }}
              >
                🎞️ Recently Watched
              </Text>
              <TouchableOpacity>
                <Text style={{ color: "#F59E0B", fontWeight: "600" }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row" }}>
                {watchedMovies.map((movie) => (
                  <View key={movie.id} style={{ marginRight: 12, width: 128 }}>
                    <TouchableOpacity
                      onPress={() => router.push(`/movie/${movie.id}`)}
                    >
                      <Image
                        source={{
                          uri: movieAPI.getImageUrl(movie.poster_path),
                        }}
                        style={{
                          width: "100%",
                          height: 192,
                          borderRadius: 12,
                          backgroundColor: "#374151",
                        }}
                        resizeMode="cover"
                      />
                      <Text
                        style={{
                          marginTop: 8,
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#F9FAFB",
                        }}
                        numberOfLines={2}
                      >
                        {movie.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#F59E0B" }}>
                        ⭐ {movie.vote_average.toFixed(1)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Account Actions */}
        <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 32 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#1F2937",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#F9FAFB", fontWeight: "600" }}>
              📖 Watch History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#1F2937",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#F9FAFB", fontWeight: "600" }}>
              ❤️ Liked Movies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#1F2937",
              padding: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ color: "#F9FAFB", fontWeight: "600" }}>
              ⚙️ Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
