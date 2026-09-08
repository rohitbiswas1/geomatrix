'use client';

import Link from 'next/link';
import {projects, riskLevel, stages} from '../../lib/data';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {ArrowRight, ExternalLink, Map as MapIcon, FileText} from 'lucide-react';

const dist = [
  {name: 'Critical', value: 12, color: '#ef4444'},
  {name: 'High', value: 27, color: '#f59e0b'},
  {name: 'Medium', value: 43, color: '#eab308'},
  {name: 'Low', value: 46, color: '#22c55e'},
];

const stage = stages.map((s, i) => ({
  name: s.split(' ')[0],
  fullName: s,
  risk: [18, 43, 92, 76, 58, 62, 71][i],
}));

export default function Dashboard() {
  return (
    <div className="page">
      <div className="demo">
        Prototype environment — predictions and metrics shown here are simulated for demonstration.
        No live government-system integration is implied.
      </div>

      <div className="head">
        <div>
          <div className="eyebrow">Command Center</div>
          <h1 className="h1">Land Acquisition AI Command Center</h1>
          <div className="sub">
            Predictive monitoring and early-warning intelligence for national infrastructure projects.
          </div>
        </div>
        <div className="actions">
          <Link className="btn" href="/map">
            <MapIcon size={14} /> Open GIS Map
          </Link>
          <Link className="btn primary" href="/reports">
            <FileText size={14} /> Executive Report
          </Link>
        </div>
      </div>

      {/* 8 KPIs in a balanced 4x2 grid */}
      <div className="grid kpis">
        {[
          ['Total Projects', '128', 'active monitoring'],
          ['Critical Risk', '12', 'requires intervention'],
          ['High Risk', '27', 'elevated delay probability'],
          ['Medium Risk', '43', 'watch queue'],
          ['Low Risk', '46', 'on track'],
          ['Avg Delay Probability', '38.4%', 'across all stages'],
          ['Expected Delay Exposure', '₹286 Cr', 'estimated fiscal risk'],
          ['At-risk Land Parcels', '4,821', 'parcels with active issues'],
        ].map(([title, val, note]) => (
          <div className="kpi" key={title}>
            <div className="label">{title}</div>
            <div className="value">{val}</div>
            <div className="trend">{note}</div>
          </div>
        ))}
      </div>

      <div className="grid two" style={{marginTop: 14}}>
        <div className="panel">
          <div className="panelhead">
            <div>
              <div className="paneltitle">Risk Distribution</div>
              <div className="muted">Portfolio classification (128 projects)</div>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {dist.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              fontSize: 11,
              marginTop: 8,
              flexWrap: 'wrap',
            }}
          >
            {dist.map((d) => (
              <span
                key={d.name}
                style={{display: 'inline-flex', alignItems: 'center', gap: 6}}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: d.color,
                  }}
                />
                {d.name}: <b>{d.value}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelhead">
            <div>
              <div className="paneltitle">Acquisition Stage Risk</div>
              <div className="muted">Simulated portfolio risk index by stage</div>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stage} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}/100 Risk Score`, 'Stage Risk']}
                  labelFormatter={(label: any) => {
                    const found = stage.find((s) => s.name === label);
                    return found?.fullName || label;
                  }}
                />
                <Bar dataKey="risk" fill="var(--blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel" style={{marginTop: 14}}>
        <div className="panelhead">
          <div>
            <div className="paneltitle">Priority Intervention Queue</div>
            <div className="muted">Highest-risk projects requiring administrative action</div>
          </div>
          <Link className="link" href="/projects" style={{display: 'flex', alignItems: 'center', gap: 4}}>
            View all projects <ArrowRight size={13} />
          </Link>
        </div>

        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {[
                  'Project ID',
                  'Project Name',
                  'District',
                  'State',
                  'Stage',
                  'Risk Score',
                  'Delay Probability',
                  'Primary Driver',
                  'Priority',
                  'Action',
                ].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects
                .slice()
                .sort((a, b) => b.risk - a.risk)
                .slice(0, 6)
                .map((p) => (
                  <tr key={p.id}>
                    <td>{p.projectCode}</td>
                    <td>
                      <Link className="link" href={'/projects/' + p.id}>
                        {p.name}
                      </Link>
                    </td>
                    <td>{p.district}</td>
                    <td>{p.state}</td>
                    <td>{p.stage}</td>
                    <td>
                      <span className={'risk ' + riskLevel(p.risk).toLowerCase()}>
                        {p.risk}/100
                      </span>
                    </td>
                    <td>{p.delay}%</td>
                    <td>{p.driver}</td>
                    <td>
                      <span className={'risk ' + riskLevel(p.risk).toLowerCase()}>
                        {riskLevel(p.risk)}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="btn"
                        style={{padding: '4px 8px', fontSize: 10}}
                        href={'/projects/' + p.id}
                      >
                        Inspect <ExternalLink size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
