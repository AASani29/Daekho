# Daekho - Movie Recommendation App

A React Native movie discovery app built with Expo that provides personalized movie recommendations based on user preferences and viewing history.

## Overview

Daekho helps users discover movies through personalized recommendations. The app learns from user preferences and viewing history to suggest relevant movies while filtering out already-watched content for a better browsing experience.

## Features

- **Personalized Recommendations** - Movie suggestions based on selected genres and viewing history
- **User Authentication** - Secure sign-up and login with Firebase
- **Genre Selection** - Choose preferred genres during onboarding for tailored recommendations
- **Movie Tracking** - Like movies and mark them as watched
- **Profile Management** - View watched and liked movies history
- **Smart Filtering** - Watched movies are excluded from home recommendations
- **Movie Discovery** - Browse Now Playing and Top Rated movies
- **Search Functionality** - Find specific movies with search feature

## User Flow

### 1. Authentication
Users start with secure sign-up and login functionality.

![Sign Up Screenshot](screenshots/signup.png)
![Login Screenshot](screenshots/login.png)

### 2. Genre Selection
New users choose their favorite movie genres for personalized recommendations.

![Genre Selection Screenshot](screenshots/genre-selection.png)

### 3. Home Screen
Personalized movie recommendations based on selected genres, excluding already watched movies.

![Home Screen Screenshot](screenshots/home.png)

### 4. Movie Details
Detailed movie information with options to like and mark as watched.

![Movie Details Screenshot](screenshots/movie-details.png)

### 5. Profile
View watched movies, liked movies, and recently watched history.

![Profile Screenshot](screenshots/profile.png)

### 6. Discovery Pages

**Now Playing**
![Now Playing Screenshot](screenshots/now-playing.png)

**Top Rated**
![Top Rated Screenshot](screenshots/top-rated.png)

### 7. Search
Find movies using the search functionality.

![Search Screenshot](screenshots/search.png)

## Technologies Used

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation
- **@expo/vector-icons** - Icon library

### Backend & Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - Database for user data
- **TMDB API** - Movie data and information

### Development Tools
- **Expo CLI** - Development tooling
- **Metro Bundler** - JavaScript bundler
- **ESLint** - Code linting

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Expo Go app on mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/daekho.git
   cd daekho
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Scan the QR code with Expo Go app
   - Or run on simulator: `npx expo run:ios` or `npx expo run:android`

## How Recommendations Work

1. Users select preferred genres during initial setup
2. App fetches movies from TMDB API based on selected genres
3. Users can like movies and mark them as watched
4. Watched movies are excluded from home screen recommendations
5. Recommendations stay fresh and relevant based on user preferences

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.