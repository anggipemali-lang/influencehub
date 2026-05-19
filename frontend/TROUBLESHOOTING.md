# Firebase Troubleshooting Guide

If you are experiencing issues with Authentication or Firestore, follow these steps:

## 1. unauthorized-domain Error
This happens when you run the app on a domain (like `localhost`) that isn't white-listed in Firebase.

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click on **Authentication** in the left menu.
4. Click the **Settings** tab.
5. Click **Authorized domains** in the submenu.
6. Click **Add domain** and enter `localhost`.
7. Also add your production URL (e.g., `ais-dev-....run.app`) if it's missing.

## 2. login-method-disabled Error
This happens when you haven't enabled Email or Google login in your project.

**Fix:**
1. Go to **Authentication** > **Sign-in method**.
2. Click **Add new provider**.
3. Enable **Email/Password** and/or **Google**.

## 3. Missing or Insufficient Permissions (Firestore)
This happens when your Security Rules block access.

**Fix:**
1. Go to **Firestore Database** > **Rules**.
2. For development, you can use:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   *Note: This allows any logged-in user to read/write everything. Tighten this for production.*

## 4. Setting up Environment Variables (VS Code)
When moving to VS Code:
1. Copy `.env.example` to a new file named `.env`.
2. Fill in the values from your Firebase Project Settings.
3. Restart your dev server (`npm run dev`).
