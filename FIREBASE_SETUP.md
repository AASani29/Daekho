# Firebase Setup for Daekho Movie Recommendation App

## Prerequisites

1. A Google account
2. Node.js installed on your machine
3. The Firebase CLI (optional but recommended)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "daekho-movie-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, navigate to "Authentication" in the left sidebar
2. Click on the "Sign-in method" tab
3. Enable "Email/Password" as a sign-in provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create Firestore Database

1. In your Firebase project console, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location for your database (choose the one closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click on the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Daekho Web App")
6. Copy the Firebase configuration object

## Step 5: Update Your App Configuration

1. Open the file `config/firebase.ts` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## Step 6: Set Up Firestore Security Rules (Optional but Recommended)

1. Go to "Firestore Database" in your Firebase console
2. Click on the "Rules" tab
3. Replace the default rules with these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own watched movies
    match /watchedMovies/{document} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

4. Click "Publish"

## Step 7: Test Your Setup

1. Make sure your TMDB API key is configured in `config/index.ts`
2. Run your app: `npm start`
3. Try creating a new account and logging in
4. Complete the onboarding flow (genre selection and movie selection)
5. Check that your user data appears in the Firestore console

## Firestore Database Structure

Your app will create the following collections:

### `/users/{userId}`

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "preferredGenres": [28, 12, 16],
  "watchedMovies": [550, 680, 155],
  "likedMovies": [550, 680],
  "favoriteActors": [],
  "preferredRating": 6.0,
  "createdAt": "timestamp",
  "lastUpdated": "timestamp"
}
```

### `/watchedMovies/{userId}_{movieId}`

```json
{
  "movieId": 550,
  "watchedAt": "timestamp",
  "rating": 8
}
```

## Troubleshooting

1. **"Permission denied" errors**: Check your Firestore security rules
2. **"Firebase config not found"**: Make sure you've updated the config file with your actual Firebase credentials
3. **Authentication not working**: Verify that Email/Password is enabled in Firebase Authentication
4. **App crashes on startup**: Check that all Firebase packages are properly installed

## Security Considerations

- Never commit your actual Firebase configuration to public repositories
- Consider using environment variables for sensitive configuration in production
- Review and update Firestore security rules based on your app's needs
- Enable App Check for additional security in production

## Next Steps

Once your Firebase setup is complete, you can:

1. Enhance the recommendation algorithm
2. Add more user preferences
3. Implement push notifications
4. Add social features
5. Set up analytics to track user behavior
