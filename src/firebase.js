import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDrtRfWNI6PCCfKvln4X1HoRSDjC0YH4ac",
  authDomain: "whatsapp-clone-29961.firebaseapp.com",
  projectId: "whatsapp-clone-29961",
  storageBucket: "whatsapp-clone-29961.appspot.com",
  messagingSenderId: "35272786119",
  appId: "1:35272786119:web:5a4db51e6dd05dd70d3ee2"
};
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const provider=new firebase.auth.GoogleAuthProvider();
  export {auth ,provider};
  export default db;
