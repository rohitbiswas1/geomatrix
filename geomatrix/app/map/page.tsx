'use client';

import {useEffect, useRef, useState, useMemo} from 'react';
import Link from 'next/link';
import {projects, riskLevel, stages} from '../../lib/data';
import {Layers, Search, SlidersHorizontal, MapPin, X, ExternalLink} from 'lucide-react';
import {useTheme} from '../../components/ThemeProvider';

declare global {
  interface Window {
    google?: any;
  }
}

const darkMapStyles = [
  {elementType: 'geometry', stylers: [{color: '#182438'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#94a3b8'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#0e1726'}]},
  {featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{color: '#334e68'}]},
  {featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{color: '#334e68'}]},
  {featureType: 'landscape.natural', elementType: 'geometry', stylers: [{color: '#131e30'}]},
  {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#1a293d'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#263852'}]},
  {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#64748b'}]},
  {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#2d4464'}]},
  {featureType: 'transit', elementType: 'labels.text.fill', stylers: [{color: '#64748b'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#0b1320'}]},
  {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#475569'}]},
];

export default function MapPage() {
  const ref = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const {theme} = useTheme();

  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [mapLoaded, setMapLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        `${p.name} ${p.district} ${p.state} ${p.projectCode}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchState = stateFilter === 'All' || p.state === stateFilter;
      const matchRisk = riskFilter === 'All' || riskLevel(p.risk) === riskFilter;
      const matchStage = stageFilter === 'All' || p.stage === stageFilter;
      return matchSearch && matchState && matchRisk && matchStage;
    });
  }, [search, stateFilter, riskFilter, stageFilter]);

  // Initialize or update Google Map
  useEffect(() => {
    if (!ref.current || !apiKey) return;

    const initialize = () => {
      if (!ref.current || !window.google?.maps) return;

      if (!mapInstanceRef.current) {
        const map = new window.google.maps.Map(ref.current, {
          center: {lat: 24.5, lng: 85.0},
          zoom: 5.2,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: theme === 'dark' ? darkMapStyles : [],
        });
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } else {
        mapInstanceRef.current.setOptions({
          styles: theme === 'dark' ? darkMapStyles : [],
        });
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Render filtered markers
      filteredProjects.forEach((p) => {
        const marker = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: {lat: p.lat, lng: p.lng},
          title: p.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor:
              p.risk >= 75
                ? '#c43d3d'
                : p.risk >= 50
                ? '#d8872c'
                : p.risk >= 25
                ? '#d7a20c'
                : '#16845b',
            fillOpacity: 0.95,
            strokeColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            strokeWeight: 2,
          },
        });
        marker.addListener('click', () => setSelected(p));
        markersRef.current.push(marker);
      });
    };

    if (window.google?.maps) {
      initialize();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey);
    script.async = true;
    script.onload = initialize;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [apiKey, filteredProjects, theme]);

  return (
    <div className="page" style={{paddingBottom: 0}}>
      <div className="maplayout">
        <section className="mapbox">
          <div ref={ref} className="mapcanvas" />

          {/* Fallback interactive canvas if Google Maps is not available or still loading */}
          {(!apiKey || !mapLoaded) && (
            <div className="mapfallback">
              <div style={{maxWidth: 440, padding: 24, textAlign: 'center'}}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--blue)',
                  }}
                >
                  <Layers size={28} />
                </div>
                <h3 style={{fontSize: 16, margin: '0 0 8px', color: 'var(--ink)'}}>
                  Interactive Spatial Vector Layer
                </h3>
                <p className="sub" style={{lineHeight: 1.6, marginBottom: 16}}>
                  Displaying simulated infrastructure parcel coordinates. Select any project marker
                  from the right panel or search above to preview geospatial risk.
                </p>

                {/* Quick Interactive Project Pins */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                  }}
                >
                  {filteredProjects.map((p) => (
                    <button
                      key={p.id}
                      className={`btn ${selected?.id === p.id ? 'primary' : ''}`}
                      onClick={() => setSelected(p)}
                      style={{fontSize: 11}}
                    >
                      <MapPin
                        size={12}
                        color={
                          p.risk >= 75
                            ? '#ef4444'
                            : p.risk >= 50
                            ? '#f59e0b'
                            : '#22c55e'
                        }
                      />
                      {p.district} ({p.risk})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Project Card Floating on Map */}
          {selected && (
            <div
              style={{
                position: 'absolute',
                left: 18,
                bottom: 18,
                width: 320,
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                padding: 16,
                borderRadius: 8,
                boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div className="eyebrow">Project preview</div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                  aria-label="Close preview"
                >
                  <X size={14} />
                </button>
              </div>

              <h3 style={{fontSize: 14, margin: '6px 0', color: 'var(--ink)'}}>
                {selected.name}
              </h3>
              <div className="sub">
                {selected.state} · {selected.district} · {selected.projectCode}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '12px 0',
                }}
              >
                <span className={'risk ' + riskLevel(selected.risk).toLowerCase()}>
                  {riskLevel(selected.risk)} · {selected.risk}/100
                </span>
                <b style={{fontSize: 14, color: 'var(--ink)'}}>{selected.delay}% delay prob</b>
              </div>

              <div className="muted" style={{fontSize: 11, marginBottom: 12}}>
                Stage: <b>{selected.stage}</b>
                <br />
                Main driver: {selected.driver}
              </div>

              <Link
                className="btn primary"
                style={{width: '100%', justifyContent: 'center'}}
                href={'/projects/' + selected.id}
              >
                Open Project Intelligence <ExternalLink size={12} />
              </Link>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="mapside">
          <div className="eyebrow">GIS Risk Intelligence</div>
          <h2 style={{fontSize: 20, margin: '5px 0', color: 'var(--ink)'}}>
            Spatial risk overview
          </h2>

          <div className="search" style={{maxWidth: 'none', margin: '14px 0'}}>
            <Search size={14} />
            <input
              placeholder="Search map projects, districts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mapmetric">
            <div>
              <div className="muted">Total in view</div>
              <b>{filteredProjects.length}</b>
            </div>
            <div>
              <div className="muted">Critical</div>
              <b style={{color: 'var(--red)'}}>
                {filteredProjects.filter((p) => p.risk >= 75).length}
              </b>
            </div>
            <div>
              <div className="muted">High-risk</div>
              <b style={{color: 'var(--amber)'}}>
                {filteredProjects.filter((p) => p.risk >= 50 && p.risk < 75).length}
              </b>
            </div>
            <div>
              <div className="muted">Affected area</div>
              <b>18.4k ha</b>
            </div>
          </div>

          <div className="panel" style={{padding: 14}}>
            <div className="paneltitle">
              <SlidersHorizontal size={13} /> Spatial Filters
            </div>
            <div className="form" style={{marginTop: 10}}>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                title="Filter state"
              >
                <option value="All">All States</option>
                {[...new Set(projects.map((p) => p.state))].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                title="Filter risk level"
              >
                <option value="All">All Risk Levels</option>
                <option value="Critical">Critical (≥75)</option>
                <option value="High">High (50–74)</option>
                <option value="Medium">Medium (25–49)</option>
                <option value="Low">Low (&lt;25)</option>
              </select>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                title="Filter stage"
              >
                <option value="All">All Acquisition Stages</option>
                {stages.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{marginTop: 18}}>
            <div className="paneltitle">Risk Layers</div>
            <div className="legend">
              <div className="legendrow">
                <span className="legenddot" style={{background: '#c43d3d'}} /> Critical projects
                (≥75)
              </div>
              <div className="legendrow">
                <span className="legenddot" style={{background: '#d8872c'}} /> High-risk projects
                (50–74)
              </div>
              <div className="legendrow">
                <span className="legenddot" style={{background: '#d7a20c'}} /> Medium-risk projects
                (25–49)
              </div>
              <div className="legendrow">
                <span className="legenddot" style={{background: '#16845b'}} /> Low-risk projects
                (&lt;25)
              </div>
            </div>
          </div>

          <p className="footer-note">
            Risk Heatmap · Project Markers · Acquisition Areas · Infrastructure Layer ·
            Street/Satellite styling configured with theme synchronization.
          </p>
        </aside>
      </div>
    </div>
  );
}
