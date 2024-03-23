"use client";
import React, { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Mapdata = ({ GeoJsonData }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const [tileLayerVisible, setTileLayerVisible] = useState(false);
  const [geoJsonLayerVisible, setGeoJsonLayerVisible] = useState(false);
  const [tileOpacity, setTileOpacity] = useState(0.5);
  const [geoJsonOpacity, setGeoJsonOpacity] = useState(0.5);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [19.0226505, 73.1265792],
        12
      );

      L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(mapRef.current);
    }

    if (!tileLayerRef.current && tileLayerVisible) {
      // if (!tileLayerRef.current) {
      tileLayerRef.current = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }
      ).addTo(mapRef.current);
      // }
    } else {
      if (tileLayerRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
        tileLayerRef.current = null;
      }
    }

    if (!geoJsonLayerRef.current && geoJsonLayerVisible) {
      // if (!geoJsonLayerRef.current) {
      geoJsonLayerRef.current = L.geoJSON(GeoJsonData, {
        style: {
          fillColor: "transparent",
          fillOpacity: geoJsonOpacity,
          color: "green",
          weight: 5,
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.description) {
            layer.bindPopup(feature.properties.description);
          }
        },
      }).addTo(mapRef.current);
      // }
    } else {
      if (geoJsonLayerRef.current) {
        mapRef.current.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
    }
  }, [
    tileLayerVisible,
    geoJsonLayerVisible,
    tileOpacity,
    geoJsonOpacity,
    GeoJsonData,
  ]);

  const handleTileLayerChange = (event) => {
    setTileLayerVisible(event.target.checked);
  };

  const handleGeoJsonLayerChange = (event) => {
    setGeoJsonLayerVisible(event.target.checked);
  };

  const handleTileOpacityChange = (event) => {
    setTileOpacity(parseFloat(event.target.value));
    if (tileLayerRef.current) {
      tileLayerRef.current.setOpacity(parseFloat(event.target.value));
    }
  };

  const handleGeoJsonOpacityChange = (event) => {
    setGeoJsonOpacity(parseFloat(event.target.value));
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.setStyle({
        fillOpacity: parseFloat(event.target.value),
      });
    }
  };

  const handleRemoveAll = () => {
    setTileLayerVisible(false);
    setGeoJsonLayerVisible(false);
  };

  // console.log(GeoJsonData);

  return (
    <div className="relative min-h-screen">
      <div ref={mapContainerRef} className="absolute inset-0 z-10" />
      <div className="absolute top-4 bg-white right-4 z-50 p-4">
        <div>
          <div className="mb-2">
            <input
              type="checkbox"
              id="tileLayer"
              className="border-black border mr-2"
              checked={tileLayerVisible}
              onChange={handleTileLayerChange}
            />
            <label htmlFor="tileLayer" className="text-black">
              Tile layer
            </label>
          </div>
          {tileLayerVisible && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={tileOpacity}
              onChange={handleTileOpacityChange}
              className="w-32 h-6 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:bg-white"
            />
          )}
        </div>
        <div>
          <div className="mb-2">
            <input
              type="checkbox"
              id="geoJsonLayer"
              className="border-black border mr-2"
              checked={geoJsonLayerVisible}
              onChange={handleGeoJsonLayerChange}
            />
            <label htmlFor="geoJsonLayer" className="text-black">
              Geojson layer
            </label>
          </div>
          {geoJsonLayerVisible && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={geoJsonOpacity}
              onChange={handleGeoJsonOpacityChange}
              className="w-32 h-6 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:bg-white"
            />
          )}
        </div>
        <button className="mb-2 border" onClick={handleRemoveAll}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default Mapdata;
