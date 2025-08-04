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
      console.error("Error checking user movie status:", error);
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
      Alert.alert("Error", "Please log in to mark movies as watched");
      return;
    }

    setAddingToWatched(true);
    try {
      await UserService.addWatchedMovie(user.uid, movie.id, 8); // Default rating of 8
      setIsWatched(true);
      Alert.alert("Success", "Movie added to your watched list!");
    } catch (error) {
      Alert.alert("Error", "Failed to add movie to watched list");
    } finally {
      setAddingToWatched(false);
    }
  };

  const handleLikeMovie = async () => {
    if (!user || !movie) {
      Alert.alert("Error", "Please log in to like movies");
      return;
    }

    try {
      await UserService.addLikedMovie(user.uid, movie.id);
      setIsLiked(true);
      Alert.alert("Success", "Movie added to your liked list!");
    } catch (error) {
      Alert.alert("Error", "Failed to like movie");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={{ marginTop: 8, color: "#9CA3AF" }}>
            Loading movie details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#9CA3AF" }}>Movie not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 16,
              backgroundColor: "#F59E0B",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#1F2937", fontWeight: "600" }}>Go Back</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header with backdrop */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: backdropUrl }}
            style={{ width, height: height * 0.3 }}
            resizeMode="cover"
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#F9FAFB" />
          </TouchableOpacity>
        </View>

        {/* Movie info */}
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: -40,
            position: "relative",
            zIndex: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {/* Poster */}
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Image
                source={{ uri: posterUrl }}
                style={{
                  width: 96,
                  height: 144,
                  borderRadius: 12,
                  backgroundColor: "#374151",
                }}
                resizeMode="cover"
              />
            </View>

            {/* Basic info */}
            <View
              style={{
                flex: 1,
                marginLeft: 16,
                justifyContent: "flex-end",
                paddingBottom: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#F9FAFB",
                  marginBottom: 8,
                }}
              >
                {movie.title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text
                  style={{
                    color: "#F59E0B",
                    marginLeft: 4,
                    fontWeight: "600",
                  }}
                >
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <Text style={{ color: "#9CA3AF" }}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </View>
          </View>

          {/* Overview */}
          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#F9FAFB",
                marginBottom: 12,
              }}
            >
              📖 Overview
            </Text>
            <Text
              style={{
                color: "#D1D5DB",
                lineHeight: 24,
                fontSize: 16,
              }}
            >
              {movie.overview || "No overview available."}
            </Text>
          </View>

          {/* Additional details */}
          <View style={{ marginTop: 24, marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#F9FAFB",
                marginBottom: 12,
              }}
            >
              🎬 Details
            </Text>

            <View
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#9CA3AF", fontWeight: "600" }}>
                  Release Date
                </Text>
                <Text style={{ color: "#F9FAFB" }}>
                  {new Date(movie.release_date).toLocaleDateString()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#9CA3AF", fontWeight: "600" }}>
                  Rating
                </Text>
                <Text style={{ color: "#F59E0B", fontWeight: "600" }}>
                  {movie.vote_average.toFixed(1)}/10
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#9CA3AF", fontWeight: "600" }}>
                  Movie ID
                </Text>
                <Text style={{ color: "#F9FAFB" }}>{movie.id}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            {user && (
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={handleMarkAsWatched}
                  disabled={isWatched || addingToWatched}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: isWatched ? "#374151" : "#F59E0B",
                  }}
                >
                  <Ionicons
                    name={isWatched ? "checkmark-circle" : "eye"}
                    size={20}
                    color={isWatched ? "#9CA3AF" : "#1F2937"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontWeight: "600",
                      color: isWatched ? "#9CA3AF" : "#1F2937",
                    }}
                  >
                    {addingToWatched
                      ? "Adding..."
                      : isWatched
                      ? "Watched"
                      : "Mark as Watched"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLikeMovie}
                  disabled={isLiked}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: isLiked ? "#374151" : "#DC2626",
                  }}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "#9CA3AF" : "#F9FAFB"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontWeight: "600",
                      color: isLiked ? "#9CA3AF" : "#F9FAFB",
                    }}
                  >
                    {isLiked ? "Liked" : "Like"}
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
