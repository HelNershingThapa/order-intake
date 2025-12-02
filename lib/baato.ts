"use server";

import type { BaatoPlaceResponse, SearchResult } from "@/types/baato";

export const search = async (query: string) => {
  const res = await fetch(
    `${process.env.BAATO_BASE_URL}/search?key=${process.env.BAATO_ACCESS_TOKEN}&q=${query}`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return data.data as SearchResult[];
};

export const places = async (placeId: string | number) => {
  const res = await fetch(
    `${process.env.BAATO_BASE_URL}/places?key=${process.env.BAATO_ACCESS_TOKEN}&placeId=${placeId}`,
  );
  return (await res.json()) as Promise<BaatoPlaceResponse>;
};
