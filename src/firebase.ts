import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 嘗試從 localStorage 獲取使用者自訂的 Firebase 設定
const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem("custom-firebase-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      // 確保至少有關鍵的 apiKey 與 projectId 欄位
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse custom firebase config from localStorage", e);
  }

  // 預設從環境變數讀取
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
};

const firebaseConfig = getFirebaseConfig();

// 初始化 Firebase (防止重複初始化)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 匯出 auth 實例
export const auth = getAuth(app);
