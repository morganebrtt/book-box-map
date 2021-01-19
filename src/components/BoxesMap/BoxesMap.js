import React, { useState, useEffect } from "react";
import { readRemoteFile } from "react-papaparse";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
};

const BoxesMap = () => {
  const [boxesData, setBoxesData] = useState([]);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState([47.2244, 2.44472]);
  const [zoom, setZoom] = useState(6);

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
          res = res.map((coord) => Number(coord));
          return res;
        }
        return value;
      },
      skipEmptyLines: "greedy",
    });

    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
      setZoom(15);
    });
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      <MapContainer
        className="map-container"
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup showCoverageOnHover={false}>
          {boxesData.length > 0 &&
            boxesData.map((boxData, index) => (
              <Marker key={index} position={boxData.Coord_GPS}>
                <Popup>
                  {boxData.Adresse && <p>{boxData.Adresse}</p>}
                  {boxData.Code_Postal && <p>{boxData.Code_Postal}</p>}
                  {boxData.Ville && <p>{boxData.Ville}</p>}
                  {boxData.Pays && <p>{boxData.Pays}</p>}
                  {boxData.Remarque && <p>{boxData.Remarque}</p>}
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>
    </>
  );
};

export default BoxesMap;
