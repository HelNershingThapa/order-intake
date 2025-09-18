import type { LayerProps } from "react-map-gl/maplibre";

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "orders",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#2563eb",
      10,
      "#1d4ed8",
      30,
      "#1e3a8a",
    ],
    "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 30, 26],
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 1.5,
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "orders",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: { "text-color": "#fff" },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "orders",
  filter: ["!", ["has", "point_count"]],
  paint: {
    // Highlight when feature-state { selected: true }
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      "#10b981", // emerald-500 for selected
      "#2563eb", // default blue
    ],
    "circle-radius": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      8,
      6,
    ],
    "circle-stroke-width": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      2,
      1.5,
    ],
    "circle-stroke-color": "#fff",
  },
};
