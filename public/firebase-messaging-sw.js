// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDIeVz2-UB5Uc2jxfrL6u7bde8JLFnaPjI",
  authDomain: "ozoox-8ccb1.firebaseapp.com",
  projectId: "ozoox-8ccb1",
  storageBucket: "ozoox-8ccb1.appspot.com",
  messagingSenderId: "542665470830",
  appId: "1:542665470830:web:3a42af0212243da44cc77f",
  measurementId: "G-0RLFT7ZVLP",
};


firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
