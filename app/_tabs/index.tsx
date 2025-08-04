import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { movieAPI, Movie } from "../../services/api";
import { MovieList } from "../../components/MovieList";
import { SearchBar } from "../../components/SearchBar";

export default function HomeTab() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await movieAPI.getPopularMovies(page);

      if (append) {
        setMovies((prev) => [...prev, ...response.results]);
      } else {
        setMovies(response.results);
      }

      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load movies. Please check your internet connection and API key."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setIsSearching(true);
      const response = await movieAPI.searchMovies(query);
      setMovies(response.results);
      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (error) {
      Alert.alert("Error", "Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      if (isSearching && searchQuery) {
        searchMore(searchQuery, currentPage + 1);
      } else {
        loadPopularMovies(currentPage + 1, true);
      }
    }
  };

  const searchMore = async (query: string, page: number) => {
    try {
      setLoadingMore(true);
      const response = await movieAPI.searchMovies(query, page);
      setMovies((prev) => [...prev, ...response.results]);
      setCurrentPage(response.page);
    } catch (error) {
      Alert.alert("Error", "Failed to load more search results.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}` as any);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    loadPopularMovies();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <SearchBar
          onSearch={handleSearch}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {isSearching && (
          <View className="px-4 mb-2">
            <Text className="text-blue-500 text-sm" onPress={handleClearSearch}>
              ← Back to Popular Movies
            </Text>
          </View>
        )}

        <MovieList
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          onMoviePress={handleMoviePress}
          onEndReached={handleLoadMore}
          title={isSearching ? `Search Results` : "Popular Movies"}
        />
      </View>
    </SafeAreaView>
  );
}
