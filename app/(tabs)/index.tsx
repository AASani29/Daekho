import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Movie, movieAPI } from "../../services/api";
import { MovieList } from "../../components/MovieList";
import { SearchBar } from "../../components/SearchBar";
import { ErrorScreen } from "../../components/ErrorScreen";
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../services/userService";
import {
  RecommendationService,
  RecommendationSection,
} from "../../services/recommendationService";

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [recommendationSections, setRecommendationSections] = useState<
    RecommendationSection[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPersonalizedRecommendations();
    }
  }, [user]);

  const loadPersonalizedRecommendations = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!user) return;

      const userProfile = await UserService.getUserProfile(user.uid);

      // If user doesn't have a profile yet, redirect to onboarding
      if (!userProfile) {
        router.replace("/onboarding/genre-selection");
        return;
      }

      // If user has no preferred genres, redirect to genre selection
      if (userProfile.preferredGenres.length === 0) {
        router.push("/onboarding/genre-selection");
        return;
      }

      const sections =
        await RecommendationService.getPersonalizedRecommendations(userProfile);
      setRecommendationSections(sections);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load recommendations";
      setError(errorMessage);
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await movieAPI.searchMovies(query);
      setSearchResults(response.results);
    } catch (error) {
      Alert.alert("Error", "Failed to search movies");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  if (error) {
    return (
      <ErrorScreen
        title="Unable to Load Recommendations"
        error={error}
        onRetry={loadPersonalizedRecommendations}
      />
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#9CA3AF" }}>
            Loading your recommendations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: "#1F2937",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#F9FAFB",
              marginBottom: 16,
            }}
          >
            Welcome back! 🎬
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onSearch={handleSearch}
            placeholder="Search for movies..."
          />
        </View>

        {searchQuery.trim() !== "" ? (
          <View style={{ flex: 1, backgroundColor: "#111827" }}>
            {isSearching ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#9CA3AF" }}>Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <MovieList
                movies={searchResults}
                loading={false}
                onMoviePress={handleMoviePress}
                onEndReached={() => {}}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#9CA3AF" }}>
                  No movies found for your search.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView style={{ flex: 1, backgroundColor: "#111827" }}>
            {recommendationSections.map((section, index) => (
              <View key={index} style={{ marginBottom: 24 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#F9FAFB",
                    }}
                  >
                    {section.title}
                  </Text>
                  {section.movies.length > 6 && (
                    <TouchableOpacity>
                      <Text style={{ color: "#F59E0B", fontWeight: "600" }}>
                        See All
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingHorizontal: 16 }}
                >
                  <View style={{ flexDirection: "row" }}>
                    {section.movies.slice(0, 6).map((movie) => (
                      <TouchableOpacity
                        key={movie.id}
                        onPress={() => handleMoviePress(movie)}
                        style={{ marginRight: 12, width: 140 }}
                      >
                        <View
                          style={{
                            backgroundColor: "#1F2937",
                            borderRadius: 12,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            source={{
                              uri: movie.poster_path
                                ? movieAPI.getImageUrl(movie.poster_path)
                                : "https://via.placeholder.com/500x750/374151/9CA3AF?text=No+Image",
                            }}
                            style={{
                              width: "100%",
                              height: 180,
                              backgroundColor: "#374151",
                            }}
                            resizeMode="cover"
                          />
                          <View style={{ padding: 8 }}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#F9FAFB",
                                marginBottom: 4,
                              }}
                              numberOfLines={2}
                            >
                              {movie.title}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#F59E0B",
                              }}
                            >
                              ⭐ {movie.vote_average.toFixed(1)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}

            {recommendationSections.length === 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 16,
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
                  No recommendations available yet.
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
                    Update Your Preferences
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
