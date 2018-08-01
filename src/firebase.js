import firebase from 'firebase'
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCiGZpNUsReCqOtH1AwJsMQGQD7zAtRxas",
    authDomain: "waitlist-b3458.firebaseapp.com",
    databaseURL: "https://waitlist-b3458.firebaseio.com",
    projectId: "waitlist-b3458",
    storageBucket: "waitlist-b3458.appspot.com",
    messagingSenderId: "117584327875"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  
  export const provider = new firebase.auth.GoogleAuthProvider();
  const auth = firebase.auth();



  export {firebase, auth};