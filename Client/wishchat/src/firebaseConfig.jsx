import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFTH7uRPJ6lFm241AMnj6bYgGiSRRkMw0",
  authDomain: "wishchatprog2.firebaseapp.com",
  databaseURL: "https://wishchatprog2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wishchatprog2",
  storageBucket: "wishchatprog2.appspot.com",
  messagingSenderId: "376949286313",
  appId: "1:376949286313:web:972df17e5e8293770110b8"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const storage = getStorage(app);