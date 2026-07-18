"use client";

import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const ZONES = [
  { id: 1, name: 'Koramangala Core', color: '#6366f1', coords: [[12.935, 77.615], [12.945, 77.615], [12.945, 77.625], [12.935, 77.625]] },
  { id: 2, name: 'HSR Layout', color: '#10b981', coords: [[12.910, 77.635], [12.920, 77.635], [12.920, 77.645], [12.910, 77.645]] },
];

export default function AdminZonesMap() {
  return (
    <MapContainer center={[12.925, 77.625]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {ZONES.map(zone => (
        <Polygon key={zone.id} positions={zone.coords as any} pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 }}>
          <Popup>
            <div className="font-bold text-gray-900">{zone.name}</div>
            <div className="text-xs text-gray-500">Active Service Zone</div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
