'use client';

import {useMemo, useState} from 'react';
import Link from 'next/link';
import {Download, Plus, Map as MapIcon, X, Check} from 'lucide-react';
import {projects as initialProjects, riskLevel, stages, type Project} from '../../lib/data';

export default function Projects() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState('All');
  const [state, setState] = useState('All');
  const [stage, setStage] = useState('All');
  const [compensation, setCompensation] = useState('All');
  const [legal, setLegal] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState('');

  // Form state for Add Project
  const [newProject, setNewProject] = useState({
    projectCode: '',
    name: '',
    state: 'West Bengal',
    district: '',
    authority: 'NHAI',
    projectType: 'Highway',
    stage: 'Compensation',
    risk: 65,
    delay: 70,
    driver: 'Pending compensation claims',
  });

  const rows = useMemo(() => {
    return projectList.filter((p) => {
      const matchRisk = risk === 'All' || riskLevel(p.risk) === risk;
      const matchState = state === 'All' || p.state === state;
      const matchStage = stage === 'All' || p.stage === stage;
      const matchComp =
        compensation === 'All'
          ? true
          : compensation === 'Pending'
          ? p.compensation
          : !p.compensation;
      const matchLegal =
        legal === 'All'
          ? true
          : legal === 'Has Legal Cases'
          ? p.legal > 0
          : p.legal === 0;
      const matchSearch =
        `${p.projectCode} ${p.name} ${p.district} ${p.state}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchRisk && matchState && matchStage && matchComp && matchLegal && matchSearch;
    });
  }, [projectList, search, risk, state, stage, compensation, legal]);

  function csv() {
    const h = 'Project ID,Name,State,District,Stage,Risk,Delay Probability,Compensation,Legal Cases\n';
    const b = rows
      .map(
        (p) =>
          `${p.projectCode},"${p.name}",${p.state},${p.district},${p.stage},${p.risk},${p.delay}%,${
            p.compensation ? 'Pending' : 'Progressing'
          },${p.legal}`
      )
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([h + b], {type: 'text/csv'}));
    a.download = 'geomatrix-projects.csv';
    a.click();
  }

  function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.projectCode.trim()) return;

    const id = 'p' + (projectList.length + 1);
    const created: Project = {
      id,
      projectCode: newProject.projectCode.trim(),
      name: newProject.name.trim(),
      state: newProject.state,
      district: newProject.district.trim() || 'Headquarters',
      authority: newProject.authority,
      projectType: newProject.projectType,
      lat: 23.5 + Math.random() * 2,
      lng: 85.0 + Math.random() * 4,
      stage: newProject.stage,
      risk: Number(newProject.risk),
      delay: Number(newProject.delay),
      delayDays: Math.round(Number(newProject.risk) * 0.55),
      confidence: 88,
      driver: newProject.driver,
      land: 250,
      families: 110,
      overdue: 12,
      compensation: true,
      legal: 3,
      docs: 8,
      approval: true,
      status: Number(newProject.risk) >= 75 ? 'Intervention Required' : 'At Risk',
    };

    setProjectList((prev) => [created, ...prev]);
    setShowAddModal(false);
    setToast(`Project "${created.name}" created successfully`);
    setTimeout(() => setToast(''), 3000);

    // Reset form
    setNewProject({
      projectCode: '',
      name: '',
      state: 'West Bengal',
      district: '',
      authority: 'NHAI',
      projectType: 'Highway',
      stage: 'Compensation',
      risk: 65,
      delay: 70,
      driver: 'Pending compensation claims',
    });
  }

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Portfolio</div>
          <h1 className="h1">Projects</h1>
          <div className="sub">
            Monitor acquisition stage, risk, compensation and legal exposure across India.
          </div>
        </div>
        <div className="actions">
          <button className="btn" onClick={csv}>
            <Download size={13} /> Export CSV
          </button>
          <button className="btn" onClick={() => setShowAddModal(true)}>
            <Plus size={13} /> Add Project
          </button>
          <Link className="btn primary" href="/map">
            <MapIcon size={13} /> View Map
          </Link>
        </div>
      </div>

      <div className="panel">
        <div className="filters">
          <input
            placeholder="Search project ID, name, district…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{minWidth: 200}}
          />

          <select value={state} onChange={(e) => setState(e.target.value)} title="Filter by state">
            <option value="All">All States</option>
            {[...new Set(projectList.map((p) => p.state))].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select value={risk} onChange={(e) => setRisk(e.target.value)} title="Filter by risk">
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select value={stage} onChange={(e) => setStage(e.target.value)} title="Filter by stage">
            <option value="All">All Acquisition Stages</option>
            {stages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={compensation}
            onChange={(e) => setCompensation(e.target.value)}
            title="Filter by compensation status"
          >
            <option value="All">All Compensation</option>
            <option value="Pending">Compensation Pending</option>
            <option value="Progressing">Compensation Progressing</option>
          </select>

          <select
            value={legal}
            onChange={(e) => setLegal(e.target.value)}
            title="Filter by legal status"
          >
            <option value="All">All Legal Status</option>
            <option value="Has Legal Cases">Has Legal Cases</option>
            <option value="No Legal Cases">No Legal Cases</option>
          </select>

          {(search || risk !== 'All' || state !== 'All' || stage !== 'All' || compensation !== 'All' || legal !== 'All') && (
            <button
              className="btn"
              onClick={() => {
                setSearch('');
                setRisk('All');
                setState('All');
                setStage('All');
                setCompensation('All');
                setLegal('All');
              }}
              style={{padding: '8px 10px'}}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {[
                  'Project ID',
                  'Project Name',
                  'State',
                  'District',
                  'Stage',
                  'Risk',
                  'Delay',
                  'Compensation',
                  'Legal',
                  'Status',
                ].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{textAlign: 'center', padding: 24}} className="muted">
                    No matching projects found with the active filters.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.projectCode}</td>
                    <td>
                      <Link className="link" href={'/projects/' + p.id}>
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.state}</td>
                    <td>{p.district}</td>
                    <td>{p.stage}</td>
                    <td>
                      <span className={'risk ' + riskLevel(p.risk).toLowerCase()}>
                        {riskLevel(p.risk)} · {p.risk}
                      </span>
                    </td>
                    <td>{p.delay}%</td>
                    <td>{p.compensation ? 'Pending' : 'Progressing'}</td>
                    <td>{p.legal} open</td>
                    <td>{p.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="modalbg">
          <div className="modal">
            <div className="panelhead">
              <h3 style={{margin: 0}}>Add Infrastructure Project</h3>
              <button
                className="btn"
                onClick={() => setShowAddModal(false)}
                style={{padding: 4}}
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>
            <p className="sub" style={{marginTop: 4, marginBottom: 14}}>
              Enter project details to calculate risk and simulate delay exposure.
            </p>

            <form onSubmit={handleCreateProject} className="form">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                <label className="muted">
                  Project Code *
                  <input
                    required
                    placeholder="e.g. NH-204-OD-09"
                    value={newProject.projectCode}
                    onChange={(e) =>
                      setNewProject((p) => ({...p, projectCode: e.target.value}))
                    }
                  />
                </label>
                <label className="muted">
                  Authority
                  <select
                    value={newProject.authority}
                    onChange={(e) =>
                      setNewProject((p) => ({...p, authority: e.target.value}))
                    }
                  >
                    <option>NHAI</option>
                    <option>Indian Railways</option>
                    <option>MoRTH</option>
                    <option>NICDC</option>
                    <option>AAI</option>
                    <option>State PWD</option>
                  </select>
                </label>
              </div>

              <label className="muted">
                Project Name *
                <input
                  required
                  placeholder="e.g. Coastal Expressway Phase III"
                  value={newProject.name}
                  onChange={(e) => setNewProject((p) => ({...p, name: e.target.value}))}
                />
              </label>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                <label className="muted">
                  State
                  <select
                    value={newProject.state}
                    onChange={(e) => setNewProject((p) => ({...p, state: e.target.value}))}
                  >
                    <option>West Bengal</option>
                    <option>Odisha</option>
                    <option>Bihar</option>
                    <option>Jharkhand</option>
                    <option>Uttar Pradesh</option>
                    <option>Assam</option>
                    <option>Maharashtra</option>
                    <option>Gujarat</option>
                  </select>
                </label>
                <label className="muted">
                  District
                  <input
                    placeholder="e.g. Balasore"
                    value={newProject.district}
                    onChange={(e) =>
                      setNewProject((p) => ({...p, district: e.target.value}))
                    }
                  />
                </label>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                <label className="muted">
                  Current Stage
                  <select
                    value={newProject.stage}
                    onChange={(e) => setNewProject((p) => ({...p, stage: e.target.value}))}
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="muted">
                  Initial Risk Score (1-100)
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newProject.risk}
                    onChange={(e) =>
                      setNewProject((p) => ({
                        ...p,
                        risk: Number(e.target.value),
                        delay: Math.min(99, Math.round(Number(e.target.value) * 1.05)),
                      }))
                    }
                  />
                </label>
              </div>

              <label className="muted">
                Primary Bottleneck / Driver
                <input
                  placeholder="e.g. Pending compensation claims"
                  value={newProject.driver}
                  onChange={(e) => setNewProject((p) => ({...p, driver: e.target.value}))}
                />
              </label>

              <div className="actions" style={{justifyContent: 'flex-end', marginTop: 8}}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <Check size={15} style={{color: 'var(--green)'}} /> {toast}
        </div>
      )}
    </div>
  );
}
