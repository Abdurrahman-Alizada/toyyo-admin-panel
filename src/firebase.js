import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const app = initializeApp(
  {
    apiKey: "AIzaSyAlT35FPsVUv-OGEyeKD3AdZQFi6QjN9BU",
    authDomain: "tuyyoo-135fe.firebaseapp.com",
    projectId: "tuyyoo-135fe",
    storageBucket: "tuyyoo-135fe.appspot.com",
    messagingSenderId: "121619329079",
    appId: "1:121619329079:web:2c1e756549e867ca6ecfb2",
    measurementId: "G-72PYTJXH15",
  }

  //   {
  //     apiKey: "AIzaSyDIeVz2-UB5Uc2jxfrL6u7bde8JLFnaPjI",
  //     authDomain: "ozoox-8ccb1.firebaseapp.com",
  //     projectId: "ozoox-8ccb1",
  //     storageBucket: "ozoox-8ccb1.appspot.com",
  //     messagingSenderId: "542665470830",
  //     appId: "1:542665470830:web:3a42af0212243da44cc77f",
  //     measurementId: "G-0RLFT7ZVLP",
  // }
)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const messaging = getMessaging(app);