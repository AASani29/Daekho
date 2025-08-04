import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Movie, movieAPI } from "../services/api";

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards per row with margins

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const imageUrl = movie.poster_path
    ? movieAPI.getImageUrl(movie.poster_path)
    : "https://via.placeholder.com/500x750/cccccc/666666?text=No+Image";

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 bg-white rounded-lg shadow-md overflow-hidden"
      style={{ width: cardWidth }}
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-64 bg-gray-200"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text
          className="text-lg font-bold text-gray-800 mb-1"
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
          {movie.overview}
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-yellow-500 text-lg">★</Text>
            <Text className="text-sm text-gray-700 ml-1">
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">
            {new Date(movie.release_date).getFullYear()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
