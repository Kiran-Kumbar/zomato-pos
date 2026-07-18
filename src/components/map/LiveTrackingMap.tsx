"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bikeIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const destIcon = L.divIcon({
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LiveTrackingMap({ 
  currentPos, 
  restaurantPos, 
  userPos 
}: { 
  currentPos: [number, number], 
  restaurantPos: [number, number], 
  userPos: [number, number] 
}) {
  return (
    <MapContainer center={currentPos} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false} touchZoom={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <MapUpdater center={currentPos} />
      <Marker position={restaurantPos} icon={destIcon} />
      <Marker position={userPos} icon={destIcon} />
      <Marker position={currentPos} icon={bikeIcon} />
      <Polyline positions={[restaurantPos, userPos]} pathOptions={{ color: '#94a3b8', weight: 3, dashArray: '5, 10' }} />
    </MapContainer>
  );
}
