// Firebase Configuration
// Replace these values with your actual Firebase project configuration
export const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Firestore security rules (for reference)
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{document} {
      allow read: if true;
      allow write: if request.resource.data.keys().hasAll(['name', 'email', 'distance', 'timestamp']) &&
                   request.resource.data.name is string &&
                   request.resource.data.name.size() > 0 &&
                   request.resource.data.name.size() <= 50 &&
                   request.resource.data.email is string &&
                   request.resource.data.email.matches('^[^@]+@[^@]+\\.[^@]+$') &&
                   request.resource.data.distance is number &&
                   request.resource.data.distance >= 0 &&
                   request.resource.data.distance <= 100 &&
                   request.resource.data.timestamp is number;
    }
  }
}
`;