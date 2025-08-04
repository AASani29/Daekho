import { UserProfile } from './userService';
import { Movie, movieAPI } from './api';

export interface RecommendationSection {
  title: string;
  movies: Movie[];
  type: 'recommended' | 'trending' | 'genre-based' | 'similar' | 'watched';
}

export class RecommendationService {
  // Get personalized recommendations for a user
  static async getPersonalizedRecommendations(userProfile: UserProfile): Promise<RecommendationSection[]> {
    const sections: RecommendationSection[] = [];

    try {
      // 1. Recommended for You (based on preferred genres and rating)
      const recommendedMovies = await this.getRecommendedMovies(userProfile);
      if (recommendedMovies.length > 0) {
        sections.push({
          title: 'Recommended for You',
          movies: recommendedMovies,
          type: 'recommended'
        });
      }

      // 2. Trending Movies
      const trendingMovies = await movieAPI.getTrendingMovies();
      sections.push({
        title: 'Trending Now',
        movies: trendingMovies.results.slice(0, 10),
        type: 'trending'
      });

      // 3. Based on Your Favorite Genres
      if (userProfile.preferredGenres.length > 0) {
        const genreBasedMovies = await this.getGenreBasedRecommendations(userProfile.preferredGenres, userProfile.preferredRating);
        if (genreBasedMovies.length > 0) {
          sections.push({
            title: 'More Like Your Favorites',
            movies: genreBasedMovies,
            type: 'genre-based'
          });
        }
      }

      // 4. Popular Movies (filtered by user preferences)
      const popularMovies = await movieAPI.getPopularMovies();
      const filteredPopular = this.filterMoviesByPreferences(popularMovies.results, userProfile);
      if (filteredPopular.length > 0) {
        sections.push({
          title: 'Popular Movies You Might Like',
          movies: filteredPopular.slice(0, 10),
          type: 'recommended'
        });
      }

      // 5. Top Rated Movies (if user likes high-rated content)
      if (userProfile.preferredRating >= 7.0) {
        const topRatedMovies = await movieAPI.getTopRatedMovies();
        sections.push({
          title: 'Top Rated Movies',
          movies: topRatedMovies.results.slice(0, 10),
          type: 'recommended'
        });
      }

      return sections;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      // Return basic trending movies as fallback
      try {
        const trendingMovies = await movieAPI.getTrendingMovies();
        return [{
          title: 'Trending Movies',
          movies: trendingMovies.results.slice(0, 10),
          type: 'trending'
        }];
      } catch (fallbackError) {
        console.error('Error getting fallback recommendations:', fallbackError);
        return [];
      }
    }
  }

  // Get movies based on user's preferred genres and rating
  private static async getRecommendedMovies(userProfile: UserProfile): Promise<Movie[]> {
    const recommendations: Movie[] = [];
    
    try {
      // If user has preferred genres, get movies from those genres
      if (userProfile.preferredGenres.length > 0) {
        for (const genreId of userProfile.preferredGenres.slice(0, 3)) { // Limit to top 3 genres
          const genreMovies = await movieAPI.getMoviesByGenre(genreId);
          const filteredMovies = genreMovies.results
            .filter((movie: Movie) => 
              movie.vote_average >= userProfile.preferredRating &&
              !userProfile.watchedMovies.includes(movie.id)
            )
            .slice(0, 5);
          
          recommendations.push(...filteredMovies);
        }
      }

      // Remove duplicates and shuffle
      const uniqueRecommendations = recommendations.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      return this.shuffleArray(uniqueRecommendations).slice(0, 15);
    } catch (error) {
      console.error('Error getting recommended movies:', error);
      return [];
    }
  }

  // Get movies based on specific genres
  private static async getGenreBasedRecommendations(genreIds: number[], minRating: number): Promise<Movie[]> {
    const movies: Movie[] = [];
    
    try {
      // Get movies from each preferred genre
      for (const genreId of genreIds.slice(0, 2)) { // Limit to top 2 genres
        const genreMovies = await movieAPI.getMoviesByGenre(genreId);
        const filteredMovies = genreMovies.results
          .filter((movie: Movie) => movie.vote_average >= minRating)
          .slice(0, 8);
        
        movies.push(...filteredMovies);
      }

      // Remove duplicates
      const uniqueMovies = movies.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      return uniqueMovies.slice(0, 12);
    } catch (error) {
      console.error('Error getting genre-based recommendations:', error);
      return [];
    }
  }

  // Filter movies based on user preferences
  private static filterMoviesByPreferences(movies: Movie[], userProfile: UserProfile): Movie[] {
    return movies.filter(movie => {
      // Filter out already watched movies
      if (userProfile.watchedMovies.includes(movie.id)) {
        return false;
      }

      // Filter by minimum rating preference
      if (movie.vote_average < userProfile.preferredRating) {
        return false;
      }

      // If user has preferred genres, prioritize movies with those genres
      if (userProfile.preferredGenres.length > 0) {
        const hasPreferredGenre = movie.genre_ids.some(genreId => 
          userProfile.preferredGenres.includes(genreId)
        );
        return hasPreferredGenre;
      }

      return true;
    });
  }

  // Get similar movies based on a specific movie
  static async getSimilarMovies(movieId: number, userProfile?: UserProfile): Promise<Movie[]> {
    try {
      const similarMovies = await movieAPI.getSimilarMovies(movieId);
      
      if (userProfile) {
        return this.filterMoviesByPreferences(similarMovies.results, userProfile).slice(0, 10);
      }
      
      return similarMovies.results.slice(0, 10);
    } catch (error) {
      console.error('Error getting similar movies:', error);
      return [];
    }
  }

  // Utility function to shuffle array
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get movies for genre selection (popular movies from each genre)
  static async getGenreSelectionMovies(genreIds: number[]): Promise<{[key: number]: Movie[]}> {
    const genreMovies: {[key: number]: Movie[]} = {};
    
    try {
      for (const genreId of genreIds) {
        const movies = await movieAPI.getMoviesByGenre(genreId);
        genreMovies[genreId] = movies.results.slice(0, 6); // Get top 6 movies per genre
      }
      
      return genreMovies;
    } catch (error) {
      console.error('Error getting genre selection movies:', error);
      return {};
    }
  }
}
