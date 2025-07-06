# Afraz Blog Admin - Video Upload System

A simple, modern admin panel for uploading guitar cover videos to your blog. Built with HTML, CSS, JavaScript, and Firebase.

## Features

- 🎸 **Video Upload**: Upload MP4, MOV, AVI files
- 🖼️ **Thumbnail Support**: Optional custom thumbnails
- 📝 **Rich Metadata**: Title, description, genre, date labels
- 📊 **Upload Progress**: Real-time progress tracking
- 👀 **Preview Mode**: Preview before uploading
- 📱 **Responsive Design**: Works on all devices
- 🗑️ **Delete Videos**: Remove uploaded videos
- 📋 **Recent Uploads**: View and manage recent videos

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable **Firestore Database** and **Storage**

### 2. Configure Firebase

1. In your Firebase project, go to **Project Settings** > **General**
2. Scroll down to "Your apps" and click the web icon (</>)
3. Register your app with a nickname (e.g., "afraz-admin")
4. Copy the Firebase config object

### 3. Update Configuration

1. Open `firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 4. Set Up Firebase Security Rules

#### Firestore Rules (Database > Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{document} {
      allow read, write: if true; // For now, allow all access
    }
  }
}
```

#### Storage Rules (Storage > Rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{allPaths=**} {
      allow read, write: if true; // For now, allow all access
    }
    match /thumbnails/{allPaths=**} {
      allow read, write: if true; // For now, allow all access
    }
  }
}
```

### 5. Deploy Admin Website

You can deploy this admin website to any static hosting service:

#### Option A: Netlify (Recommended)
1. Create a GitHub repository and push these files
2. Connect to Netlify
3. Deploy automatically

#### Option B: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the admin folder

#### Option C: GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings

#### Option D: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Deploy with `firebase deploy`

## Usage

### Uploading Videos

1. Fill in the video title and description
2. Select a genre from the dropdown
3. Choose a date label (Latest, This Week, etc.)
4. Select your video file (MP4, MOV, AVI)
5. Optionally add a thumbnail image
6. Click "Upload Video" or "Preview" first

### Managing Videos

- View recent uploads at the bottom of the page
- Delete videos by clicking the "Delete" button
- All videos are automatically sorted by upload date

## File Structure

```
admin/
├── index.html          # Main admin page
├── styles.css          # Styling
├── app.js             # Main JavaScript logic
├── firebase-config.js # Firebase configuration
└── README.md          # This file
```

## Security Considerations

⚠️ **Important**: The current setup allows public read/write access. For production use:

1. **Add Authentication**: Implement Firebase Auth
2. **Restrict Access**: Only allow your account to upload
3. **Rate Limiting**: Add upload limits
4. **File Validation**: Validate file types and sizes

## Integration with Main Portfolio

To display uploaded videos on your main React portfolio:

1. Install Firebase in your React project:
   ```bash
   npm install firebase
   ```

2. Create a Firebase config file in your React project
3. Fetch videos from Firestore in your Blog component
4. Display videos using the stored URLs

## Customization

### Styling
- Modify `styles.css` to match your brand colors
- Update the gradient in the body background
- Change button colors and hover effects

### Functionality
- Add more video metadata fields in `app.js`
- Implement video categories or tags
- Add search and filtering capabilities

## Troubleshooting

### Common Issues

1. **"Firebase not initialized"**
   - Check your Firebase config in `firebase-config.js`
   - Ensure all required Firebase services are enabled

2. **"Permission denied"**
   - Check your Firestore and Storage security rules
   - Ensure rules allow read/write operations

3. **"Upload failed"**
   - Check file size (Firebase has limits)
   - Ensure file type is supported
   - Check browser console for detailed errors

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Test with smaller files first
4. Ensure all Firebase services are properly enabled

## Future Enhancements

- User authentication and admin login
- Video editing capabilities
- Bulk upload functionality
- Video analytics and views tracking
- Social media integration
- Video processing and optimization 