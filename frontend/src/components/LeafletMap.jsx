import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { orsAPI } from '../api/client';
import './LeafletMap.css';

// Fix Leaflet default icon broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored icons
const makeIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const ambulanceIcon = makeIcon('red');
const hospitalIcon  = makeIcon('blue');
const bloodBankIcon = makeIcon('violet');

// Component to smoothly fly to ambulance position
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 14, { duration: 1.2 });
  }, [position, map]);
  return null;
}

export default function LeafletMap({ ambulancePos, hospitals, bloodBanks, selectedHospital }) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo]     = useState(null);
  const defaultCenter                  = [17.385, 78.4867]; // Hyderabad

  // Fetch route from ORS whenever selected hospital changes
  useEffect(() => {
    if (!ambulancePos || !selectedHospital?.latitude) {
      setRouteCoords([]);
      return;
    }
    orsAPI.getRoute(
      ambulancePos.lng, ambulancePos.lat,
      selectedHospital.longitude, selectedHospital.latitude
    ).then(data => {
      const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      const props  = data.features[0].properties.segments[0];
      setRouteCoords(coords);
      setRouteInfo({
        distance: (props.distance / 1000).toFixed(1),
        duration: Math.round(props.duration / 60),
      });
    }).catch(() => setRouteCoords([]));
  }, [ambulancePos, selectedHospital]);

  const center = ambulancePos ? [ambulancePos.lat, ambulancePos.lng] : defaultCenter;

  return (
    <div className="leaflet-card card">
      <div className="card-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1"/>
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
          <path d="M8 2v2M8 12v2M2 8h2M12 8h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        Live Ambulance Tracking
        {routeInfo && (
          <span className="route-info">
            {routeInfo.distance} km · {routeInfo.duration} min
          </span>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '300px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap tiles — completely free, no key needed */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {ambulancePos && (
          <>
            <FlyToLocation position={[ambulancePos.lat, ambulancePos.lng]} />
            <Marker position={[ambulancePos.lat, ambulancePos.lng]} icon={ambulanceIcon}>
              <Popup><strong>Ambulance</strong><br/>GPS: {ambulancePos.lat.toFixed(4)}, {ambulancePos.lng.toFixed(4)}</Popup>
            </Marker>
          </>
        )}

        {hospitals.map(h => h.latitude && (
          <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hospitalIcon}>
            <Popup>
              <strong>{h.name}</strong><br/>
              {h.beds_available} beds · {h.icu_available ? 'ICU ✓' : 'No ICU'}<br/>
              {h.travel_time_min} min ETA
            </Popup>
          </Marker>
        ))}

        {bloodBanks.map(bb => bb.latitude && (
          <Marker key={bb.id} position={[bb.latitude, bb.longitude]} icon={bloodBankIcon}>
            <Popup><strong>{bb.name}</strong><br/>{bb.address}</Popup>
          </Marker>
        ))}

        {/* ORS route drawn as red polyline */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#E24B4A" weight={4} opacity={0.8} dashArray="8,4" />
        )}
      </MapContainer>

      <div className="map-legend">
        <div className="legend-item"><div className="legend-dot" style={{background:'#E24B4A'}}/> Ambulance</div>
        <div className="legend-item"><div className="legend-dot" style={{background:'#378ADD'}}/> Hospital</div>
        <div className="legend-item"><div className="legend-dot" style={{background:'#8B5CF6'}}/> Blood Bank</div>
        <div className="legend-item"><div className="legend-dot" style={{background:'#E24B4A',borderRadius:'0',height:'3px',width:'14px'}}/> Route</div>
      </div>
    </div>
  );
}