'use client';

import {useState} from 'react';
import Link from 'next/link';
import {alerts} from '../../lib/data';
import {CheckCircle2, AlertTriangle, BellRing} from 'lucide-react';

export default function Alerts() {
  const [rows, setRows] = useState(alerts);
  const [filter, setFilter] = useState<'All' | 'Open' | 'Acknowledged' | 'Resolved'>('All');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  async function update(id: string, status: 'Acknowledged' | 'Resolved') {
    setError('');
    setUpdating(id);
    try {
      const response = await fetch('/api/alerts/' + id + '/acknowledge', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update the alert.');
      setRows((current) =>
        current.map((alert) => (alert.id === id ? {...alert, status: data.status} : alert))
      );
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Unable to update the alert.');
    } finally {
      setUpdating(null);
    }
  }

  const filtered = rows.filter((a) => (filter === 'All' ? true : a.status === filter));

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Early warning</div>
          <h1 className="h1">Alerts & Notifications</h1>
          <div className="sub">
            Automated prioritization for risk increases, overdue stages and acquisition bottlenecks.
          </div>
        </div>
        <div className="actions">
          {(['All', 'Open', 'Acknowledged', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              className={`btn ${filter === tab ? 'primary' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <div className="grid kpis">
        {[
          ['Critical alerts', rows.filter((a) => a.severity === 'Critical').length],
          ['High alerts', rows.filter((a) => a.severity === 'High').length],
          ['Open', rows.filter((a) => a.status === 'Open').length],
          ['Acknowledged', rows.filter((a) => a.status === 'Acknowledged').length],
        ].map(([label, val]) => (
          <div className="kpi" key={label}>
            <div className="label">{label}</div>
            <div className="value">{val}</div>
            <div className="trend">live surveillance feed</div>
          </div>
        ))}
      </div>

      <div className="panel" style={{marginTop: 14}}>
        <div className="panelhead">
          <div className="paneltitle">
            <BellRing size={16} /> Active Alerts ({filtered.length})
          </div>
          <span className="muted">Click project name to open intelligence view</span>
        </div>

        {filtered.length === 0 ? (
          <div className="demo" style={{margin: '14px 0'}}>
            No alerts found for the selected status filter.
          </div>
        ) : (
          filtered.map((a) => (
            <div className="alertrow" key={a.id}>
              <span className={'risk ' + a.severity.toLowerCase()}>{a.severity}</span>
              <div>
                <b>{a.reason}</b>
                <div className="muted">
                  <Link className="link" href={`/projects/${a.projectId}`}>
                    {a.project} →
                  </Link>
                </div>
              </div>
              <div className="muted">{a.detected}</div>
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      a.status === 'Resolved'
                        ? 'var(--green)'
                        : a.status === 'Acknowledged'
                        ? 'var(--blue)'
                        : 'var(--amber)',
                  }}
                >
                  {a.status === 'Resolved' && <CheckCircle2 size={13} />}
                  {a.status === 'Open' && <AlertTriangle size={13} />}
                  {a.status}
                </span>
              </div>
              <div className="actions">
                <button
                  className="btn"
                  disabled={
                    updating === a.id || a.status === 'Acknowledged' || a.status === 'Resolved'
                  }
                  onClick={() => update(a.id, 'Acknowledged')}
                >
                  Acknowledge
                </button>
                <button
                  className="btn"
                  disabled={updating === a.id || a.status === 'Resolved'}
                  onClick={() => update(a.id, 'Resolved')}
                >
                  Resolve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
