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
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (loading && movies.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading movies...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {title && (
        <Text className="text-2xl font-bold text-gray-800 mb-4 px-4">
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
