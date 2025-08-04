import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SetupScreen() {
  const handleOpenTMDB = async () => {
    try {
      await Linking.openURL("https://www.themoviedb.org/settings/api");
    } catch (error) {
      Alert.alert("Error", "Could not open the TMDB website");
    }
  };

  const handleOpenConfig = () => {
    Alert.alert(
      "Configuration Required",
      "Please follow these steps:\n\n" +
        "1. Get your API key from TMDB\n" +
        "2. Open config/index.ts in your code editor\n" +
        "3. Replace YOUR_TMDB_API_KEY with your actual key\n" +
        "4. Save the file and restart the app",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6">
        <View className="py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="film-outline" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Daekho
            </Text>
            <Text className="text-gray-600 text-center">
              Your movie discovery app needs a quick setup
            </Text>
          </View>

          {/* Setup Steps */}
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Quick Setup Required
            </Text>

            <View className="mb-6">
              <View className="flex-row items-start mb-4">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-sm">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium mb-1">
                    Get Free TMDB API Key
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Create a free account at TMDB and get your API key
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleOpenTMDB}
                className="bg-blue-500 py-3 px-4 rounded-lg flex-row items-center justify-center ml-11"
              >
                <Ionicons name="open-outline" size={20} color="white" />
                <Text className="text-white font-medium ml-2">
                  Open TMDB API Page
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <View className="flex-row items-start mb-4">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-sm">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium mb-1">
                    Configure Your App
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Add your API key to the app configuration
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleOpenConfig}
                className="bg-green-500 py-3 px-4 rounded-lg flex-row items-center justify-center ml-11"
              >
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text className="text-white font-medium ml-2">
                  Configuration Guide
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View className="flex-row items-start mb-4">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-sm">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium mb-1">
                    Restart & Enjoy
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Restart the app to start discovering movies
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#d97706"
              />
              <View className="flex-1 ml-2">
                <Text className="text-amber-800 font-medium text-sm mb-1">
                  Configuration Steps
                </Text>
                <Text className="text-amber-700 text-xs leading-4">
                  • Open config/index.ts in your code editor{"\n"}• Find:
                  apiKey: 'YOUR_TMDB_API_KEY'{"\n"}• Replace with: apiKey:
                  'your-actual-api-key'{"\n"}• Save and restart the app
                </Text>
              </View>
            </View>
          </View>

          {/* Features Preview */}
          <View className="bg-white rounded-lg p-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              What You'll Get
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="flame-outline" size={20} color="#3b82f6" />
                <Text className="text-gray-700 ml-3">Popular Movies</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="star-outline" size={20} color="#3b82f6" />
                <Text className="text-gray-700 ml-3">Top Rated Films</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name="play-circle-outline"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="text-gray-700 ml-3">Now Playing</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="search-outline" size={20} color="#3b82f6" />
                <Text className="text-gray-700 ml-3">Movie Search</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="text-gray-700 ml-3">Detailed Movie Info</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
