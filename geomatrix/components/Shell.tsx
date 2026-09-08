'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {signOut, useSession} from 'next-auth/react';
import {
  Bell,
  BrainCircuit,
  Database,
  FileText,
  LayoutDashboard,
  Map,
  Search,
  Settings,
  ShieldCheck,
  Users,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useTheme} from './ThemeProvider';

export function Shell({children}: {children: React.ReactNode}) {
  const path = usePathname();
  const router = useRouter();
  const {data: session} = useSession();
  const {theme, toggleTheme} = useTheme();
  const [q, setQ] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' · ' +
          now.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }) +
          ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const login = path === '/login';
  if (login) return <>{children}</>;

  const isAdmin = session?.user?.role === 'ADMIN';
  const nav = [
    ['/dashboard', 'Command Center', LayoutDashboard],
    ['/projects', 'Projects', Users],
    ['/map', 'GIS Risk Map', Map],
    ['/alerts', 'Alerts', Bell],
    ['/analytics', 'Analytics', BrainCircuit],
    ['/reports', 'Reports', FileText],
    ['/data', 'Data Management', Database],
    ['/settings', 'Settings', Settings],
    ...(isAdmin ? [['/admin/model', 'Model Monitoring', BrainCircuit]] : []),
  ];
  const displayName = session?.user?.name || session?.user?.email || 'Authenticated user';
  const displayRole = (session?.user?.role || 'VIEWER').replace('_', ' ');

  return (
    <div className="app">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brandmark">
            <Map size={19} />
          </div>
          <div>
            <b>GEOMATRIX</b>
            <small>LAND ACQUISITION AI</small>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="btn"
              style={{marginLeft: 'auto', padding: 6}}
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="nav">
          {nav.map(([href, label, Icon]) => (
            <Link
              key={href as string}
              href={href as string}
              className={path.startsWith(href as string) ? 'active' : ''}
            >
              <Icon size={16} />
              <span>{label as string}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebottom">
          <div className="userline">
            <div style={{display: 'flex', gap: 8, alignItems: 'center', minWidth: 0}}>
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt=""
                  width={28}
                  height={28}
                  style={{borderRadius: '50%'}}
                />
              ) : (
                <div className="brandmark" style={{width: 28, height: 28, fontSize: 11}}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{minWidth: 0}}>
                <b
                  style={{
                    fontSize: 11,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </b>
                <div className="role">{displayRole}</div>
              </div>
            </div>
            <ShieldCheck size={15} />
          </div>

          <button
            className="btn"
            style={{marginTop: 12, width: '100%', justifyContent: 'center'}}
            onClick={() => signOut({callbackUrl: '/login'})}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>

          <div className="crumb">
            GovTech Decision Support / {path.split('/')[1] || 'dashboard'}
          </div>

          <div className="search">
            <Search size={14} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                q &&
                router.push('/projects?search=' + encodeURIComponent(q))
              }
              placeholder="Search project, district or project ID…"
            />
          </div>

          <div className="topright">
            <div className="status">
              <i className="dot" /> System operational
            </div>

            <button
              onClick={toggleTheme}
              className="theme-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle dark and light theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} style={{color: '#f59e0b'}} />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} style={{color: '#3b82f6'}} />
                  <span>Dark</span>
                </>
              )}
            </button>

            {timeString && <div className="date">{timeString}</div>}

            <Link href="/alerts" className="btn" style={{padding: '6px 8px'}} title="Alerts">
              <Bell size={15} />
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
