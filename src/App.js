import React from "react";
import BoxesMap from "./components/BoxesMap/BoxesMap";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Trouver une boîte à lire</h1>
      <div className="description-container">
        <p>
          Vous cherchez une boîte à lire pour y déposer des livres ou découvrir
          de nouvelles perles? Trouvez la boîte la plus proche grâce à la carte
          ci-dessous.
        </p>
      </div>
      <BoxesMap />
    </div>
  );
}

export default App;
