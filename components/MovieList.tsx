import React from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Movie } from "../services/api";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  loading?: boolean;
  onMoviePress?: (movie: Movie) => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  title?: string;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading = false,
  onMoviePress,
  onEndReached,
  loadingMore = false,
  title,
}) => {
  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={() => onMoviePress?.(item)} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" color="#F59E0B" />
      </View>
    );
  };

  if (loading && movies.length === 0) {
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
        <Text style={{ marginTop: 8, color: "#9CA3AF" }}>
          Loading movies...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      {title && (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#F9FAFB",
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          {title}
        </Text>
      )}
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          padding: 16,
          paddingTop: title ? 0 : 16,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
