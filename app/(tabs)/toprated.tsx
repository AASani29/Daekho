import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { movieAPI, Movie } from "../../services/api";
import { MovieList } from "../../components/MovieList";

export default function TopRatedTab() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTopRatedMovies();
  }, []);

  const loadTopRatedMovies = async (
    page: number = 1,
    append: boolean = false
  ) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await movieAPI.getTopRatedMovies(page);

      if (append) {
        setMovies((prev) => [...prev, ...response.results]);
      } else {
        setMovies(response.results);
      }

      setCurrentPage(response.page);
      setTotalPages(response.total_pages);
    } catch (error) {
      Alert.alert("Error", "Failed to load top rated movies.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadTopRatedMovies(currentPage + 1, true);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}` as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <View style={{ flex: 1 }}>
        <MovieList
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          onMoviePress={handleMoviePress}
          onEndReached={handleLoadMore}
          title="Top Rated Movies"
        />
      </View>
    </SafeAreaView>
  );
}
