import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorBoundaryProps {
  error?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  title?: string;
  description?: string;
}

export const ErrorScreen: React.FC<ErrorBoundaryProps> = ({
  error = "Something went wrong",
  onRetry,
  onGoBack,
  title = "Oops!",
  description = "We encountered an error while loading the content.",
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111827" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#DC2626",
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="alert-circle-outline" size={40} color="#F9FAFB" />
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#F9FAFB",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              textAlign: "center",
              marginBottom: 16,
              fontSize: 16,
            }}
          >
            {description}
          </Text>

          {error && (
            <View
              style={{
                backgroundColor: "#1F2937",
                borderWidth: 1,
                borderColor: "#DC2626",
                borderRadius: 12,
                padding: 12,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  color: "#FCA5A5",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            </View>
          )}
        </View>

        <View style={{ width: "100%", gap: 12 }}>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={{
                backgroundColor: "#F59E0B",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="refresh-outline" size={20} color="#1F2937" />
              <Text
                style={{
                  color: "#1F2937",
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          )}

          {onGoBack && (
            <TouchableOpacity
              onPress={onGoBack}
              style={{
                backgroundColor: "#374151",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back-outline" size={20} color="#F9FAFB" />
              <Text
                style={{
                  color: "#F9FAFB",
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                Go Back
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* API Key Hint */}
        <View
          style={{
            marginTop: 32,
            backgroundColor: "#1F2937",
            borderWidth: 1,
            borderColor: "#F59E0B",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: "#F59E0B",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            💡 If you're seeing API errors, make sure you've configured your
            TMDB API key in config/index.ts
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
