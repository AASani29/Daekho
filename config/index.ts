// Configuration file for the Daekho app
// This file helps manage app settings and configurations

export const config = {
  // TMDB API Configuration
  tmdb: {
    // Get your free API key from: https://www.themoviedb.org/settings/api
    apiKey: 'f03c1dc8d601c279c2b739ac021684c4', // Replace with your actual API key
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500',
  },
  
  // App Configuration
  app: {
    name: 'Daekho',
    version: '1.0.0',
    description: 'Discover amazing movies',
  },
  
  // UI Configuration
  ui: {
    // Number of movies per row in grid view
    moviesPerRow: 2,
    
    // Default placeholder image for movies without posters
    placeholderImage: 'https://via.placeholder.com/500x750/cccccc/666666?text=No+Image',
    
    // Loading states
    loadingTimeout: 10000, // 10 seconds
  },
  
  // Feature flags
  features: {
    search: true,
    favorites: false, // TODO: Implement favorites
    offline: false,   // TODO: Implement offline mode
    notifications: false, // TODO: Implement push notifications
  }
};

// Helper function to check if API key is configured
export const isApiConfigured = (): boolean => {
  return config.tmdb.apiKey !== 'YOUR_TMDB_API_KEY' && config.tmdb.apiKey.length > 0;
};

// Helper function to get environment-specific configuration
export const getEnvironmentConfig = () => {
  const isDev = __DEV__;
  
  return {
    ...config,
    debug: isDev,
    logLevel: isDev ? 'debug' : 'error',
  };
};
