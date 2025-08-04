import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { Movie } from './api';

export interface UserProfile {
  id: string;
  email: string;
  preferredGenres: number[];
  watchedMovies: number[];
  likedMovies: number[];
  favoriteActors: string[];
  preferredRating: number; // minimum rating preference
  createdAt: Date;
  lastUpdated: Date;
}

export interface WatchedMovie {
  movieId: number;
  watchedAt: Date;
  rating?: number;
  review?: string;
}

export class UserService {
  private static USERS_COLLECTION = 'users';
  private static WATCHED_MOVIES_COLLECTION = 'watchedMovies';

  // Create or update user profile
  static async createUserProfile(userId: string, email: string, data: Partial<UserProfile> = {}): Promise<void> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      const userData: UserProfile = {
        id: userId,
        email,
        preferredGenres: data.preferredGenres || [],
        watchedMovies: data.watchedMovies || [],
        likedMovies: data.likedMovies || [],
        favoriteActors: data.favoriteActors || [],
        preferredRating: data.preferredRating || 6.0,
        createdAt: new Date(),
        lastUpdated: new Date(),
        ...data,
      };
      
      await setDoc(userRef, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update preferred genres
  static async updatePreferredGenres(userId: string, genres: number[]): Promise<void> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        preferredGenres: genres,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error updating preferred genres:', error);
      throw error;
    }
  }

  // Add watched movie
  static async addWatchedMovie(userId: string, movieId: number, rating?: number): Promise<void> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        watchedMovies: arrayUnion(movieId),
        lastUpdated: new Date(),
      });

      // Also store detailed watch data
      const watchedMovieRef = doc(firestore, this.WATCHED_MOVIES_COLLECTION, `${userId}_${movieId}`);
      const watchedMovie: WatchedMovie = {
        movieId,
        watchedAt: new Date(),
        rating,
      };
      
      await setDoc(watchedMovieRef, watchedMovie);
    } catch (error) {
      console.error('Error adding watched movie:', error);
      throw error;
    }
  }

  // Add liked movie
  static async addLikedMovie(userId: string, movieId: number): Promise<void> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        likedMovies: arrayUnion(movieId),
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error adding liked movie:', error);
      throw error;
    }
  }

  // Get watched movies details
  static async getWatchedMoviesDetails(userId: string): Promise<WatchedMovie[]> {
    try {
      const watchedMoviesQuery = query(
        collection(firestore, this.WATCHED_MOVIES_COLLECTION),
        where('__name__', '>=', `${userId}_`),
        where('__name__', '<', `${userId}_\uf8ff`)
      );
      
      const snapshot = await getDocs(watchedMoviesQuery);
      return snapshot.docs.map(doc => doc.data() as WatchedMovie);
    } catch (error) {
      console.error('Error getting watched movies details:', error);
      throw error;
    }
  }

  // Update user preference rating
  static async updatePreferredRating(userId: string, rating: number): Promise<void> {
    try {
      const userRef = doc(firestore, this.USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        preferredRating: rating,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error updating preferred rating:', error);
      throw error;
    }
  }
}
