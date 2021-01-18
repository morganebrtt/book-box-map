import React, { useState } from "react";
import { readRemoteFile } from "react-papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BoxesMap.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const BoxesMap = () => {
  const [boxesData, setBoxesData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const position = [48.856614, 2.3522219];

  if (!hasData) {
    setHasData(true);
    readRemoteFile("./data/boite_a_lire.csv", {
      header: true,
      comments: "//",
      transformHeader: (columnName) => columnName.trim(),
      complete: (results) => {
        setBoxesData(results.data);
      },
      error: (error) => {
        console.error("error:", error);
      },
      skipEmptyLines: "greedy",
    });
  }

  return (
    <MapContainer
      className="map-container"
      center={position}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <div>
        {boxesData.length > 0 &&
          boxesData.map((boxData, index) => {
            const boxPositionGPS = boxData.Coord_GPS;
            const boxPositionStr = boxPositionGPS.split(",");
            const boxPosition = boxPositionStr.map((i) => Number(i));
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Marker key={index} position={boxPosition}>
                <Popup>
                  <p>{boxData.Adresse}</p>
                  <p>{boxData.Code_Postal}</p>
                  <p>{boxData.Ville}</p>
                  <p>{boxData.Pays}</p>
                  <p>{boxData.Remarque}</p>
                </Popup>
              </Marker>
            );
          })}
      </div>
    </MapContainer>
  );
};

export default BoxesMap;
