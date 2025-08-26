# Daekho - Movie Recommendation App

A React Native movie discovery app built with Expo that solves the problem of endlessly searching for what to watch next by providing truly personalized movie recommendations.

## The Problem We Solve

**Tired of spending more time searching for movies than actually watching them?**

With thousands of movies available across platforms, finding something you'll actually enjoy has become overwhelming. Users often face:
- Endless scrolling through generic movie lists
- Watching the same movies repeatedly because they can't find new ones
- Wasting time on movies that don't match their taste
- Difficulty discovering hidden gems in their preferred genres

## Our Solution

Daekho eliminates the decision fatigue by creating a **personalized movie discovery experience**:

- **Smart Genre-Based Filtering** - Get recommendations only from genres you actually enjoy
- **Intelligent Exclusion System** - Never see movies you've already watched in your recommendations
- **Preference Learning** - The more you interact, the better your recommendations become
- **Curated Discovery** - Fresh, relevant suggestions every time you open the app

**Result**: Spend less time searching and more time enjoying movies you'll love.

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

<div align="center">
  <img src="screenshots/signup.jpg" alt="Sign Up Screenshot" width="300" style="margin-right: 20px;">
  <img src="screenshots/login.jpg" alt="Login Screenshot" width="300">
</div>

### 2. Genre Selection
New users choose their favorite movie genres for personalized recommendations.

<div align="center">
  <img src="screenshots/genre-selection1.jpg" alt="Genre Selection Step 1" width="300" style="margin-right: 20px;">
  <img src="screenshots/genre-selection.jpg" alt="Genre Selection Step 2" width="300">
</div>

### 3. Home Screen - Personalized Recommendations
Your personalized movie feed that solves the "what to watch next" problem.

<div align="center">
  <img src="screenshots/home.jpg" alt="Home Screen Screenshot" width="350">
</div>

**Key Benefits:**
- **Zero Decision Fatigue** - Only see movies you're likely to enjoy based on your selected genres
- **No Repeats** - Watched movies are automatically filtered out, ensuring fresh content every time
- **Instant Relevance** - Every movie shown matches your taste preferences
- **Continuous Discovery** - Always find something new without endless searching

### 4. Movie Details
Detailed movie information with options to like and mark as watched.

<div align="center">
  <img src="screenshots/movie-details.jpg" alt="Movie Details Screenshot" width="350">
</div>

### 5. Profile
View watched movies, liked movies, and recently watched history.

<div align="center">
  <img src="screenshots/profile.jpg" alt="Profile Screenshot" width="350">
</div>

### 6. Discovery Pages

**Now Playing**
<div align="center">
  <img src="screenshots/now-playing.jpg" alt="Now Playing Screenshot" width="350">
</div>

**Top Rated**
<div align="center">
  <img src="screenshots/top-rated.jpg" alt="Top Rated Screenshot" width="350">
</div>

### 7. Search
Find movies using the search functionality.

<div align="center">
  <img src="screenshots/search.jpg" alt="Search Screenshot" width="350">
</div>

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

## How Our Smart Recommendation System Works

**The Traditional Problem**: Generic movie lists show everything to everyone, leading to decision paralysis and wasted time.

**Daekho's Approach**:

1. **Initial Preference Capture** - Users select their favorite genres during onboarding
2. **Smart API Integration** - Fetch movies from TMDB API filtered by user's preferred genres only
3. **Behavioral Learning** - Track user interactions (likes, watches) to understand taste patterns  
4. **Intelligent Filtering** - Automatically exclude watched movies from future recommendations
5. **Continuous Refinement** - Recommendations improve as users engage more with the app

**The Result**: A personalized movie discovery experience where users spend seconds, not minutes, finding their next great movie.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.