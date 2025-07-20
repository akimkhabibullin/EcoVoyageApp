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
  <title>Travel Distance & Emissions</title>
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
      flex-direction: column;
      gap: 10px;
    }
    input, select, button {
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
    #distance, #cost, #emissions, #duration, #co2saved, #error {
      padding: 8px 10px;
      font-weight: bold;
    }
    #error {
      color: red;
    }
    #map {
      flex: 1 1 auto;
      position: relative;
    }
    #enter-btn {
      background-color: #39a465;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
    }
    #enter-btn:disabled {
      background-color: #a5d6a7;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div id="search-container">
    <div style="position:relative;">
      <input id="from" placeholder="Enter start location" autocomplete="off" />
      <ul id="from-list" class="autocomplete-list"></ul>
    </div>
    <div style="position:relative;">
      <input id="to" placeholder="Enter destination" autocomplete="off" />
      <ul id="to-list" class="autocomplete-list"></ul>
    </div>
    <select id="travel-mode" aria-label="Select travel mode">
      <option value="" disabled selected>Select travel mode</option>
      <option value="walk">Walk</option>
      <option value="bike">Bike</option>
      <option value="ebike">Electric Bike</option>
      <option value="car">Car</option>
      <option value="bus">Bus</option>
      <option value="motorcycle">Motorcycle</option>
      <option value="truck">Truck</option>
      <option value="airplane">Airplane</option>
    </select>
    <button id="enter-btn" disabled>Enter</button>
  </div>
  <div id="error"></div>
  <div id="distance">Distance: N/A</div>
  <div id="cost">Cost: N/A</div>
  <div id="emissions">CO₂ Emissions: N/A</div>
  <div id="duration">Estimated Time: N/A</div>
  <div id="co2saved">CO₂ Saved Compared to Car: N/A</div>
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

    const travelData = {
      walk:       { costPerMile: 0,    emissionsPerMile: 0,       allowsWater: false, speedMph: 3 },
      bike:       { costPerMile: 0,    emissionsPerMile: 0,       allowsWater: false, speedMph: 10 },
      ebike:      { costPerMile: 0.02, emissionsPerMile: 0.015,   allowsWater: false, speedMph: 20 },
      car:        { costPerMile: 0.58, emissionsPerMile: 0.404,   allowsWater: false, speedMph: 45 },
      bus:        { costPerMile: 0.24, emissionsPerMile: 0.089,   allowsWater: false, speedMph: 30 },
      motorcycle: { costPerMile: 0.35, emissionsPerMile: 0.103,   allowsWater: false, speedMph: 50 },
      truck:      { costPerMile: 0.65, emissionsPerMile: 1.07,    allowsWater: false, speedMph: 40 },
      airplane:   { costPerMile: 0.13, emissionsPerMile: 0.285,   allowsWater: true,  speedMph: 500 },
    };

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

    function getContinent(lon, lat) {
      if (lat >= 7 && lat <= 84 && lon >= -170 && lon <= -50) return "NA";
      if (lat >= -57 && lat < 7 && lon >= -90 && lon <= -30) return "SA";
      if (lat >= 35 && lat <= 72 && lon >= -10 && lon <= 40) return "EU";
      if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) return "AF";
      if (lat >= 5 && lat <= 55 && lon >= 60 && lon <= 150) return "AS";
      if (lat >= -50 && lat <= 0 && lon >= 110 && lon <= 180) return "OC";
      return "OTHER";
    }

    function crossesWater(from, to) {
      const contFrom = getContinent(from[0], from[1]);
      const contTo = getContinent(to[0], to[1]);
      if (contFrom === "OTHER" || contTo === "OTHER") return true;
      return contFrom !== contTo;
    }

    let fromCoords = null;
    let toCoords = null;
    let travelMode = null;

    function updateEnterButton() {
      const btn = document.getElementById("enter-btn");
      btn.disabled = !(fromCoords && toCoords && travelMode);
      clearMessages();
    }

    function clearMessages() {
      document.getElementById("error").textContent = "";
      document.getElementById("distance").textContent = "Distance: N/A";
      document.getElementById("cost").textContent = "Cost: N/A";
      document.getElementById("emissions").textContent = "CO₂ Emissions: N/A";
      document.getElementById("duration").textContent = "Estimated Time: N/A";
      document.getElementById("co2saved").textContent = "CO₂ Saved Compared to Car: N/A";
    }

    function clearMap() {
      if (fromMarker) { fromMarker.remove(); fromMarker = null; }
      if (toMarker) { toMarker.remove(); toMarker = null; }

      if (map.getLayer("route")) map.removeLayer("route");
      if (map.getSource("route")) map.removeSource("route");
    }

    function calculateAndDisplay() {
      clearMap();
      clearMessages();

      const km = distanceKm(fromCoords, toCoords);
      const miles = km * 0.621371;

      if (miles < 10) {
        document.getElementById("error").textContent = "Distance must be at least 10 miles.";
        return;
      }

      const modeData = travelData[travelMode];
      const waterCrossing = crossesWater(fromCoords, toCoords);

      if (!modeData.allowsWater && waterCrossing) {
        document.getElementById("error").textContent = travelMode.charAt(0).toUpperCase() + travelMode.slice(1) + " cannot travel over water.";
        return;
      }

      fromMarker = new maplibregl.Marker({ color: "green" }).setLngLat(fromCoords).addTo(map);
      toMarker = new maplibregl.Marker({ color: "red" }).setLngLat(toCoords).addTo(map);

      const routeGeoJSON = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [fromCoords, toCoords],
        },
      };

      map.addSource("route", { type: "geojson", data: routeGeoJSON });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#0074D9", "line-width": 4 },
      });

      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(fromCoords);
      bounds.extend(toCoords);
      map.fitBounds(bounds, { padding: 40 });

      document.getElementById("distance").textContent = "Distance: " + miles.toFixed(2) + " miles";

      const cost = modeData.costPerMile * miles;
      const emissions = modeData.emissionsPerMile * miles;
      const carEmissions = travelData["car"].emissionsPerMile * miles;
      const co2Saved = Math.max(0, carEmissions - emissions);

      const durationHours = miles / modeData.speedMph;
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);
      const durationStr = hours > 0 ? \`\${hours} hr \${minutes} min\` : \`\${minutes} min\`;

      document.getElementById("cost").textContent = "Cost: $" + cost.toFixed(2);
      document.getElementById("emissions").textContent = "CO₂ Emissions: " + emissions.toFixed(2) + " kg";
      document.getElementById("duration").textContent = "Estimated Time: " + durationStr;
      document.getElementById("co2saved").textContent = "CO₂ Saved Compared to Car: " + co2Saved.toFixed(2) + " kg";
    }

    setupAutocomplete("from", "from-list", coords => {
      fromCoords = coords;
      updateEnterButton();
    });

    setupAutocomplete("to", "to-list", coords => {
      toCoords = coords;
      updateEnterButton();
    });

    document.getElementById("travel-mode").addEventListener("change", (e) => {
      travelMode = e.target.value;
      updateEnterButton();
    });

    document.getElementById("enter-btn").addEventListener("click", () => {
      if (fromCoords && toCoords && travelMode) {
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
