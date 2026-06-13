import React, { useState, useEffect, useRef } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

/* ─── Inline SVG Icons (Phosphor-inspired, ultra-light stroke) ─── */
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="3"/>
    <line x1="12" y1="18" x2="12" y2="18.01"/>
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="22,7 12,13 2,7"/>
  </svg>
);

const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IconLoader = () => (
  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const IconCheck = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.89 3.02C6.23 7.37 8.89 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.86c2.16-1.99 3.74-4.92 3.74-8.54z" />
    <path fill="#FBBC05" d="M5.28 14.78c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.39 7.56C.5 9.34 0 11.31 0 13.4s.5 4.06 1.39 5.84l3.89-3.02C5.02 15.52 5.02 14.98 5.28 14.78z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.69-2.86c-1.12.75-2.54 1.2-4.27 1.2-3.11 0-5.77-2.33-6.72-5.54l-3.89 3.02C3.37 20.33 7.35 23 12 23z" />
  </svg>
);

export const OtpAuth: React.FC = () => {
  const { sendOtp, verifyOtp, loading: phoneLoading, error: phoneError, verificationId, reset: resetPhone } = useFirebaseAuth();
  
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [emailMode, setEmailMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    setGlobalError(null);
  }, [activeTab, emailMode]);

  // ── Phone OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    try {
      await sendOtp(phoneNumber, 'recaptcha-container');
      setCountdown(60);
    } catch { /* handled in hook */ }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value !== '' && index < 5) inputRefs.current[index + 1]?.focus();
    if (index === 5 && value !== '') submitOtp(newOtp.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (code: string) => {
    try {
      const u = await verifyOtp(code);
      setUser(u as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch {
      setOtpCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // ── Email Auth ──
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setGlobalError(null);

    try {
      if (emailMode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setGlobalError(null);
        setEmailMode('login');
        // 使用 inline 提示而非 alert
        setPendingEmail(email);
        setVerificationPending(true);
        return;
      }

      if (!password) return;

      if (emailMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(result.user);
        setPendingEmail(email);
        setVerificationPending(true);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (!result.user.emailVerified) {
          setPendingEmail(email);
          setVerificationPending(true);
          setGlobalError('您的信箱尚未驗證，請先至信箱啟用帳號。');
          return;
        }
        setUser(result.user as unknown as Record<string, unknown>);
        setSuccess(true);
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      console.error(err);
      const errMap: Record<string, string> = {
        'auth/email-already-in-use': '該信箱已被註冊。',
        'auth/invalid-email': '信箱格式不正確。',
        'auth/weak-password': '密碼至少需要 6 個字元。',
        'auth/invalid-credential': '信箱或密碼錯誤。',
        'auth/user-not-found': '找不到此信箱對應的帳號。',
      };
      setGlobalError(errMap[firebaseErr.code ?? ''] || '驗證失敗，請檢查輸入內容。');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await sendEmailVerification(auth.currentUser);
        setGlobalError(null);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setGlobalError('發送失敗：' + (e.message || ''));
      } finally {
        setLoading(false);
      }
    } else {
      setGlobalError('會話已過期，請重新登入。');
      setVerificationPending(false);
    }
  };

  const handleCancelVerification = async () => {
    await signOut(auth);
    setVerificationPending(false);
    setGlobalError(null);
  };

  // ── Google ──
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setGlobalError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user as unknown as Record<string, unknown>);
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code !== 'auth/popup-closed-by-user') {
        setGlobalError('Google 登入失敗：' + (e.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Helper to cast user for display ──
  const displayUser = user as Record<string, unknown> & {
    uid?: string;
    email?: string;
    phoneNumber?: string;
    providerData?: Array<{ providerId?: string }>;
  };

  // ── Render: Verification Pending ──
  if (verificationPending) {
    return (
      <div className="card-shell">
        <div className="glass-panel verification-pending">
          <div className="icon-wrapper">
            <IconMail />
          </div>
          <h2>請驗證您的電子郵件</h2>
          <p>
            我們已將驗證信發送至 <strong>{pendingEmail}</strong>。<br />
            請點擊郵件中的連結以啟用帳號。
          </p>

          {globalError && <div className="error-message">{globalError}</div>}

          <button className="primary-button" onClick={handleResendVerification} disabled={loading}>
            {loading ? <IconLoader /> : <IconRefresh />}
            重新發送驗證信
          </button>
          <button className="secondary-button" onClick={handleCancelVerification} disabled={loading}>
            返回登入頁面
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Success ──
  if (success) {
    return (
      <div className="card-shell success-card">
        <div className="glass-panel">
          <div className="success-icon-wrapper">
            <IconCheck />
          </div>
          <h2>驗證成功</h2>
          <p>您已成功登入系統。</p>
          <div className="user-details">
            <strong>登入方式：</strong>{displayUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : displayUser?.phoneNumber ? '手機驗證碼' : '電子信箱'}<br />
            <strong>用戶 UID：</strong>{displayUser?.uid}<br />
            {displayUser?.email && <><strong>電子信箱：</strong>{displayUser.email}<br /></>}
            {displayUser?.phoneNumber && <><strong>電話號碼：</strong>{displayUser.phoneNumber}<br /></>}
          </div>
          <button className="primary-button" onClick={() => window.location.reload()}>
            重新登入
            <span className="btn-arrow"><IconArrow /></span>
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Main Auth Card ──
  return (
    <div className="card-shell">
      <div className="glass-panel">
        {!verificationId && (
          <div className="tab-container">
            <button className={`tab-button ${activeTab === 'phone' ? 'active' : ''}`} onClick={() => setActiveTab('phone')}>
              手機號碼
            </button>
            <button className={`tab-button ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>
              電子信箱
            </button>
          </div>
        )}

        <div className="card-header">
          <div className="icon-wrapper">
            <IconShield />
          </div>
          <h2>
            {activeTab === 'phone'
              ? (verificationId ? '輸入驗證碼' : '手機驗證登入')
              : (emailMode === 'login' ? '電子信箱登入' : emailMode === 'register' ? '註冊新帳號' : '重設密碼')}
          </h2>
          <p>
            {activeTab === 'phone'
              ? (verificationId ? `驗證碼已發送至 ${phoneNumber}` : '輸入手機號碼以接收一次性驗證碼。')
              : (emailMode === 'login' ? '輸入信箱與密碼以繼續。' : emailMode === 'register' ? '建立您的專屬帳號。' : '輸入註冊信箱以接收重設連結。')}
          </p>
        </div>

        <div id="recaptcha-container"></div>

        {(phoneError || globalError) && (
          <div className="error-message">
            {activeTab === 'phone' ? phoneError : globalError}
          </div>
        )}

        {/* ── Phone Tab ── */}
        {activeTab === 'phone' && (
          <>
            {!verificationId ? (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="input-group">
                  <IconPhone />
                  <input type="tel" placeholder="手機號碼" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={phoneLoading} autoFocus />
                </div>
                <button type="submit" className="primary-button" disabled={phoneLoading || !phoneNumber}>
                  {phoneLoading ? <IconLoader /> : '發送驗證碼'}
                  {!phoneLoading && <span className="btn-arrow"><IconArrow /></span>}
                </button>
              </form>
            ) : (
              <div className="otp-container">
                <div className="otp-inputs">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={phoneLoading}
                      className="otp-input"
                    />
                  ))}
                </div>
                <div className="resend-container">
                  {countdown > 0 ? (
                    <span className="countdown-text">重新發送 ({countdown}s)</span>
                  ) : (
                    <button type="button" className="resend-button" onClick={handleSendOtp} disabled={phoneLoading}>重新發送驗證碼</button>
                  )}
                </div>
                <button className="secondary-button" onClick={() => { resetPhone(); setOtpCode(['', '', '', '', '', '']); }}>
                  使用其他手機號碼
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Email Tab ── */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="auth-form">
            <div className="input-group">
              <IconMail />
              <input type="email" placeholder="電子信箱" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
            </div>

            {emailMode !== 'forgot' && (
              <div className="input-group">
                <IconLock />
                <input type="password" placeholder="密碼（至少 6 位數）" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              </div>
            )}

            {emailMode === 'login' && (
              <div className="forgot-link-container">
                <button type="button" className="link-button" onClick={() => setEmailMode('forgot')}>忘記密碼？</button>
              </div>
            )}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? <IconLoader /> : (emailMode === 'login' ? '登入' : emailMode === 'register' ? '註冊帳號' : '發送重設連結')}
              {!loading && <span className="btn-arrow"><IconArrow /></span>}
            </button>

            <div className="link-actions">
              {emailMode === 'login' ? (
                <button type="button" className="link-button" onClick={() => setEmailMode('register')}>註冊新帳號</button>
              ) : (
                <button type="button" className="link-button" onClick={() => setEmailMode('login')}>返回登入</button>
              )}
            </div>
          </form>
        )}

        {/* ── Social Divider + Google ── */}
        {!verificationId && (
          <>
            <div className="divider"><span>or</span></div>
            <button type="button" className="google-button" onClick={handleGoogleSignIn} disabled={loading || phoneLoading}>
              <GoogleIcon />
              使用 Google 帳號登入
            </button>
          </>
        )}
      </div>
    </div>
  );
};
