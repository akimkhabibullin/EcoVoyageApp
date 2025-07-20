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
      <title>OpenFreemap</title>
      <link
        href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        rel="stylesheet"
      />
      <style>
        body, html, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
      <script>
        window.onerror = function (msg, url, lineNo, columnNo, error) {
          document.body.innerHTML = '<pre style="color:red;">' + msg + '</pre>';
          return true;
        };

        document.addEventListener("DOMContentLoaded", function () {
          const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [-122.4194, 37.7749],
            zoom: 8,
          });
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
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
