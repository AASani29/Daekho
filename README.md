# Daekho - Movie Discovery App

A React Native movie discovery app built with Expo, featuring popular movies, top-rated films, and now playing movies from The Movie Database (TMDB).

## Features

- **Popular Movies**: Browse trending and popular movies
- **Top Rated**: Discover critically acclaimed films
- **Now Playing**: See what's currently in theaters
- **Movie Details**: View detailed information about each movie
- **Search**: Find specific movies by title
- **Responsive Design**: Optimized for mobile devices with NativeWind/Tailwind CSS

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

### 3. Configure API Key

Open `services/api.ts` and replace `YOUR_TMDB_API_KEY` with your actual API key:

```typescript
const API_KEY = "your_actual_api_key_here";
```

### 4. Run the App

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

## Project Structure

```
Daekho/
├── app/
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Popular movies
│   │   ├── toprated.tsx  # Top rated movies
│   │   └── nowplaying.tsx # Now playing movies
│   ├── movie/
│   │   └── [id].tsx      # Movie details screen
│   ├── _layout.tsx       # Root layout
│   └── global.css        # Global styles
├── components/
│   ├── MovieCard.tsx     # Individual movie card
│   ├── MovieList.tsx     # Movie list component
│   └── SearchBar.tsx     # Search functionality
├── services/
│   └── api.ts           # TMDB API service
└── assets/              # Images and fonts
```

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **TypeScript** - Type safety
- **TMDB API** - Movie data source

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
