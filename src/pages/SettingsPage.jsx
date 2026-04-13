import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './SettingsPage.css';

const DEFAULT_SETTINGS = {
  notifications: true,
  autoplayVideo: false,
  showAdult: true,
  language: 'uz'
};

const SettingsPage = () => {
  const { user } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, language });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(`mangauz_settings_${user.id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      setSettings(parsed);
      if (parsed.language) {
        changeLanguage(parsed.language);
      }
    }
  }, [user, changeLanguage]);

  const update = (name, value) => {
    setSaved(false);
    setSettings((prev) => ({ ...prev, [name]: value }));
    if (name === 'language') {
      changeLanguage(value);
    }
  };

  const save = () => {
    if (!user) return;
    localStorage.setItem(`mangauz_settings_${user.id}`, JSON.stringify(settings));
    setSaved(true);
  };

  if (!user) {
    return (
      <div className="settings-page">
        <h2>Login required</h2>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>{t('settings')}</h1>
        <p>Customize your platform experience.</p>
      </div>

      <div className="settings-card">
        <label className="setting-row">
          <span>Enable notifications</span>
          <input type="checkbox" checked={settings.notifications} onChange={(e) => update('notifications', e.target.checked)} />
        </label>

        <label className="setting-row">
          <span>Autoplay videos</span>
          <input type="checkbox" checked={settings.autoplayVideo} onChange={(e) => update('autoplayVideo', e.target.checked)} />
        </label>

        <label className="setting-row">
          <span>Show 18+ content</span>
          <input type="checkbox" checked={settings.showAdult} onChange={(e) => update('showAdult', e.target.checked)} />
        </label>

        <label className="setting-row">
          <span>{t('language')}</span>
          <select value={settings.language} onChange={(e) => update('language', e.target.value)}>
            <option value="uz">Uzbek</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
          </select>
        </label>

        <button className="save-settings-btn" onClick={save}>
          {t('save')}
        </button>
        {saved && <p className="saved-note">Saved successfully.</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
