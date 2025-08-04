import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Movie, movieAPI } from "../../services/api";
import { MovieList } from "../../components/MovieList";
import { SearchBar } from "../../components/SearchBar";
import { ErrorScreen } from "../../components/ErrorScreen";
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../services/userService";
import { RecommendationService, RecommendationSection } from "../../services/recommendationService";

export default function HomeTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [recommendationSections, setRecommendationSections] = useState<RecommendationSection[]>([]);
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
        router.replace('/onboarding/genre-selection');
        return;
      }

      // If user has no preferred genres, redirect to genre selection
      if (userProfile.preferredGenres.length === 0) {
        router.push('/onboarding/genre-selection');
        return;
      }

      const sections = await RecommendationService.getPersonalizedRecommendations(userProfile);
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
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading your recommendations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="px-4 py-2 bg-white shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back!
          </Text>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onSearch={handleSearch}
            placeholder="Search for movies..."
          />
        </View>

        {searchQuery.trim() !== "" ? (
          <View className="flex-1">
            {isSearching ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">Searching...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <MovieList
                movies={searchResults}
                loading={false}
                onMoviePress={handleMoviePress}
                onEndReached={() => {}}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-gray-600">No movies found for your search.</Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView className="flex-1">
            {recommendationSections.map((section, index) => (
              <View key={index} className="mb-6">
                <View className="flex-row justify-between items-center px-4 mb-3">
                  <Text className="text-xl font-bold text-gray-800">
                    {section.title}
                  </Text>
                  {section.movies.length > 6 && (
                    <TouchableOpacity>
                      <Text className="text-blue-600 font-medium">See All</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                  <View className="flex-row">
                    {section.movies.slice(0, 6).map((movie) => (
                      <TouchableOpacity
                        key={movie.id}
                        onPress={() => handleMoviePress(movie)}
                        className="mr-3 w-32"
                      >
                        <View className="bg-white rounded-lg shadow-sm">
                          <Text className="p-2 text-sm font-medium" numberOfLines={2}>
                            {movie.title}
                          </Text>
                          <Text className="px-2 pb-2 text-xs text-gray-600">
                            ⭐ {movie.vote_average.toFixed(1)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}

            {recommendationSections.length === 0 && (
              <View className="flex-1 justify-center items-center px-4">
                <Text className="text-lg text-gray-600 text-center mb-4">
                  No recommendations available yet.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/onboarding/genre-selection')}
                  className="bg-blue-600 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-semibold">
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
