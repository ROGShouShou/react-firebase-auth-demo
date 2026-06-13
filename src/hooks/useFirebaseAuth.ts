import { useState, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';

export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // 初始化 reCAPTCHA 驗證機制（Firebase 規定防刷簡訊的機制）
  const initRecaptcha = (containerId: string) => {
    if (!recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA 驗證成功
          },
          'expired-callback': () => {
            setError('安全驗證已過期，請重新嘗試');
          }
        });
      } catch (err: any) {
        setError('初始化安全驗證失敗：' + err.message);
      }
    }
  };

  // 發送 OTP 簡訊
  const sendOtp = async (phoneNumber: string, containerId: string = 'recaptcha-container') => {
    setLoading(true);
    setError(null);
    try {
      // 轉換台灣手機號碼為國際格式 (+8869...)
      let formattedPhone = phoneNumber.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+886' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+886' + formattedPhone; 
      }

      initRecaptcha(containerId);
      
      if (!recaptchaVerifierRef.current) {
        throw new Error('無法初始化 reCAPTCHA 驗證機制');
      }

      // 呼叫 Firebase SDK 發送簡訊
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      confirmationResultRef.current = result;
      setVerificationId(result.verificationId);
      setLoading(false);
      return result.verificationId;
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      // Firebase 常見錯誤處理
      let friendlyMessage = '發送簡訊失敗，請稍後再試。';
      if (err.code === 'auth/invalid-phone-number') {
        friendlyMessage = '請輸入正確的手機號碼格式。';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = '此號碼發送次數過於頻繁，請稍後再試。';
      }
      
      setError(friendlyMessage);
      setLoading(false);
      throw err;
    }
  };

  // 驗證驗證碼是否正確
  const verifyOtp = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!confirmationResultRef.current) {
        throw new Error('驗證逾時，請重新發送驗證碼');
      }
      // 呼叫 Firebase SDK 驗證
      const result = await confirmationResultRef.current.confirm(code);
      setLoading(false);
      return result.user;
    } catch (err: any) {
      console.error('Firebase Verify Error:', err);
      setError('驗證碼錯誤，請重新輸入。');
      setLoading(false);
      throw err;
    }
  };

  const reset = () => {
    setVerificationId(null);
    setError(null);
    confirmationResultRef.current = null;
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
  };

  return { sendOtp, verifyOtp, loading, error, verificationId, reset };
};
