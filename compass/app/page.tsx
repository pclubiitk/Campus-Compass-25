"use client";
import { useEffect, useRef, useState } from "react";
import { ThemeDD } from "./components/ThemeDD";
import BottomNav from "./components/bottomnav";
import maplibregl, { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface LocationSuggestion {
  location_id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function Page() {
  const mapRef = useRef<MapLibreMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);

  // Initialize MapLibre map
  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://api.maptiler.com/maps/streets-v2/style.json?key=LlBgIboBwPwSOXm52XBf",
        center: [80.2335, 26.5123],
        zoom: 15,
      });
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Fetch suggestions from backend fuzzy search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/locations/search?query=${encodeURIComponent(
            query
          )}&threshold=0.3`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        
        // Ensure data is an array before setting suggestions
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // On clicking a suggestion
  const handleSelectLocation = (location: LocationSuggestion) => {
    const coordinates: [number, number] = [location.longitude, location.latitude];

    mapRef.current?.flyTo({ center: coordinates, zoom: 18 });

    // Remove old markers
    markers.forEach((marker) => marker.remove());

    // Add new marker
    const newMarker = new maplibregl.Marker()
      .setLngLat(coordinates)
      .setPopup(
        new maplibregl.Popup().setHTML(
          `<div style="color:black;">${location.name}</div>`
        )
      )
      .addTo(mapRef.current!);

    setMarkers([newMarker]);

    setQuery(location.name);
    setSuggestions([]);
  };

  return (
    <>
      <ThemeDD />
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ height: "100vh", width: "100vw" }}
      ></div>

      {/* Search Input */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 999,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          width: "260px",
          color: "black",
        }}
      >
        <input
          type="text"
          placeholder="Search a location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "5px",
          }}
        />
        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              left: 0,
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 1000,
            }}
          >
            {suggestions.map((item) => (
              <div
                key={item.location_id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                onClick={() => handleSelectLocation(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Title & Bottom Nav */}
      <div>
        <main className="p-4">
          <h1 className="text-2xl font-bold">Campus Compass</h1>
        </main>
        <BottomNav />
      </div>
    </>
  );
}