"use server";

import type { BaatoPlaceResponse, BaatoSearchResponse } from "@/types/baato";

export const search = async (query: string) => {
  const res = await fetch(
    `${process.env.BAATO_BASE_URL}/search?key=${process.env.BAATO_ACCESS_TOKEN}&q=${query}&limit=1`,
  );
  return (await res.json()) as Promise<BaatoSearchResponse>;
};

export const places = async (placeId: string) => {
  const res = await fetch(
    `${process.env.BAATO_BASE_URL}/places?key=${process.env.BAATO_ACCESS_TOKEN}&placeId=${placeId}`,
  );
  return (await res.json()) as Promise<BaatoPlaceResponse>;
};
