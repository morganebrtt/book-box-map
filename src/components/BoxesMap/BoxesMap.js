import React, { useState, useEffect } from "react";
import { readRemoteFile } from "react-papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./BoxesMap.css";

const DefaultIcon = L.icon({
  iconUrl: "./img/library.svg",
  iconSize: [32, 32],
});

L.Marker.prototype.options.icon = DefaultIcon;

const BoxesMap = () => {
  const [boxesData, setBoxesData] = useState([]);
  const [error, setError] = useState(null);
  const position = [48.856614, 2.3522219];

  useEffect(() => {
    readRemoteFile("./data/boite_a_lire.csv", {
      header: true,
      comments: "//",
      transformHeader: (columnName) => columnName.trim(),
      complete: (results) => {
        setBoxesData(results.data);
      },
      error: (err) => {
        setError(err);
      },
      transform: (value, col) => {
        if (col === "Coord_GPS") {
          let res = value.split(",");
          res = res.map((i) => Number(i));
          return res;
        }
        return value;
      },
      skipEmptyLines: "greedy",
    });
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      <MapContainer
        className="map-container"
        center={position}
        zoom={6}
        scrollWheelZoom={false}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup showCoverageOnHover={false}>
          <>
            {boxesData.length > 0 &&
              boxesData.map((boxData, index) => (
                <Marker key={index} position={boxData.Coord_GPS}>
                  <Popup>
                    <p>{boxData.Adresse}</p>
                    <p>{boxData.Code_Postal}</p>
                    <p>{boxData.Ville}</p>
                    <p>{boxData.Pays}</p>
                    <p>{boxData.Remarque}</p>
                  </Popup>
                </Marker>
              ))}
          </>
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
};

export default BoxesMap;
