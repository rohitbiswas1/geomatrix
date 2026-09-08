'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {projects} from '../../lib/data';
import {TrendingUp, BarChart3, Calendar} from 'lucide-react';

const trend = [1, 2, 3, 4, 5, 6, 7, 8].map((x, i) => ({
  week: 'Week ' + x,
  risk: Math.round((44 - i * 1.2 + (i % 2) * 3) * 10) / 10,
}));

const district = projects.map((p) => ({
  district: p.district.slice(0, 10),
  fullName: p.district,
  risk: p.risk,
}));

export default function Analytics() {
  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Portfolio intelligence</div>
          <h1 className="h1">Predictive Analytics</h1>
          <div className="sub">
            Risk trends, stage duration metrics, leading drivers and completion forecast.
          </div>
        </div>
        <div className="actions">
          <select className="btn" title="Select time interval">
            <option>Monthly aggregate</option>
            <option>Weekly monitoring</option>
            <option>Quarterly review</option>
          </select>
          <button className="btn">
            <Calendar size={13} /> Date Range: Last 60 Days
          </button>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <div className="panelhead">
            <div className="paneltitle">
              <TrendingUp size={16} /> Risk Trend Over Time
            </div>
            <div className="muted">8-week moving average</div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="week" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [`${v}/100`, 'Avg Risk Score']}
                />
                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke="var(--blue)"
                  strokeWidth={2.5}
                  dot={{r: 4, fill: 'var(--blue)'}}
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panelhead">
            <div className="paneltitle">
              <BarChart3 size={16} /> Delay Risk by District
            </div>
            <div className="muted">Simulated cross-district comparison</div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={district} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="district" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(v: any) => [`${v}/100`, 'Risk Index']}
                  labelFormatter={(l: any) => {
                    const f = district.find((d) => d.district === l);
                    return f?.fullName || l;
                  }}
                />
                <Bar dataKey="risk" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid three" style={{marginTop: 14}}>
        {[
          ['Average stage duration', '42 days', 'across active phases'],
          ['Compensation backlog', '1,284 cases', 'awaiting disbursement'],
          ['Project completion forecast', '74% on plan', 'baseline schedule'],
          ['Top delay driver', 'Compensation', '42% contribution'],
          ['Legal dispute trend', '+8.4%', 'quarterly increase'],
          ['At-risk land', '18,420 ha', 'requiring clearance'],
        ].map(([label, val, note]) => (
          <div className="kpi" key={label}>
            <div className="label">{label}</div>
            <div className="value" style={{fontSize: 22}}>
              {val}
            </div>
            <div className="trend">{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
