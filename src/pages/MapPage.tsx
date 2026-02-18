import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { Search, LocateFixed, Navigation } from "lucide-react";

// Маркер иконкаларын стандартташтыруу
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Маршрутту башкаруу жана Картаны жылдыруу компоненти
const MapController = ({ myPos, targetPos }: { myPos: L.LatLng | null, targetPos: L.LatLng | null }) => {
  const map = useMap();
  const routingRef = useRef<any>(null);

  // Сиздин локацияңызга фокусталуу (бир жолу)
  useEffect(() => {
    if (myPos && !targetPos) {
      map.flyTo(myPos, 15, { duration: 1.5 });
    }
  }, [myPos, map]);

  // Маршрутту чийүү
  useEffect(() => {
    if (!map || !myPos || !targetPos) return;
    
    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [myPos, targetPos],
      lineOptions: { 
        styles: [{ color: "#007AFF", weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0 
      },
      addWaypoints: false,
      routeWhileDragging: false,
      show: false, // Текстти жашыруу
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      if (map && routingRef.current) map.removeControl(routingRef.current);
    };
  }, [map, myPos, targetPos]);

  return null;
};

const MapPage = () => {
  const [myPos, setMyPos] = useState<L.LatLng | null>(null);
  const [targetPos, setTargetPos] = useState<L.LatLng | null>(null);
  const [toText, setToText] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Ачылганда локацияны аныктоо
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyPos(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
        },
        (err) => console.error("GPS Error", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 2. Издөө жана Тарыхка сактоо
  const handleSearch = async () => {
    if (toText.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(toText)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const pos = new L.LatLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
        setTargetPos(pos);

        // Тарыхка сактоо логикасы
        const history = JSON.parse(localStorage.getItem("travel_history") || "[]");
        const newEntry = {
          id: Date.now(),
          to: toText,
          date: new Date().toLocaleTimeString().slice(0, 5)
        };
        localStorage.setItem("travel_history", JSON.stringify([newEntry, ...history.slice(0, 5)]));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 flex flex-col overflow-hidden">
      
      {/* 📍 ИЗДӨӨ ПАНЕЛИ - Жогорку бөлүк */}
      <div className="absolute top-6 left-0 right-0 px-4 z-[1000]">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md p-2 rounded-[22px] shadow-2xl border border-white/20 flex items-center gap-2">
          <div className="pl-3 text-blue-600">
            <Navigation size={20} />
          </div>
          <input 
            className="flex-1 h-12 bg-transparent outline-none text-slate-800 font-semibold text-base"
            placeholder="Каякка барасыз?"
            value={toText}
            onChange={(e) => setToText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-[16px] font-bold transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            {loading ? "..." : "Жол"}
          </button>
        </div>
      </div>

      {/* 🗺️ КАРТА - Ортоңку бөлүк (pb-[80px] меню үчүн) */}
      <div className="flex-1 relative z-0 mb-[80px]"> 
        <MapContainer 
          center={[42.87, 74.59]} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <ZoomControl position="bottomright" />
          
          <MapController myPos={myPos} targetPos={targetPos} />

          {myPos && (
            <Marker position={myPos}>
              <Popup>Сиз бул жердесиз</Popup>
            </Marker>
          )}

          {targetPos && (
            <Marker position={targetPos}>
              <Popup>{toText}</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Локацияга кайтуу баскычы */}
        <button 
          onClick={() => myPos && setMyPos(new L.LatLng(myPos.lat, myPos.lng + 0.0000001))}
          className="absolute bottom-6 right-4 z-[500] bg-white p-4 rounded-full shadow-2xl text-blue-600 border border-slate-100 active:scale-90 transition-all"
        >
          <LocateFixed size={24} />
        </button>
      </div>
    </div>
  );
};

export default MapPage;