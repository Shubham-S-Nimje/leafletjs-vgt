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

  const bounds = [
    [73.12, 0],
    [0, 73.12],
  ];

  const OSM = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  const ProvidedTileLayer = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
      maxZoom: 17,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      bounds: bounds,
      opacity: tileOpacity,
    }
  );

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [19.0226505, 73.1265792],
        12
      );

      OSM.addTo(mapRef.current);

      var baseLayers = {
        OpenStreetMap: OSM,
        "Provided TileLayer": ProvidedTileLayer,
      };
      L.control.layers(baseLayers).addTo(mapRef.current);
    }

    if (!tileLayerRef.current && tileLayerVisible) {
      tileLayerRef.current = ProvidedTileLayer.addTo(mapRef.current);
    } else if (tileLayerRef.current && !tileLayerVisible) {
      mapRef.current.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (!geoJsonLayerRef.current && geoJsonLayerVisible) {
      geoJsonLayerRef.current = L.geoJSON(GeoJsonData, {
        style: {
          fillColor: "yellow",
          fillOpacity: geoJsonOpacity,
          color: "green",
          weight: 3,
          bounds: bounds,
        },
      }).addTo(mapRef.current);
    } else if (geoJsonLayerRef.current && !geoJsonLayerVisible) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
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
      <div className="absolute top-24 bg-white right-2 z-50 p-4 flex flex-col gap-2 border-2 border-gray-400 rounded">
        <div className="">
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
          <br />
          {tileLayerVisible && (
            <div>
              <label htmlFor="tileOpacity" className="text-black mr-2">
                Opacity:
              </label>
              <input
                type="range"
                id="tileOpacity"
                min="0"
                max="1"
                step="0.1"
                value={tileOpacity}
                onChange={handleTileOpacityChange}
                className="w-32 h-6 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:bg-white"
              />
            </div>
          )}
        </div>
        <div>
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
          <br />
          {geoJsonLayerVisible && (
            <div>
              <label htmlFor="geoJsonOpacity" className="text-black mr-2">
                Opacity:
              </label>
              <input
                type="range"
                id="geoJsonOpacity"
                min="0"
                max="1"
                step="0.1"
                value={geoJsonOpacity}
                onChange={handleGeoJsonOpacityChange}
                className="w-32 h-6 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:bg-white"
              />
            </div>
          )}
        </div>
        <button
          className="mb-2 border rounded bg-red-800 text-white p-1"
          onClick={handleRemoveAll}
        >
          Remove All
        </button>
      </div>
    </div>
  );
};

export default Mapdata;
