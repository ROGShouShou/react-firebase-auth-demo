import { useState, useEffect, useCallback } from 'react';
import { OtpAuth } from './components/OtpAuth';
import './index.css';

/* ─── Theme Toggle Icons ─── */
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ─── Feature Step Icons ─── */
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18.01"/>
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/>
  </svg>
);
const IconShieldStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

/* ─── Settings Panel Icons ─── */
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

type Theme = 'light' | 'dark';

interface StepItem {
  title: string;
  desc: string;
  customImage?: string;
}

const STEP_ICONS = [<IconPhone />, <IconMail />, <IconShieldStar />, <IconKey />];

const TECH_STACK = [
  { label: 'Frontend', value: 'React + TypeScript' },
  { label: 'Auth', value: 'Firebase Authentication' },
  { label: 'Build', value: 'Vite' },
  { label: 'Style', value: 'Vanilla CSS' },
];

const App = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('auth-demo-theme') as Theme | null;
    return stored ?? 'light';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firebase Config State
  const [customConfig, setCustomConfig] = useState(() => {
    const saved = localStorage.getItem("custom-firebase-config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignored */ }
    }
    return {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: "",
    };
  });

  const hasCustomConfig = !!localStorage.getItem("custom-firebase-config");

  // Guide Editorial State (Read-only on UI, but loads localStorage customize values if present)
  const guideTitle = localStorage.getItem("custom-guide-title") ?? "身分驗證\n系統指南";
  const guideSubtitle = localStorage.getItem("custom-guide-subtitle") ?? "這個 Demo 展示了如何使用 Firebase Authentication 實作完整的使用者身分驗證流程。右側即為可操作的真實驗證介面。";
  
  const [guideSteps] = useState<StepItem[]>(() => {
    const saved = localStorage.getItem("custom-guide-steps");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignored */ }
    }
    return [
      {
        title: '手機簡訊驗證',
        desc: '輸入手機號碼後，Firebase 會透過 SMS 發送 6 位數一次性驗證碼 (OTP)。內建 reCAPTCHA 防止機器人濫發。',
      },
      {
        title: '電子信箱註冊',
        desc: '填寫 Email 與密碼後建立帳號，系統自動發送驗證郵件。帳號需通過信箱驗證後才能正常登入。',
      },
      {
        title: 'Google OAuth 登入',
        desc: '一鍵授權 Google 帳號登入，無需記憶額外密碼。Firebase 處理 OAuth 2.0 流程與 Token 管理。',
      },
      {
        title: '密碼重設機制',
        desc: '忘記密碼時，輸入註冊信箱即可收到重設連結。連結有效期限為 1 小時，點擊後設定新密碼即可。',
      },
    ];
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auth-demo-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Firebase Config Handlers
  const handleSaveConfig = () => {
    const cleanConfig = Object.fromEntries(
      Object.entries(customConfig).filter(([_, v]) => !!v)
    );
    if (Object.keys(cleanConfig).length > 0) {
      localStorage.setItem("custom-firebase-config", JSON.stringify(cleanConfig));
    } else {
      localStorage.removeItem("custom-firebase-config");
    }
    window.location.reload();
  };

  const handleClearConfig = () => {
    localStorage.removeItem("custom-firebase-config");
    window.location.reload();
  };

  const handlePasteJson = (jsonStr: string) => {
    try {
      let cleaned = jsonStr.trim();
      if (cleaned.includes("const firebaseConfig =")) {
        cleaned = cleaned.split("const firebaseConfig =")[1];
      }
      if (cleaned.endsWith(";")) {
        cleaned = cleaned.slice(0, -1);
      }
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');

      const extractKey = (key: string) => {
        const match = cleaned.match(new RegExp(`['"]?${key}['"]?\\s*:\\s*['"]([^'"]+)['"]`));
        return match ? match[1] : "";
      };

      const parsed = {
        apiKey: extractKey("apiKey"),
        authDomain: extractKey("authDomain"),
        projectId: extractKey("projectId"),
        storageBucket: extractKey("storageBucket"),
        messagingSenderId: extractKey("messagingSenderId"),
        appId: extractKey("appId"),
        measurementId: extractKey("measurementId")
      };

      if (parsed.apiKey) {
        setCustomConfig(parsed);
      } else {
        const strictParsed = JSON.parse(cleaned);
        if (strictParsed && typeof strictParsed === "object") {
          setCustomConfig({
            apiKey: strictParsed.apiKey || "",
            authDomain: strictParsed.authDomain || "",
            projectId: strictParsed.projectId || "",
            storageBucket: strictParsed.storageBucket || "",
            messagingSenderId: strictParsed.messagingSenderId || "",
            appId: strictParsed.appId || "",
            measurementId: strictParsed.measurementId || "",
          });
        }
      }
    } catch {
      alert("解析失敗，請檢查貼上的格式是否為標準的 Firebase SDK 設定檔。");
    }
  };

  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />

      {/* ─── Sidebar Toggle (Floating Glassmorphic Pill Button Top-Left) ─── */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="開啟設定選單"
        title="Firebase 設定"
      >
        <IconSettings />
        <span className="toggle-text">API 設定</span>
      </button>

      {/* ─── Theme Toggle (Floating Top-Right) ─── */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? '切換至深色模式' : '切換至淺色模式'}
        title={theme === 'light' ? '深色模式' : '淺色模式'}
      >
        {theme === 'light' ? <IconMoon /> : <IconSun />}
      </button>

      {/* ─── Settings Sidebar Backdrop ─── */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── Settings Sidebar Drawer ─── */}
      <aside className={`settings-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Firebase 自訂參數設定</h3>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} title="關閉選單">
            <IconClose />
          </button>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">連線狀態</h4>
            <p className="sidebar-description">
              {hasCustomConfig ? (
                <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>● 已啟用自訂 Firebase 專案</span>
              ) : (
                <span style={{ color: 'var(--text-secondary)' }}>○ 目前使用預設開源測試專案</span>
              )}
            </p>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-section-title">快速匯入 (貼上 Firebase SDK Config)</h4>
            <p className="sidebar-description">您可以複製 Firebase 控制台「網頁應用程式」中的設定物件並貼在下方以自動解析欄位：</p>
            <textarea
              className="sidebar-textarea"
              placeholder={`const firebaseConfig = {\n  apiKey: "...",\n  projectId: "...",\n  ...\n};`}
              onChange={(e) => handlePasteJson(e.target.value)}
            />
          </div>

          <div className="sidebar-section" style={{ gap: '8px' }}>
            <h4 className="sidebar-section-title">手動設定欄位</h4>
            <div className="auth-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="API Key"
                  value={customConfig.apiKey}
                  onChange={(e) => setCustomConfig({...customConfig, apiKey: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Auth Domain"
                  value={customConfig.authDomain}
                  onChange={(e) => setCustomConfig({...customConfig, authDomain: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Project ID"
                  value={customConfig.projectId}
                  onChange={(e) => setCustomConfig({...customConfig, projectId: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Storage Bucket"
                  value={customConfig.storageBucket}
                  onChange={(e) => setCustomConfig({...customConfig, storageBucket: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Messaging Sender ID"
                  value={customConfig.messagingSenderId}
                  onChange={(e) => setCustomConfig({...customConfig, messagingSenderId: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="App ID"
                  value={customConfig.appId}
                  onChange={(e) => setCustomConfig({...customConfig, appId: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Measurement ID (選填)"
                  value={customConfig.measurementId}
                  onChange={(e) => setCustomConfig({...customConfig, measurementId: e.target.value})}
                  style={{ paddingLeft: '14px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '20px' }}>
            <button className="primary-button" onClick={handleSaveConfig} style={{ marginTop: 0 }}>
              儲存並套用連線
            </button>
            {hasCustomConfig && (
              <button className="secondary-button" onClick={handleClearConfig} style={{ marginTop: 0 }}>
                清除設定 (還原預設)
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Main Split Layout ─── */}
      <div className="split-layout">

        {/* ── Left Panel: Guide ── */}
        <aside className="panel-left">
          <div className="panel-left-inner">
            <header className="panel-brand animate-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="brand-dot" aria-hidden="true" />
                <span className="brand-name">Firebase Auth</span>
              </div>
            </header>

            <div className="panel-hero animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="panel-title" style={{ whiteSpace: 'pre-wrap' }}>
                {guideTitle}
              </h1>
              <p className="panel-subtitle">
                {guideSubtitle}
              </p>
            </div>

            <div className="steps-list">
              {guideSteps.map((step, i) => (
                <div className="step-item" key={i}>
                  <div className="step-icon">{STEP_ICONS[i] ?? <IconShieldStar />}</div>
                  <div className="step-content" style={{ width: '100%' }}>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                    {step.customImage && (
                      <div className="step-custom-image-preview-container">
                        <img src={step.customImage} alt={step.title} className="step-custom-image-preview" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="tech-strip">
              {TECH_STACK.map((t, i) => (
                <div className="tech-chip" key={i}>
                  <span className="tech-label">{t.label}</span>
                  <span className="tech-value">{t.value}</span>
                </div>
              ))}
            </div>

            <footer className="panel-footer">
              <p>開源專案 · 歡迎 Fork 與 Pull Request</p>
            </footer>
          </div>
        </aside>

        {/* ── Right Panel: Auth Card ── */}
        <main className="panel-right">
          <div className="panel-right-inner">
            <OtpAuth />
          </div>
        </main>

      </div>
    </>
  );
};

export default App;
