# Daekho - AI-Powered Movie Recommendation App

A React Native movie recommendation app built with Expo, featuring personalized movie suggestions, user authentication, and cloud-based user preferences using Firebase and The Movie Database (TMDB).

## Features

### 🎬 Movie Discovery
- **Personalized Recommendations**: AI-powered suggestions based on your preferences
- **Popular Movies**: Browse trending and popular movies
- **Top Rated**: Discover critically acclaimed films
- **Now Playing**: See what's currently in theaters
- **Movie Details**: View detailed information about each movie
- **Search**: Find specific movies by title

### 🔐 User Authentication
- **Email/Password Authentication**: Secure login and registration
- **User Profiles**: Personalized user accounts
- **Preference Management**: Set and update your movie preferences

### 🎯 Personalization
- **Genre Selection**: Choose your favorite movie genres during onboarding
- **Watched Movies**: Mark movies you've already seen
- **Liked Movies**: Save movies to your favorites
- **Rating Preferences**: Set minimum rating thresholds
- **Smart Recommendations**: Multiple recommendation sections based on your taste

### 📱 User Experience
- **Responsive Design**: Optimized for mobile devices with NativeWind/Tailwind CSS
- **Onboarding Flow**: Guided setup for new users
- **Profile Management**: View and edit your preferences
- **Watch History**: Track your movie watching history

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Get TMDB API Key

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (it's free!)
5. Copy your API key

### 3. Configure TMDB API Key

Open `config/index.ts` and add your TMDB API key:

```typescript
export const config = {
  tmdb: {
    apiKey: "your_actual_tmdb_api_key_here",
    baseUrl: "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p/w500",
  },
};
```

### 4. Set Up Firebase

Follow the detailed Firebase setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
- Create a Firebase project
- Enable Authentication (Email/Password)
- Set up Firestore database
- Configure your Firebase credentials

### 5. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## App Flow

### 1. Initial Launch
- Check if TMDB API is configured
- Check user authentication status
- Redirect accordingly

### 2. Authentication Flow
- Login/Register with email and password
- Firebase handles authentication securely

### 3. Onboarding (First-time users)
- **Genre Selection**: Choose favorite movie genres
- **Movie Selection**: Mark movies you've already watched
- Create user profile in Firestore

### 4. Main App Experience
- **Home Tab**: Personalized recommendations
- **Top Rated Tab**: Critically acclaimed movies
- **Now Playing Tab**: Currently in theaters
- **Profile Tab**: User preferences and watch history

### 5. Movie Interaction
- View detailed movie information
- Mark movies as watched
- Like/favorite movies
- Get similar movie recommendations

## Project Structure

```
Daekho/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Personalized home screen
│   │   ├── toprated.tsx     # Top rated movies
│   │   ├── nowplaying.tsx   # Now playing movies
│   │   └── profile.tsx      # User profile screen
│   ├── auth/
│   │   └── login.tsx        # Authentication screen
│   ├── onboarding/
│   │   ├── genre-selection.tsx    # Genre selection
│   │   └── movie-selection.tsx    # Movie selection
│   ├── movie/
│   │   └── [id].tsx         # Movie details screen
│   ├── _layout.tsx          # Root layout with auth provider
│   └── global.css           # Global styles
├── components/
│   ├── MovieCard.tsx        # Individual movie card
│   ├── MovieList.tsx        # Movie list component
│   ├── SearchBar.tsx        # Search functionality
│   └── ErrorScreen.tsx      # Error handling component
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── services/
│   ├── api.ts              # TMDB API service
│   ├── userService.ts      # User data management
│   └── recommendationService.ts # Recommendation algorithms
├── config/
│   ├── index.ts            # App configuration
│   └── firebase.ts         # Firebase configuration
└── assets/                 # Images and fonts
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **Expo Router** - File-based routing
- **Firebase** - Authentication and database
  - **Firebase Auth** - User authentication
  - **Firestore** - NoSQL document database
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type safety
- **TMDB API** - Movie data source

## Architecture

### Authentication Layer
- Firebase Authentication for secure user management
- Context-based auth state management
- Protected routes and screens

### Data Layer
- **TMDB API**: Movie data, search, and metadata
- **Firestore**: User profiles, preferences, and watch history
- **Local State**: React hooks for component state

### Recommendation Engine
- Genre-based filtering
- User preference matching
- Watch history analysis
- Rating-based recommendations
- Multiple recommendation sections

### UI/UX Layer
- NativeWind for responsive design
- Component-based architecture
- Consistent design system
- Loading states and error handling

## API Endpoints Used

- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/movie/now_playing` - Now playing movies
- `/movie/{id}` - Movie details
- `/search/movie` - Search movies
- `/genre/movie/list` - Movie genres

## Features to Add Next

- [ ] Favorite movies (local storage)
- [ ] Movie trailers
- [ ] Actor information
- [ ] Movie reviews
- [ ] Offline caching
- [ ] Push notifications
- [ ] User ratings
- [ ] Social sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.
