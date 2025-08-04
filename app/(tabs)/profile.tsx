import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { UserService, UserProfile } from '../../services/userService';
import { Movie, movieAPI, Genre } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load user profile
      const profile = await UserService.getUserProfile(user.uid);
      setUserProfile(profile);

      // Load genres
      const genreData = await movieAPI.getGenres();
      setGenres(genreData);

      // Load watched movies details
      if (profile && profile.watchedMovies.length > 0) {
        const moviePromises = profile.watchedMovies.slice(0, 10).map(movieId =>
          movieAPI.getMovieDetails(movieId)
        );
        const movies = await Promise.allSettled(moviePromises);
        const validMovies = movies
          .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
          .map(result => result.value);
        setWatchedMovies(validMovies);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-lg text-gray-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userProfile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 text-center mb-4">
            Profile not found. Please complete the setup.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/onboarding/genre-selection')}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Complete Setup</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 shadow-sm">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Profile
              </Text>
              <Text className="text-gray-600 mb-4">
                {user?.email}
              </Text>
              <View className="flex-row space-x-4">
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">
                    {userProfile.watchedMovies.length}
                  </Text>
                  <Text className="text-sm text-gray-600">Watched</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">
                    {userProfile.likedMovies.length}
                  </Text>
                  <Text className="text-sm text-gray-600">Liked</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-blue-600">
                    {userProfile.preferredGenres.length}
                  </Text>
                  <Text className="text-sm text-gray-600">Genres</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-100 px-4 py-2 rounded-lg"
            >
              <Text className="text-red-600 font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Your Preferences
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Favorite Genres</Text>
            <Text className="text-gray-600">
              {getGenreNames(userProfile.preferredGenres) || 'No genres selected'}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Minimum Rating</Text>
            <Text className="text-gray-600">
              ⭐ {userProfile.preferredRating.toFixed(1)} and above
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/onboarding/genre-selection')}
            className="bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">
              Update Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recently Watched */}
        {watchedMovies.length > 0 && (
          <View className="mx-4 mt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-gray-800">
                Recently Watched
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 font-medium">See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {watchedMovies.map((movie) => (
                  <View key={movie.id} className="mr-3 w-32">
                    <TouchableOpacity
                      onPress={() => router.push(`/movie/${movie.id}`)}
                    >
                      <Image
                        source={{ uri: movieAPI.getImageUrl(movie.poster_path) }}
                        className="w-full h-48 rounded-lg bg-gray-300"
                        resizeMode="cover"
                      />
                      <Text className="mt-2 text-sm font-medium text-gray-800" numberOfLines={2}>
                        {movie.title}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Account Actions */}
        <View className="mx-4 mt-4 mb-8">
          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm mb-3">
            <Text className="text-gray-800 font-medium">Watch History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm mb-3">
            <Text className="text-gray-800 font-medium">Liked Movies</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-gray-800 font-medium">Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
