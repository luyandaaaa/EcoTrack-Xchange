import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Add custom icon styles
const customIconStyles = `
.custom-div-icon {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

// Add styles to document
const markerStyleSheet = document.createElement("style");
markerStyleSheet.type = "text/css";
markerStyleSheet.innerText = customIconStyles;
document.head.appendChild(markerStyleSheet);

// Add custom icon styles
const styles = `
.marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.marker-plastic {
  background: #ef4444;
  clip-path: circle(50% at 50% 50%);
}
.marker-mixed {
  background: #3b82f6;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
.marker-organic {
  background: #22c55e;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}
.marker-default {
  background: #a855f7;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
.current-location {
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
}`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

interface Marker {
  lat: number;
  lng: number;
  popup: string;
  type?: string;
  isCurrentLocation?: boolean;
  icon?: string;
}

interface MapViewProps {
  markers: Marker[];
  center?: [number, number];
  zoom?: number;
}

export function MapView({ markers, center = [-26.2041, 28.0473], zoom = 12 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      let iconClass = 'marker-default';
      if (markerData.isCurrentLocation) {
        iconClass = 'current-location';
      } else if (markerData.type) {
        iconClass = `marker-${markerData.type.toLowerCase()}`;
      }

      const icon = L.divIcon({
        html: `<div class="marker-icon ${iconClass}"></div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([markerData.lat, markerData.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(markerData.popup);
      markersRef.current.push(marker);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers, center, zoom]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
