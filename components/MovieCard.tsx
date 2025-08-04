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
      style={{
        width: cardWidth,
        marginBottom: 16,
        backgroundColor: "#1F2937",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: "100%",
          height: 240,
          backgroundColor: "#374151",
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#F9FAFB",
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {movie.overview}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#F59E0B", fontSize: 16 }}>★</Text>
            <Text
              style={{
                fontSize: 14,
                color: "#F59E0B",
                marginLeft: 4,
                fontWeight: "600",
              }}
            >
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
            }}
          >
            {new Date(movie.release_date).getFullYear()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
