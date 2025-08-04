import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { movieAPI, Genre } from '../../services/api';
import { UserService } from '../../services/userService';

export default function GenreSelectionScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const genreData = await movieAPI.getGenres();
      setGenres(genreData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedGenres.length === 0) {
      Alert.alert('Please select at least one genre');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setSaving(true);
    try {
      // Check if user profile exists, if not create it
      let userProfile = await UserService.getUserProfile(user.uid);
      
      if (!userProfile) {
        await UserService.createUserProfile(user.uid, user.email || '', {
          preferredGenres: selectedGenres,
        });
      } else {
        await UserService.updatePreferredGenres(user.uid, selectedGenres);
      }

      // Navigate to movie selection
      router.push('/(tabs)'); // For now, go directly to main app
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-lg text-gray-600">Loading genres...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 pt-12">
        <Text className="text-3xl font-bold text-center mb-4 text-gray-800">
          Choose Your Favorite Genres
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Select the movie genres you enjoy most. This helps us recommend movies you'll love.
        </Text>

        <View className="flex-row flex-wrap justify-center">
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              onPress={() => toggleGenre(genre.id)}
              className={`m-2 px-4 py-2 rounded-full border-2 ${
                selectedGenres.includes(genre.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedGenres.includes(genre.id)
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="px-6 pb-6 bg-white">
        <Text className="text-center text-gray-600 mb-4">
          Selected: {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={saving || selectedGenres.length === 0}
          className={`rounded-lg py-3 ${
            saving || selectedGenres.length === 0
              ? 'bg-gray-400'
              : 'bg-blue-600'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {saving ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
