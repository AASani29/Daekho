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
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../services/userService";

const { width, height } = Dimensions.get("window");

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [addingToWatched, setAddingToWatched] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovieDetails(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (user && movie) {
      checkUserMovieStatus();
    }
  }, [user, movie]);

  const checkUserMovieStatus = async () => {
    if (!user || !movie) return;

    try {
      const userProfile = await UserService.getUserProfile(user.uid);
      if (userProfile) {
        setIsWatched(userProfile.watchedMovies.includes(movie.id));
        setIsLiked(userProfile.likedMovies.includes(movie.id));
      }
    } catch (error) {
      console.error('Error checking user movie status:', error);
    }
  };

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

  const handleMarkAsWatched = async () => {
    if (!user || !movie) {
      Alert.alert('Error', 'Please log in to mark movies as watched');
      return;
    }

    setAddingToWatched(true);
    try {
      await UserService.addWatchedMovie(user.uid, movie.id, 8); // Default rating of 8
      setIsWatched(true);
      Alert.alert('Success', 'Movie added to your watched list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add movie to watched list');
    } finally {
      setAddingToWatched(false);
    }
  };

  const handleLikeMovie = async () => {
    if (!user || !movie) {
      Alert.alert('Error', 'Please log in to like movies');
      return;
    }

    try {
      await UserService.addLikedMovie(user.uid, movie.id);
      setIsLiked(true);
      Alert.alert('Success', 'Movie added to your liked list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to like movie');
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

            <View className="bg-gray-50 rounded-lg p-4 mb-6">
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

            {/* Action Buttons */}
            {user && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleMarkAsWatched}
                  disabled={isWatched || addingToWatched}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                    isWatched
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-blue-600'
                  }`}
                >
                  <Ionicons
                    name={isWatched ? 'checkmark-circle' : 'eye'}
                    size={20}
                    color={isWatched ? '#16a34a' : '#ffffff'}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`font-semibold ${
                      isWatched ? 'text-green-700' : 'text-white'
                    }`}
                  >
                    {addingToWatched
                      ? 'Adding...'
                      : isWatched
                      ? 'Watched'
                      : 'Mark as Watched'
                    }
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLikeMovie}
                  disabled={isLiked}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                    isLiked
                      ? 'bg-red-100 border border-red-300'
                      : 'bg-white border border-gray-300'
                  }`}
                >
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isLiked ? '#dc2626' : '#6b7280'}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`font-semibold ${
                      isLiked ? 'text-red-700' : 'text-gray-700'
                    }`}
                  >
                    {isLiked ? 'Liked' : 'Like'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
