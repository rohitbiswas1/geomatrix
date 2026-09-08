'use client';

import {useState} from 'react';
import {useTheme} from '../../components/ThemeProvider';
import {Sun, Moon, Shield, Sliders, Check} from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const {theme, setTheme} = useTheme();

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Administration</div>
          <h1 className="h1">System Settings</h1>
          <div className="sub">
            Configure system parameters, appearance, environment endpoints and model monitoring.
          </div>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="paneltitle">
            <Sliders size={16} /> Appearance & Interface
          </div>
          <div style={{marginTop: 14}}>
            <label className="muted" style={{display: 'block', marginBottom: 8}}>
              Visual Theme
            </label>
            <div style={{display: 'flex', gap: 10}}>
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'primary' : ''}`}
                onClick={() => setTheme('light')}
                style={{flex: 1, justifyContent: 'center', padding: '12px 14px'}}
              >
                <Sun size={15} /> Light Mode
              </button>
              <button
                type="button"
                className={`btn ${theme === 'dark' ? 'primary' : ''}`}
                onClick={() => setTheme('dark')}
                style={{flex: 1, justifyContent: 'center', padding: '12px 14px'}}
              >
                <Moon size={15} /> Dark Mode
              </button>
            </div>
            <p className="sub" style={{fontSize: 11, marginTop: 8}}>
              Theme preference is persisted in your browser and automatically applies across sessions.
            </p>
          </div>

          <div className="paneltitle" style={{marginTop: 24}}>
            System Endpoints
          </div>
          <div className="form" style={{marginTop: 12}}>
            <label className="muted">
              Application Base URL
              <input defaultValue="http://localhost:3000" />
            </label>
            <label className="muted">
              Model API URL (FastAPI Service)
              <input placeholder="https://api.geomatrix.gov.in/v1/predict" />
            </label>
            <label className="muted">
              Mapbox Vector Tile API Token
              <input placeholder="Configured via NEXT_PUBLIC_MAPBOX_TOKEN" />
            </label>
            <button
              className="btn primary"
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              }}
              style={{marginTop: 4}}
            >
              Save Configuration
            </button>
            {saved && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--green)',
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                <Check size={14} /> Configuration saved in active demo session
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panelhead">
            <div>
              <div className="paneltitle">
                <Shield size={16} /> AI Model Surveillance
              </div>
              <div className="sub" style={{marginTop: 4}}>
                XGBoost Delay Risk Classifier · v1.0-demo
              </div>
            </div>
            <span className="risk low">Healthy</span>
          </div>

          <div className="grid two" style={{marginTop: 14}}>
            {[
              ['Precision', '0.86'],
              ['Recall', '0.81'],
              ['F1 Score', '0.83'],
              ['ROC-AUC', '0.89'],
            ].map(([label, val]) => (
              <div className="kpi" key={label}>
                <div className="label">{label}</div>
                <div className="value" style={{fontSize: 22}}>
                  {val}
                </div>
              </div>
            ))}
          </div>

          <div className="demo" style={{marginTop: 16, marginBottom: 0}}>
            Prototype / simulated validation metrics. Not trained on official government datasets.
          </div>
          <div className="footer-note">
            Health: Operational · Freshness: Updated 2 days ago · Drift: Within acceptable parameters
          </div>
        </div>
      </div>
    </div>
  );
}
