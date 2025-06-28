# 📱 TaskManagementApp – React Native Firebase App

A clean and functional **React Native** task manager built using **React Native CLI**, with **Firebase Authentication**, **Cloud Firestore**, and **AsyncStorage** to persist login sessions.

---

## ✨ Features

- 🔐 **Login & Signup** with Firebase Authentication
- 🎉 **Welcome Screen** on fresh launch
- 📅 Create, Edit, Delete Tasks
- 🚦 Prioritize tasks with `low`, `medium`, or `high` levels
- ✅ Mark tasks as complete/incomplete
- 🔍 Search tasks by title
- 🔃 Swipe to delete tasks
- ☁️ Store tasks in Firestore per user
- 💾 Login persistence using AsyncStorage
- 🎨 Styled with custom `fontSize` and `moderateScale` utilities

---

## 🖼️ Screens Included

- **Welcome.js** – Initial welcome screen
- **Login.js** – Firebase sign-in
- **Signup.js** – Firebase registration
- **Main.js** – Task dashboard

---

## 🚀 Getting Started

> Make sure your environment is set up:  
> 📘 https://reactnative.dev/docs/environment-setup

### 1️⃣ Clone & Install

```sh
git clone <your-repo-url>
cd TaskManagementApp
npm install
# or
yarn
2️⃣ Firebase Setup
No firebaseConfig.js is used.
Firebase is integrated using:

@react-native-firebase/app

@react-native-firebase/auth

@react-native-firebase/firestore

✅ Make sure:

google-services.json is placed in android/app/

GoogleService-Info.plist is added in ios/

🔧 Follow official setup: https://rnfirebase.io/

📲 Run the App
Start Metro Bundler
sh
Copy
Edit
npm start
# or
yarn start
Run on Android
sh
Copy
Edit
npm run android
# or
yarn android
Run on iOS
sh
Copy
Edit
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
# or
yarn ios
🗂️ Folder Structure
css
Copy
Edit
TaskManagementApp/
├── App.tsx
├── screens/
│   ├── Welcome.js
│   ├── Login.js
│   ├── Signup.js
│   └── Main.js
├── utils/
│   └── metrix.js
├── ...
🧪 Usage Tips
➕ Press + FAB to add new task

✏️ Tap edit icon to modify

🗑️ Swipe left to delete

✅ Tap task to mark complete

🔍 Use search to filter

🔌 Dependencies
txt
Copy
Edit
@react-native-firebase/app
@react-native-firebase/auth
@react-native-firebase/firestore
@react-native-async-storage/async-storage
react-native-vector-icons
react-native-gesture-handler
🧹 Troubleshooting
sh
Copy
Edit
# Reset Metro
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean
📚 Learn More
React Native

Firebase Auth

Firestore

React Native Firebase

AsyncStorage

🧑‍💻 Built by Faijan
📦 Project: TaskManagementApp