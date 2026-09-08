'use client';

import {FormEvent, useEffect, useState} from 'react';
import {useSession, signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {Map, ShieldCheck, Sun, Moon} from 'lucide-react';
import {useTheme} from '../../components/ThemeProvider';

export default function Login() {
  const router = useRouter();
  const {status} = useSession();
  const {theme, toggleTheme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  async function continueWithGoogle() {
    setLoading(true);
    setError('');
    try {
      const result = await signIn('google', {callbackUrl: '/dashboard', redirect: false});
      if (result?.error) {
        setError('Google sign-in was not completed. Please try again or contact an administrator.');
        setLoading(false);
        return;
      }
      router.replace(result?.url || '/dashboard');
    } catch {
      setError('Authentication is temporarily unavailable. Check the OAuth configuration and try again.');
      setLoading(false);
    }
  }

  async function continueWithDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      callbackUrl: '/dashboard',
      redirect: false,
    });
    if (result?.error) {
      setError('The demo email or password is incorrect.');
      setLoading(false);
      return;
    }
    router.replace(result?.url || '/dashboard');
  }

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';

  return (
    <div className="login">
      <section className="loginhero">
        <div className="brand">
          <div className="brandmark">
            <Map size={19} />
          </div>
          <div>
            <b>GEOMATRIX</b>
            <small>LAND ACQUISITION AI</small>
          </div>
        </div>
        <div className="eyebrow" style={{color: '#93c5fd'}}>
          Smart India Hackathon 2026 · Problem 26017
        </div>
        <h1>Predictive Intelligence for Smarter Infrastructure</h1>
        <p>
          Early-warning intelligence for land acquisition delays. Predict risk, explain drivers,
          prioritize intervention and act before critical slippage becomes project delay.
        </p>
        <div className="tag" style={{background: 'rgba(255,255,255,0.15)', color: '#fff', width: 'fit-content'}}>
          DEMO / SIMULATED DATA
        </div>
      </section>

      <section className="loginpanel" style={{position: 'relative'}}>
        {/* Theme Toggle button on login screen */}
        <div style={{position: 'absolute', top: 20, right: 20}}>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} style={{color: '#f59e0b'}} /> <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} style={{color: '#3b82f6'}} /> <span>Dark</span>
              </>
            )}
          </button>
        </div>

        <div className="loginbox">
          <div className="eyebrow">Secure access</div>
          <h2 style={{margin: '6px 0'}}>Land Acquisition AI</h2>
          <p className="sub" style={{marginBottom: 16}}>
            Sign in to the Geomatrix command center.
          </p>

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          {demoMode && (
            <form className="form" onSubmit={continueWithDemo}>
              <label className="muted" style={{fontSize: 11}}>
                Demo Account Email
                <input
                  name="email"
                  type="email"
                  defaultValue="admin@geomatrix.gov.in"
                  aria-label="Demo email"
                  required
                />
              </label>

              <label className="muted" style={{fontSize: 11}}>
                Demo Account Password
                <input
                  name="password"
                  type="password"
                  defaultValue="Admin@123"
                  aria-label="Demo password"
                  required
                />
              </label>

              <button
                className="btn primary"
                type="submit"
                disabled={loading || status === 'loading'}
                style={{width: '100%', justifyContent: 'center', marginTop: 6, padding: '12px 14px'}}
              >
                {loading ? 'Signing in...' : 'Sign in with demo account'}
              </button>
            </form>
          )}

          {googleEnabled && (
            <button
              className="btn"
              type="button"
              onClick={continueWithGoogle}
              disabled={loading || status === 'loading'}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: demoMode ? 10 : 0,
                padding: '12px 14px',
              }}
            >
              <span style={{color: '#4285f4', fontWeight: 800}}>G</span> Continue with Google
            </button>
          )}

          <div className="panel" style={{marginTop: 18, padding: 14}}>
            <b style={{fontSize: 11}}>Access policy</b>
            <p className="footer-note" style={{marginTop: 4}}>
              Demo access is enabled for local evaluation. Production deployment connects to
              official Single Sign-On (SSO).
            </p>
          </div>

          <p className="footer-note" style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <ShieldCheck size={14} /> Authentication is managed via Auth.js JWT sessions.
          </p>
        </div>
      </section>
    </div>
  );
}
