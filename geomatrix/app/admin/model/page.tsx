'use client';

import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import {Activity, Cpu} from 'lucide-react';

const features = [
  {f: 'Compensation', v: 31},
  {f: 'Legal disputes', v: 24},
  {f: 'Approvals', v: 18},
  {f: 'Documents', v: 14},
  {f: 'R&R Backlog', v: 9},
];

export default function Model() {
  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Administrator Only</div>
          <h1 className="h1">AI Model Monitoring & Governance</h1>
          <div className="sub">
            Operational surveillance and performance metrics for the simulated delay risk engine.
          </div>
        </div>
        <span className="risk low">Service Healthy</span>
      </div>

      <div className="demo">
        Prototype / simulated validation metrics — not trained or validated on official government data.
      </div>

      <div className="grid kpis">
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
            <div className="trend">validation baseline</div>
          </div>
        ))}
      </div>

      <div className="grid two" style={{marginTop: 14}}>
        <div className="panel">
          <div className="panelhead">
            <div className="paneltitle">
              <Cpu size={16} /> Feature Importance
            </div>
            <div className="muted">Global SHAP feature attribution (%)</div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={features}
                layout="vertical"
                margin={{top: 10, right: 20, left: 10, bottom: 0}}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" fontSize={10} tickLine={false} />
                <YAxis dataKey="f" type="category" width={110} fontSize={10} tickLine={false} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Attribution Weight']} />
                <Bar dataKey="v" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panelhead">
            <div className="paneltitle">
              <Activity size={16} /> Operational Diagnostics
            </div>
            <div className="muted">Inference pipeline status</div>
          </div>
          <div className="grid two" style={{marginTop: 14}}>
            {[
              ['Health Status', 'Within optimal threshold'],
              ['Data Freshness', 'Updated 2 days ago'],
              ['Model Drift', '0.04 (Below 0.15 threshold)'],
              ['Calibration Score', '0.91 Brier-index'],
              ['Median Latency', '84 ms per inference'],
              ['Inference Mode', 'Deterministic synthetic model'],
            ].map(([label, val]) => (
              <div className="rec" key={label}>
                <b style={{fontSize: 11}}>{label}</b>
                <p style={{margin: '4px 0 0'}}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
