'use client';

import Link from 'next/link';
import {notFound, useParams} from 'next/navigation';
import {useState} from 'react';
import {AlertTriangle, ArrowRight, CheckCircle2, Map as MapIcon, Check} from 'lucide-react';
import {findProject, recommendations} from '../../../lib/api';
import {explain, stages, riskLevel} from '../../../lib/data';

export default function Detail() {
  const {id} = useParams<{id:string}>();
  const p = findProject(id);
  if (!p) notFound();

  const factors = explain(p);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');

  function act(t: string) {
    setModal(false);
    setToast(t + ' created successfully');
    setTimeout(() => setToast(''), 2500);
  }

  const sr = [18, 43, 92, 76, 58, 62, 71];

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Project intelligence</div>
          <h1 className="h1">{p.name}</h1>
          <div className="sub">
            {p.projectCode} · {p.district}, {p.state} · {p.projectType} · {p.authority}
          </div>
        </div>
        <div className="actions">
          <Link className="btn" href="/map">
            <MapIcon size={14} /> GIS View
          </Link>
          <button className="btn primary" onClick={() => setModal(true)}>
            Assign intervention
          </button>
        </div>
      </div>

      <div className="grid detailgrid">
        <div className="grid">
          {/* Risk Hero */}
          <div className="riskhero">
            <div className="eyebrow">Current risk assessment</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '10px 0',
              }}
            >
              <div>
                <div className="score">
                  {p.risk}
                  <span style={{fontSize: 16, color: 'var(--muted)'}}>/100</span>
                </div>
                <span className={'risk ' + riskLevel(p.risk).toLowerCase()}>
                  {riskLevel(p.risk)} Risk
                </span>
              </div>
              <div style={{textAlign: 'right'}}>
                <div className="muted">Delay probability</div>
                <b style={{fontSize: 28, color: 'var(--ink)'}}>{p.delay}%</b>
                <div className="muted">
                  Expected delay: {p.delayDays} days · Confidence: {p.confidence}%
                </div>
              </div>
            </div>
            <p className="sub" style={{margin: '8px 0 0'}}>
              <b>Intervention Required.</b> AI-generated predictive decision support — final
              administrative decisions remain with designated government officials.
            </p>
          </div>

          {/* Stage-wise Risk */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Stage-wise Risk Breakdown</div>
                <div className="muted">Acquisition pipeline milestones</div>
              </div>
            </div>
            {stages.map((s, i) => (
              <div className={'stage ' + (i === 2 ? 'current' : '')} key={s}>
                <div className="stagecircle">
                  {i < 2 ? (
                    <CheckCircle2 size={14} style={{color: 'var(--green)'}} />
                  ) : i === 2 ? (
                    <AlertTriangle size={14} style={{color: 'var(--red)'}} />
                  ) : (
                    i + 1
                  )}
                </div>
                <div>
                  <b>{s}</b>
                  <div className="muted">
                    {i < 2 ? 'Completed' : i === 2 ? 'Current Bottleneck' : 'Pending'}
                  </div>
                </div>
                <span className={'risk ' + riskLevel(sr[i]).toLowerCase()}>
                  {riskLevel(sr[i])} · {sr[i]}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Acquisition Timeline</div>
                <div className="muted">Actual vs expected milestones</div>
              </div>
            </div>
            <div className="timeline">
              {[
                ['Notification', '15 Jan 2026', 'Completed', 100],
                ['Objection Hearing', '12 Feb 2026', 'Completed · +4 days', 100],
                ['Compensation', '05 Mar 2026', 'Delayed · +27 days', 76],
                ['Award', '20 Apr 2026', 'At Risk', 45],
                ['Possession', '15 May 2026', 'Projected', 20],
              ].map((x) => (
                <div className="tl" key={x[0]}>
                  <b>{x[0]}</b>
                  <div>
                    <div>{x[1]}</div>
                    <div className="line">
                      <span style={{width: x[3] + '%'}} />
                    </div>
                  </div>
                  <span className="muted">{x[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          {/* Explainable AI */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Why is this project at risk?</div>
                <div className="muted">SHAP-style feature contributions (prototype engine)</div>
              </div>
              <span className="tag">EXPLAINABLE AI</span>
            </div>

            {factors.map((f) => (
              <div className="barrow" key={f.feature}>
                <span>{f.feature}</span>
                <div className="bar">
                  <i
                    style={{
                      width: Math.min(100, Math.abs(f.contribution) * 4) + '%',
                      background: f.contribution > 0 ? 'var(--red)' : 'var(--green)',
                    }}
                  />
                </div>
                <b>
                  {f.contribution > 0 ? '+' : ''}
                  {f.contribution.toFixed(1)}
                </b>
              </div>
            ))}

            <div className="panel" style={{marginTop: 15, background: 'var(--panel-subtle)'}}>
              <b style={{fontSize: 12}}>AI Model Explanation Summary</b>
              <p className="sub" style={{lineHeight: 1.6, marginTop: 6}}>
                The project is classified as <b>{riskLevel(p.risk)} RISK</b> primarily because
                compensation cases remain unresolved, legal disputes are active, and mandatory
                documentation is incomplete. The compensation stage has exceeded the baseline
                processing timeline by 27 days.
              </p>
            </div>
          </div>

          {/* Delay Drivers */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Delay Drivers</div>
                <div className="muted">Ranked risk contribution signals</div>
              </div>
            </div>
            {[
              'Compensation backlog',
              'Legal dispute',
              'Pending approval',
              'Documentation gap',
              'Rehabilitation & resettlement',
              'Land ownership verification',
              'Stakeholder objections',
            ].map((x, i) => (
              <div className="stage" key={x}>
                <div className="stagecircle">{i + 1}</div>
                <div>
                  <b>{x}</b>
                  <div className="muted">Severity: {i < 2 ? 'Critical' : i < 4 ? 'High' : 'Medium'}</div>
                </div>
                <span className="muted">{i < 3 ? 'Immediate' : 'Review'}</span>
              </div>
            ))}
          </div>

          {/* Recommended Interventions */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Recommended Interventions</div>
                <div className="muted">Predictive actions generated from risk drivers</div>
              </div>
            </div>
            {recommendations(p.id).map((r) => (
              <div className="rec" style={{marginBottom: 10}} key={r.title}>
                <span className={'risk ' + r.priority.toLowerCase()}>{r.priority}</span>
                <h4>{r.title}</h4>
                <p>
                  Suggested owner: <b>{r.owner}</b>
                  <br />
                  Expected improvement: {r.expected}
                </p>
                <div className="actions" style={{marginTop: 10}}>
                  <button className="btn" onClick={() => setModal(true)}>
                    Assign
                  </button>
                  <button className="btn" onClick={() => act('Task')}>
                    Create Task
                  </button>
                  <button className="btn" onClick={() => act('Escalation')}>
                    Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project GIS preview */}
          <div className="panel">
            <div className="panelhead">
              <div>
                <div className="paneltitle">Project Geospatial Layer</div>
                <div className="muted">Affected parcels and alignment coordinate preview</div>
              </div>
              <Link className="link" href="/map">
                Open full GIS →
              </Link>
            </div>
            <div
              style={{
                height: 200,
                background: 'var(--panel-subtle)',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid var(--line)',
                borderRadius: 6,
              }}
            >
              <div style={{textAlign: 'center'}}>
                <MapIcon size={34} style={{color: 'var(--blue)'}} />
                <div style={{fontWeight: 700, fontSize: 13, marginTop: 8}}>
                  Spatial Coordinates: {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
                </div>
                <div className="muted">Parcels: {p.land} ha · Affected: {p.families} families</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intervention Modal */}
      {modal && (
        <div className="modalbg">
          <div className="modal">
            <div className="panelhead">
              <h3 style={{margin: 0}}>Assign Intervention Record</h3>
            </div>
            <p className="sub" style={{margin: '6px 0 14px'}}>
              Create an administrative intervention task for <b>{p.name}</b> ({p.projectCode}).
            </p>
            <div className="form">
              <label className="muted">
                Assignee Designation
                <input defaultValue="District Land Acquisition Officer" />
              </label>
              <label className="muted">
                Priority
                <select defaultValue="Critical">
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </label>
              <label className="muted">
                Intervention Instructions
                <textarea
                  rows={4}
                  defaultValue="Fast-track the identified compensation backlog, convene hearing with affected land-owners, and update verification documentation."
                />
              </label>
              <div className="actions" style={{justifyContent: 'flex-end', marginTop: 8}}>
                <button className="btn" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button className="btn primary" onClick={() => act('Intervention')}>
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            background: 'var(--navy)',
            color: '#fff',
            border: '1px solid var(--blue)',
            padding: '12px 18px',
            borderRadius: 6,
            fontSize: 12,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <Check size={14} style={{color: 'var(--green)'}} /> {toast}
        </div>
      )}
    </div>
  );
}
