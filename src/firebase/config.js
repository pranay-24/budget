// import firebase from 'firebase/app';
// import 'firebase/firestore';
const {initializeApp} = require('firebase/app')
const {getFirestore} = require('firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyBkUWhiGV758Yt_MNO1yUSyreIKdzB_SVQ",
    authDomain: "budget-app-692a8.firebaseapp.com",
    projectId: "budget-app-692a8",
    storageBucket: "budget-app-692a8.appspot.com",
    messagingSenderId: "876435216813",
    appId: "1:876435216813:web:340b7db1df4cd68285e924"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);