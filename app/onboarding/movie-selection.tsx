import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Movie, movieAPI } from "../../services/api";
import { UserService } from "../../services/userService";
import { RecommendationService } from "../../services/recommendationService";

export default function MovieSelectionScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadMoviesForSelection();
  }, []);

  const loadMoviesForSelection = async () => {
    if (!user) return;

    try {
      const userProfile = await UserService.getUserProfile(user.uid);
      if (!userProfile || userProfile.preferredGenres.length === 0) {
        // If no genres selected, show popular movies
        const popularMovies = await movieAPI.getPopularMovies();
        setMovies(popularMovies.results.slice(0, 20));
      } else {
        // Get movies from selected genres
        const genreMovies = await RecommendationService.getGenreSelectionMovies(
          userProfile.preferredGenres.slice(0, 3)
        );
        const allMovies: Movie[] = [];
        Object.values(genreMovies).forEach((movieList) => {
          allMovies.push(...movieList);
        });
        setMovies(allMovies.slice(0, 30));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const toggleMovie = (movieId: number) => {
    setSelectedMovies((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  const handleContinue = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setSaving(true);
    try {
      // Add selected movies as watched movies
      for (const movieId of selectedMovies) {
        await UserService.addWatchedMovie(user.uid, movieId, 8); // Assume they liked it with rating 8
      }

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to save movie selections");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg text-gray-600">Loading movies...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 pt-12">
        <Text className="text-3xl font-bold text-center mb-4 text-gray-800">
          Movies You've Watched
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Select movies you've already seen. This helps us understand your taste
          better.
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {movies.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              onPress={() => toggleMovie(movie.id)}
              className={`w-[48%] mb-4 rounded-lg overflow-hidden ${
                selectedMovies.includes(movie.id) ? "ring-2 ring-blue-600" : ""
              }`}
            >
              <View className="relative">
                <Image
                  source={{ uri: movieAPI.getImageUrl(movie.poster_path) }}
                  className="w-full h-60 bg-gray-300"
                  resizeMode="cover"
                />
                {selectedMovies.includes(movie.id) && (
                  <View className="absolute top-2 right-2 bg-blue-600 rounded-full w-6 h-6 justify-center items-center">
                    <Text className="text-white text-xs font-bold">✓</Text>
                  </View>
                )}
              </View>
              <View className="p-2 bg-white">
                <Text
                  className="text-sm font-medium text-gray-800"
                  numberOfLines={2}
                >
                  {movie.title}
                </Text>
                <Text className="text-xs text-gray-600">
                  ⭐ {movie.vote_average.toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pb-6 bg-white">
        <Text className="text-center text-gray-600 mb-4">
          Selected: {selectedMovies.length} movie
          {selectedMovies.length !== 1 ? "s" : ""}
        </Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleSkip}
            className="flex-1 rounded-lg py-3 border border-gray-300"
          >
            <Text className="text-gray-700 text-center font-semibold">
              Skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={saving}
            className={`flex-1 rounded-lg py-3 ${
              saving ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {saving ? "Saving..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
