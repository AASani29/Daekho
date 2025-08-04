import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { movieAPI, Movie } from "../../services/api";

const { width, height } = Dimensions.get("window");

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMovieDetails(Number(id));
    }
  }, [id]);

  const loadMovieDetails = async (movieId: number) => {
    try {
      setLoading(true);
      const movieData = await movieAPI.getMovieDetails(movieId);
      setMovie(movieData);
    } catch (error) {
      Alert.alert("Error", "Failed to load movie details.");
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2 text-gray-600">Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Movie not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? movieAPI.getImageUrl(movie.backdrop_path)
    : movieAPI.getImageUrl(movie.poster_path);

  const posterUrl = movie.poster_path
    ? movieAPI.getImageUrl(movie.poster_path)
    : "https://via.placeholder.com/500x750/cccccc/666666?text=No+Image";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header with backdrop */}
        <View className="relative">
          <Image
            source={{ uri: backdropUrl }}
            style={{ width, height: height * 0.3 }}
            className="bg-gray-200"
            resizeMode="cover"
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-black/50 rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Gradient overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
        </View>

        {/* Movie info */}
        <View className="px-4 -mt-10 relative z-10">
          <View className="flex-row">
            {/* Poster */}
            <Image
              source={{ uri: posterUrl }}
              className="w-24 h-36 rounded-lg bg-gray-200 shadow-lg"
              resizeMode="cover"
            />

            {/* Basic info */}
            <View className="flex-1 ml-4 justify-end pb-2">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {movie.title}
              </Text>

              <View className="flex-row items-center mb-2">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-gray-700 ml-1 font-medium">
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <Text className="text-gray-600">
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </View>
          </View>

          {/* Overview */}
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Overview
            </Text>
            <Text className="text-gray-700 leading-6 text-base">
              {movie.overview || "No overview available."}
            </Text>
          </View>

          {/* Additional details */}
          <View className="mt-6 mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-3">
              Details
            </Text>

            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 font-medium">Release Date</Text>
                <Text className="text-gray-800">
                  {new Date(movie.release_date).toLocaleDateString()}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 font-medium">Rating</Text>
                <Text className="text-gray-800">
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 font-medium">Movie ID</Text>
                <Text className="text-gray-800">{movie.id}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
