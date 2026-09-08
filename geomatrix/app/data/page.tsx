'use client';

import {useState} from 'react';
import {Upload, CheckCircle2, FileCheck, Layers} from 'lucide-react';

type UploadResult = {name: string; status: 'Uploading' | 'Uploaded' | 'Failed'};

export default function Data() {
  const [files, setFiles] = useState<UploadResult[]>([]);
  const [error, setError] = useState('');

  async function add(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    setError('');
    setFiles((current) => [
      ...current,
      ...selected.map((file) => ({name: file.name, status: 'Uploading' as const})),
    ]);

    const results = await Promise.all(
      selected.map(async (file) => {
        const form = new FormData();
        form.append('file', file);
        try {
          const response = await fetch('/api/documents/upload', {method: 'POST', body: form});
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Upload failed.');
          return {name: file.name, status: 'Uploaded' as const};
        } catch (exception) {
          setError(exception instanceof Error ? exception.message : 'Upload failed.');
          return {name: file.name, status: 'Failed' as const};
        }
      })
    );

    setFiles((current) =>
      current.map((item) => {
        const result = results.find(
          (candidate) => candidate.name === item.name && item.status === 'Uploading'
        );
        return result || item;
      })
    );
  }

  return (
    <div className="page">
      <div className="head">
        <div>
          <div className="eyebrow">Data operations</div>
          <h1 className="h1">Data Management & Ingestion</h1>
          <div className="sub">
            Validate project, parcel, compensation, legal and document datasets before prediction.
          </div>
        </div>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <div className="grid two">
        <div className="panel">
          <div className="paneltitle">Upload Data / Records</div>
          <div className="form" style={{marginTop: 14}}>
            <label
              className="btn"
              style={{
                textAlign: 'center',
                padding: 26,
                borderStyle: 'dashed',
                borderWidth: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'var(--panel-subtle)',
                cursor: 'pointer',
              }}
            >
              <Upload size={24} style={{color: 'var(--blue)'}} />
              <div>
                <b>Click to upload or drag files</b>
                <div className="muted" style={{marginTop: 4}}>
                  Supports CSV, XLSX, GeoJSON, Shapefile, PDF
                </div>
              </div>
              <input
                type="file"
                multiple
                accept=".csv,.xlsx,.geojson,.json,.pdf"
                style={{display: 'none'}}
                onChange={add}
              />
            </label>
          </div>

          {files.length > 0 && (
            <div style={{marginTop: 14}}>
              <div className="paneltitle" style={{fontSize: 12}}>
                Upload Status
              </div>
              {files.map((file, index) => (
                <div className="stage" key={file.name + index}>
                  <CheckCircle2
                    size={16}
                    style={{
                      color:
                        file.status === 'Uploaded'
                          ? 'var(--green)'
                          : file.status === 'Uploading'
                          ? 'var(--blue)'
                          : 'var(--red)',
                    }}
                  />
                  <b>{file.name}</b>
                  <span className="muted">{file.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="paneltitle">Data Quality & Validation Metrics</div>
          <div className="grid three" style={{marginTop: 14}}>
            {[
              ['Records Ingested', '12,482'],
              ['Missing Fields', '184'],
              ['Duplicates Filtered', '27'],
              ['Coordinate Checks', '6 flagged'],
              ['Validation Score', '98.4%'],
              ['Inference Ready', '12,265'],
            ].map(([label, val]) => (
              <div className="kpi" key={label}>
                <div className="label">{label}</div>
                <div className="value" style={{fontSize: 18}}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" style={{marginTop: 14}}>
        <div className="paneltitle">Feature Engineering & Processing Pipeline</div>
        <div className="grid" style={{gridTemplateColumns: 'repeat(5, 1fr)', marginTop: 16}}>
          {['Uploaded', 'Validated', 'Cleaned', 'Feature Engineered', 'Ready for Prediction'].map(
            (x, i) => (
              <div
                className="panel"
                key={x}
                style={{
                  textAlign: 'center',
                  background: i < 4 ? 'var(--panel-subtle)' : 'var(--risk-low-bg)',
                  borderColor: i < 4 ? 'var(--line)' : 'var(--green)',
                  color: i < 4 ? 'var(--ink)' : 'var(--risk-low-text)',
                  padding: 14,
                }}
              >
                <div style={{fontWeight: 800, fontSize: 14}}>{i + 1}</div>
                <div style={{fontSize: 11, marginTop: 6, fontWeight: 500}}>{x}</div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="panel" style={{marginTop: 14}}>
        <div className="paneltitle">Document / NLP Intelligence</div>
        <p className="sub" style={{lineHeight: 1.6, margin: '8px 0 14px'}}>
          Prototype extraction interface for land records, compensation awards, court filings,
          inter-departmental approval notes and rehabilitation schedules.
        </p>
        <div className="grid three">
          <div className="rec">
            <b>Synthetic OCR/NLP</b>
            <p>
              Simulates extraction of document types, Gazette reference numbers, land parcel
              identifiers, disputed boundaries, compensation amounts and hearing dates.
            </p>
          </div>
          <div className="rec">
            <b>Target Architecture</b>
            <p>
              PaddleOCR/Tesseract → Legal BERT / RoBERTa NER → Stage classifier → Real-time
              feature contribution scoring.
            </p>
          </div>
          <div className="rec">
            <b>Security & Governance</b>
            <p>
              Data residency compliant with government protocols; encrypted payload transit and
              granular role-based access controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
