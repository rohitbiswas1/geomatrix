'use client';

import {FileText, Download, Printer, CheckCircle} from 'lucide-react';
import {useState} from 'react';

export default function Reports() {
  const [downloadToast, setDownloadToast] = useState('');
  const types = [
    'Executive Risk Summary',
    'District Risk Report',
    'Project Risk Report',
    'Delay Driver Report',
    'Intervention Report',
  ];

  function print() {
    window.print();
  }

  function downloadCsv(title: string) {
    setDownloadToast(`Generated CSV for ${title}`);
    setTimeout(() => setDownloadToast(''), 2500);
  }

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Decision reports</div>
          <h1 className="h1">Reports & Executive Briefs</h1>
          <div className="sub">
            Generate printable risk briefs and automated summaries from the portfolio.
          </div>
        </div>
        <button className="btn primary" onClick={print}>
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      <div className="grid cards">
        {types.map((t) => (
          <div className="panel" key={t} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <div>
              <div style={{color: 'var(--blue)', marginBottom: 8}}>
                <FileText size={24} />
              </div>
              <h3 style={{fontSize: 14, margin: '4px 0 8px', color: 'var(--ink)'}}>{t}</h3>
              <p className="sub" style={{lineHeight: 1.5, margin: 0}}>
                Risk distribution, top delay drivers, prioritized interventions and portfolio fiscal exposure.
              </p>
            </div>
            <div className="actions" style={{marginTop: 16}}>
              <button className="btn primary" onClick={print} style={{padding: '6px 12px'}}>
                Preview PDF
              </button>
              <button className="btn" onClick={() => downloadCsv(t)} style={{padding: '6px 12px'}}>
                <Download size={12} /> CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{marginTop: 18}}>
        <div className="panelhead">
          <div>
            <div className="eyebrow">Printable Report Preview</div>
            <h2 style={{margin: '6px 0', fontSize: 20}}>National Land Acquisition Risk Overview</h2>
            <div className="sub">
              Reporting period: 01 Aug 2026 – 07 Sep 2026 · Data classification: DEMO / SIMULATED
            </div>
          </div>
          <button className="btn" onClick={print}>
            <Printer size={13} /> Print Document
          </button>
        </div>

        <hr style={{borderColor: 'var(--line)', margin: '14px 0'}} />

        <div className="grid three" style={{margin: '16px 0'}}>
          <div className="kpi">
            <div className="label">Projects Monitored</div>
            <div className="value">128</div>
          </div>
          <div className="kpi">
            <div className="label">Critical + High Risk</div>
            <div className="value" style={{color: 'var(--red)'}}>39</div>
          </div>
          <div className="kpi">
            <div className="label">Delay Fiscal Exposure</div>
            <div className="value" style={{color: 'var(--amber)'}}>₹286 Cr</div>
          </div>
        </div>

        <h3 style={{fontSize: 15, margin: '20px 0 8px'}}>Executive Assessment</h3>
        <p className="sub" style={{lineHeight: 1.7, fontSize: 13}}>
          The infrastructure portfolio displays a concentrated cluster of high-risk acquisition stages.
          Compensation backlogs (42% relative weight), legal disputes, and documentation gaps form the
          primary early warning triggers. Targeted district-level administrative intervention in the
          earliest stages is projected to recover approximately 18–24% of projected delays.
        </p>
        <p className="footer-note">
          This report is designed for decision support under Problem Statement 26017 (SIH 2026).
        </p>
      </div>

      {downloadToast && (
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
          }}
        >
          <CheckCircle size={14} style={{color: 'var(--green)'}} /> {downloadToast}
        </div>
      )}
    </div>
  );
}
