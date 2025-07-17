// Firebase Configuration
// Replace these values with your actual Firebase project configuration
// Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyC_guWgogJLlbVrpZ6SgCGT9C3VQvNIpzI",
    authDomain: "qwop-multiplayer.firebaseapp.com",
    projectId: "qwop-multiplayer",
    storageBucket: "qwop-multiplayer.firebasestorage.app",
    messagingSenderId: "66637639929",
    appId: "1:66637639929:web:1c82413cfb36c0fcb77228",
    measurementId: "G-PDPM0F95V1"
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
