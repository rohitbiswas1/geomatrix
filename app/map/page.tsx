'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { projects, riskLevel } from '../../lib/data';
import { Layers, Search, SlidersHorizontal } from 'lucide-react';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

type LeafletMap = any;
type LeafletMarker = any;

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.L) return resolve(w.L);
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(w.L));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(w.L);
    script.onerror = () => reject(new Error('Unable to load Leaflet'));
    document.body.appendChild(script);
  });
}

export default function MapPage() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapMode, setMapMode] = useState<'mapbox' | 'osm' | 'failed'>('osm');

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!ref.current || mapRef.current) return;
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (token) {
          const mapboxgl = await import('mapbox-gl');
          if (cancelled || !ref.current) return;
          mapboxgl.default.accessToken = token;
          const map = new mapboxgl.default.Map({ container: ref.current, style: 'mapbox://styles/mapbox/streets-v12', center: [84.5, 24.8], zoom: 4.7 });
          map.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
          map.addControl(new mapboxgl.default.FullscreenControl(), 'top-right');
          projects.forEach((p) => {
            const el = document.createElement('div');
            el.style.width = '15px'; el.style.height = '15px'; el.style.borderRadius = '50%'; el.style.border = '2px solid white';
            el.style.background = p.risk >= 75 ? '#c43d3d' : p.risk >= 50 ? '#d8872c' : p.risk >= 25 ? '#d7a20c' : '#16845b';
            el.style.boxShadow = '0 1px 5px #0006'; el.onclick = () => setSelected(p);
            new mapboxgl.default.Marker(el).setLngLat([p.lng, p.lat]).addTo(map);
          });
          mapRef.current = map; setMapMode('mapbox'); setMapReady(true); return;
        }

        const L = await loadLeaflet();
        if (cancelled || !ref.current) return;
        const map = L.map(ref.current, { zoomControl: true }).setView([22.5, 82.5], 4.8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        markersRef.current = projects.map((p) => {
          const color = p.risk >= 75 ? '#c43d3d' : p.risk >= 50 ? '#d8872c' : p.risk >= 25 ? '#d7a20c' : '#16845b';
          const icon = L.divIcon({ className: 'geomatrix-marker', html: `<span style="display:block;width:15px;height:15px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 5px #0006"></span>`, iconSize: [15, 15], iconAnchor: [7, 7] });
          const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
          marker.on('click', () => setSelected(p));
          return marker;
        });
        mapRef.current = map; setMapMode('osm'); setMapReady(true);
      } catch { if (!cancelled) setMapMode('failed'); }
    }
    init();
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove?.()); markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove?.(); mapRef.current = null; }
    };
  }, []);

  return (
    <div className="page"><div className="maplayout">
      <section className="mapbox"><div ref={ref} className="mapcanvas" />
        {!mapReady && mapMode !== 'failed' && <div className="mapfallback"><div><Layers size={40}/><h3>Loading GIS map…</h3><div className="sub">Preparing the interactive project-risk map.</div></div></div>}
        {mapMode === 'failed' && <div className="mapfallback"><div><Layers size={40}/><h3>Map temporarily unavailable</h3><div className="sub">Refresh the page to retry the GIS layer.</div></div></div>}
        {selected && <div style={{position:'absolute',left:18,bottom:18,width:290,background:'#fff',border:'1px solid var(--line)',padding:14,borderRadius:6,boxShadow:'0 8px 25px #0002',zIndex:1000}}><div className="eyebrow">Project preview</div><h3 style={{fontSize:14,margin:'6px 0'}}>{selected.name}</h3><div className="sub">{selected.state} · {selected.district}</div><div style={{display:'flex',justifyContent:'space-between',margin:'12px 0'}}><span className={'risk '+riskLevel(selected.risk).toLowerCase()}>{riskLevel(selected.risk)} {selected.risk}/100</span><b>{selected.delay}% delay</b></div><div className="muted">Main driver: {selected.driver}</div><Link className="btn primary" style={{display:'inline-block',marginTop:12}} href={'/projects/'+selected.id}>Open Project</Link></div>}
        <div style={{position:'absolute',left:14,top:14,zIndex:900,background:'#fff',border:'1px solid var(--line)',borderRadius:5,padding:'6px 9px',fontSize:11,fontWeight:600,boxShadow:'0 2px 8px #0001'}}>{mapMode === 'mapbox' ? 'Mapbox GIS' : mapMode === 'osm' ? 'OpenStreetMap GIS' : 'GIS'}</div>
      </section>
      <aside className="mapside"><div className="eyebrow">GIS Risk Intelligence</div><h2 style={{fontSize:20,margin:'5px 0'}}>Spatial risk overview</h2><div className="search" style={{maxWidth:'none',margin:'14px 0'}}><Search size={14}/><input placeholder="Search map projects…"/></div><div className="mapmetric"><div><div className="muted">Total projects</div><b>128</b></div><div><div className="muted">Critical</div><b>12</b></div><div><div className="muted">High-risk</div><b>27</b></div><div><div className="muted">Affected area</div><b>18.4k ha</b></div></div><div className="panel" style={{padding:12}}><div className="paneltitle"><SlidersHorizontal size={13}/> Filters</div><div className="form" style={{marginTop:10}}><select><option>All States</option></select><select><option>All Districts</option></select><select><option>All Risk Levels</option></select><select><option>All Acquisition Stages</option></select><select><option>All Project Types</option></select></div></div><div style={{marginTop:18}}><div className="paneltitle">Layers</div><div className="legend"><div className="legendrow"><span className="legenddot" style={{background:'#c43d3d'}}/> Critical projects</div><div className="legendrow"><span className="legenddot" style={{background:'#d8872c'}}/> High-risk projects</div><div className="legendrow"><span className="legenddot" style={{background:'#d7a20c'}}/> Medium-risk projects</div><div className="legendrow"><span className="legenddot" style={{background:'#16845b'}}/> Low-risk projects</div></div></div><p className="footer-note">GIS works without a Mapbox token using OpenStreetMap. When NEXT_PUBLIC_MAPBOX_TOKEN is configured, Geomatrix automatically uses Mapbox instead.</p></aside>
    </div></div>
  );
}
