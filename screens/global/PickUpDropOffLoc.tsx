"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "@/hooks/use-toast";

type Props = {
  pickup: string;
  dropoff: string;
};

// Utility function to update the map view
function ChangeMapView({ coords }: any) {
  const map = useMap();
  if (coords.pickup && coords.dropoff) {
    map.fitBounds([coords.pickup, coords.dropoff], { padding: [50, 50] });
  } else if (coords.pickup) {
    map.setView(coords.pickup, 13);
  } else if (coords.dropoff) {
    map.setView(coords.dropoff, 13);
  }
  return null;
}

function MapComponent({ pickup, dropoff }: Props) {
  const [coords, setCoords] = useState({
    pickup: null,
    dropoff: null,
  });

  useEffect(() => {
    if (pickup && dropoff) {
      handleSearch("pickup");
      handleSearch("dropoff");
    }
  }, [pickup, dropoff]);

  const handleSearch = async (type: any) => {
    const location = type === "pickup" ? pickup : dropoff;

    try {
      // Use Nominatim API to fetch coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords((prevCoords) => ({
          ...prevCoords,
          [type]: { lat: parseFloat(lat), lng: parseFloat(lon) },
        }));
      } else {
        console.error(`${type} location not found`);
        toast({
          description: "Could not find location",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error fetching ${type} location:`, error);
      toast({
        description: "Could not find location",
        variant: "destructive",
      });
    }
  };

  // Custom markers for pickup (blue) and drop-off (red)
  const pickupIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2983/2983814.png", // Blue marker icon
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const dropoffIcon = new L.Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=13800&format=png&color=000000", // Red marker icon
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  return (
    <div>
      <MapContainer
        center={[-29.62319, 28.2334698]} // Default center
        zoom={13}
        className="w-full h-[200px]"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Pickup Marker */}
        {coords.pickup && (
          <Marker position={coords.pickup} interactive={true}>
            <Popup keepInView={true}>Pickup Location</Popup>
          </Marker>
        )}

        {/* Drop-off Marker */}
        {coords.dropoff && (
          <Marker position={coords.dropoff} icon={dropoffIcon}>
            <Popup keepInView={true}>Drop-off Location</Popup>
          </Marker>
        )}

        {/* Adjust map view based on markers */}
        <ChangeMapView coords={coords} />
      </MapContainer>
    </div>
  );
}
export default MapComponent;
