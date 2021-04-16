const firebaseConfig = {
  apiKey: "AIzaSyBqaq8Hunag0FCAtK-dsmvEIfuOQXUh5BY",
  authDomain: "g-docs-clone.firebaseapp.com",
  projectId: "g-docs-clone",
  storageBucket: "g-docs-clone.appspot.com",
  messagingSenderId: "692415596555",
  appId: "1:692415596555:web:7a297cdd1be9857e59df0e",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
