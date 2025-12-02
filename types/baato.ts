export type BaatoSearchResponse = {
  timestamp: string;
  status: number;
  message: string;
  data: Array<SearchResult>;
};

export type SearchResult = {
  placeId: number;
  osmId: number;
  name: string;
  address: string;
  type: string;
  score: number;
  radialDistanceInKm: number;
};

export type BaatoPlaceResponse = {
  timestamp: string;
  status: number;
  message: string;
  data: Array<{
    placeId: number;
    osmId: number;
    license: string;
    name: string;
    address: string;
    type: string;
    centroid: {
      lat: number;
      lon: number;
    };
    tags: string[];
    geometry: {
      coordinates: [number, number];
      type: string;
    };
    score: number;
  }>;
};
