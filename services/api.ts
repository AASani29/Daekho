// Movie API Service using The Movie Database (TMDB)
// You'll need to get a free API key from https://www.themoviedb.org/settings/api

import { config, isApiConfigured } from '../config';

const API_KEY = config.tmdb.apiKey;
const BASE_URL = config.tmdb.baseUrl;
const IMAGE_BASE_URL = config.tmdb.imageBaseUrl;

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface Genre {
  id: number;
  name: string;
}

class MovieAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
  }

  // Get full image URL
  getImageUrl(path: string): string {
    return `${IMAGE_BASE_URL}${path}`;
  }

  // Fetch popular movies
  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    if (!isApiConfigured()) {
      throw new Error('TMDB API key not configured. Please add your API key in config/index.ts');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  // Fetch top rated movies
  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    if (!isApiConfigured()) {
      throw new Error('TMDB API key not configured. Please add your API key in config/index.ts');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  // Fetch now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<MoviesResponse> {
    if (!isApiConfigured()) {
      throw new Error('TMDB API key not configured. Please add your API key in config/index.ts');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  // Fetch movie details
  async getMovieDetails(movieId: number): Promise<Movie> {
    if (!isApiConfigured()) {
      throw new Error('TMDB API key not configured. Please add your API key in config/index.ts');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    if (!isApiConfigured()) {
      throw new Error('TMDB API key not configured. Please add your API key in config/index.ts');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }

  // Get movie genres
  async getGenres(): Promise<Genre[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const movieAPI = new MovieAPI();