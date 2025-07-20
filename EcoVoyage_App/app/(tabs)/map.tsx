import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { View } from "@/components/Themed";

export default function MapScreen() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Map with Distance</title>
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body, html, #map {
      margin: 0; padding: 0; height: 100%; width: 100%;
      font-family: Arial, sans-serif;
      display: flex; flex-direction: column;
    }
    #search-container {
      padding: 10px;
      background: white;
      z-index: 10;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: flex-end;
    }
    .autocomplete-wrapper {
      position: relative;
      flex: 1 1 40%;
      min-width: 200px;
    }
    input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }
    ul.autocomplete-list {
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      max-height: 150px;
      overflow-y: auto;
      width: 100%;
      z-index: 100;
    }
    ul.autocomplete-list li {
      padding: 8px;
      cursor: pointer;
    }
    ul.autocomplete-list li:hover {
      background-color: #eee;
    }
    #distance {
      padding: 10px;
      font-weight: bold;
    }
    #map {
      flex: 1 1 auto;
      position: relative;
    }
    #enter-btn {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #39a465;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
      height: 42px;
      align-self: stretch;
    }
    #enter-btn:disabled {
      background-color: #a5d6a7;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div id="search-container">
    <div class="autocomplete-wrapper">
      <input id="from" placeholder="Enter start location" autocomplete="off" />
      <ul id="from-list" class="autocomplete-list"></ul>
    </div>
    <div class="autocomplete-wrapper">
      <input id="to" placeholder="Enter destination" autocomplete="off" />
      <ul id="to-list" class="autocomplete-list"></ul>
    </div>
    <button id="enter-btn" disabled>Enter</button>
  </div>
  <div id="distance">Distance: N/A</div>
  <div id="map"></div>

  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <script>
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-122.4194, 37.7749],
      zoom: 8,
    });

    let fromMarker = null;
    let toMarker = null;

    function distanceKm(coord1, coord2) {
      const toRad = (deg) => deg * Math.PI / 180;
      const R = 6371;
      const dLat = toRad(coord2[1] - coord1[1]);
      const dLon = toRad(coord2[0] - coord1[0]);
      const lat1 = toRad(coord1[1]);
      const lat2 = toRad(coord2[1]);

      const a = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    async function searchPlaces(query) {
      if (!query) return [];
      const url = \`https://nominatim.openstreetmap.org/search?format=json&q=\${encodeURIComponent(query)}&limit=5\`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");
        return await res.json();
      } catch (e) {
        console.error("Search error:", e);
        return [];
      }
    }

    function setupAutocomplete(inputId, listId, onSelect) {
      const input = document.getElementById(inputId);
      const list = document.getElementById(listId);
      let timeout = null;
      let selectedCoords = null;

      input.addEventListener("input", () => {
        clearTimeout(timeout);
        selectedCoords = null;
        onSelect(null);
        updateEnterButton();

        timeout = setTimeout(async () => {
          const query = input.value.trim();
          if (!query) {
            list.innerHTML = "";
            return;
          }
          const places = await searchPlaces(query);
          list.innerHTML = places.map(place => 
            \`<li data-lat="\${place.lat}" data-lon="\${place.lon}">\${place.display_name}</li>\`
          ).join("");
        }, 300);
      });

      list.addEventListener("click", e => {
        if (e.target.tagName.toLowerCase() === "li") {
          const lat = parseFloat(e.target.getAttribute("data-lat"));
          const lon = parseFloat(e.target.getAttribute("data-lon"));
          input.value = e.target.textContent;
          list.innerHTML = "";
          selectedCoords = [lon, lat];
          onSelect(selectedCoords);
          updateEnterButton();
        }
      });

      document.addEventListener("click", e => {
        if (!input.contains(e.target) && !list.contains(e.target)) {
          list.innerHTML = "";
        }
      });

      input.addEventListener("blur", () => {
        setTimeout(() => list.innerHTML = "", 200);
      });
    }

    let fromCoords = null;
    let toCoords = null;

    function updateEnterButton() {
      const btn = document.getElementById("enter-btn");
      btn.disabled = !(fromCoords && toCoords);
    }

    function clearMap() {
      if (fromMarker) { fromMarker.remove(); fromMarker = null; }
      if (toMarker) { toMarker.remove(); toMarker = null; }

      if (map.getLayer("route")) {
        map.removeLayer("route");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }
    }

    function calculateAndDisplay() {
      clearMap();

      fromMarker = new maplibregl.Marker({ color: "green" }).setLngLat(fromCoords).addTo(map);
      toMarker = new maplibregl.Marker({ color: "red" }).setLngLat(toCoords).addTo(map);

      const routeGeoJSON = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [fromCoords, toCoords],
        },
      };

      // Remove existing layer and source if present (extra safety)
      if (map.getLayer("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");

      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#0074D9",
          "line-width": 4,
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(fromCoords);
      bounds.extend(toCoords);
      map.fitBounds(bounds, { padding: 40 });

      const km = distanceKm(fromCoords, toCoords).toFixed(2);
      document.getElementById("distance").textContent = "Distance: " + km + " km";
    }

    setupAutocomplete("from", "from-list", coords => {
      fromCoords = coords;
      updateEnterButton();
    });

    setupAutocomplete("to", "to-list", coords => {
      toCoords = coords;
      updateEnterButton();
    });

    document.getElementById("enter-btn").addEventListener("click", () => {
      if (fromCoords && toCoords) {
        calculateAndDisplay();
      }
    });
  </script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});
