import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBOuI9UgpmEgXuNgfAh6bFgPWqoT8dyp3A",
  authDomain: "ninth-bonito-408109.firebaseapp.com",
  databaseURL: "https://ninth-bonito-408109-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ninth-bonito-408109",
  storageBucket: "ninth-bonito-408109.firebasestorage.app",
  messagingSenderId: "122746869018",
  appId: "1:122746869018:web:2d3a991ad7f27947e708a3"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
export const db = getDatabase(app);
export const auth = getAuth(app);

export default app; 