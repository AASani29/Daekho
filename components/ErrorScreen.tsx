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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={40} color="#dc2626" />
          </View>

          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {title}
          </Text>

          <Text className="text-gray-600 text-center mb-4">{description}</Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <Text className="text-red-700 text-sm text-center">{error}</Text>
            </View>
          )}
        </View>

        <View className="w-full space-y-3">
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Try Again</Text>
            </TouchableOpacity>
          )}

          {onGoBack && (
            <TouchableOpacity
              onPress={onGoBack}
              className="bg-gray-200 py-3 px-6 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons name="arrow-back-outline" size={20} color="#374151" />
              <Text className="text-gray-700 font-medium ml-2">Go Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* API Key Hint */}
        <View className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <Text className="text-amber-800 text-sm text-center">
            💡 If you're seeing API errors, make sure you've configured your
            TMDB API key in config/index.ts
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
