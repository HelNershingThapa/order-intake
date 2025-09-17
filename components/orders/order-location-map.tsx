import Image from "next/image";
import { useFormContext } from "react-hook-form";
import Map, {
  MapLayerMouseEvent,
  Marker,
  useMap,
  type MarkerDragEvent,
} from "react-map-gl/maplibre";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import "maplibre-gl/dist/maplibre-gl.css";
import { places, search } from "@/app/vendor/actions";
import { BaatoSearchResponse } from "@/types/baato";

export const OrderLocationMap = () => {
  const form = useFormContext();
  const point =
    form.watch("lat") && form.watch("lng")
      ? { lat: form.watch("lat")!, lng: form.watch("lng")! }
      : null;

  const handleDragEnd = (e: MarkerDragEvent) => {
    form.setValue("lat", e.lngLat.lat, { shouldValidate: true });
    form.setValue("lng", e.lngLat.lng, { shouldValidate: true });
  };

  const handleMapClick = (e: MapLayerMouseEvent) => {
    form.setValue("lat", e.lngLat.lat);
    form.setValue("lng", e.lngLat.lng);
  };

  return (
    <div className="h-[320px] w-full rounded-md overflow-hidden border relative">
      <Map
        initialViewState={{
          latitude: point?.lat ?? 27.7049,
          longitude: point?.lng ?? 85.3182,
          zoom: 11,
        }}
        mapStyle={`https://api.baato.io/api/v1/styles/breeze?key=${process.env.NEXT_PUBLIC_BAATO_ACCESS_TOKEN}`}
        dragRotate={false}
        onClick={handleMapClick}
      >
        {point && (
          <Marker
            latitude={point.lat}
            longitude={point.lng}
            anchor="bottom"
            draggable
            onDragEnd={handleDragEnd}
          >
            <Image src={"/marker.png"} alt="Marker" height={32} width={28} />
          </Marker>
        )}
        <div className="absolute top-2 left-2 z-10">
          <SearchAddress />
        </div>
      </Map>
    </div>
  );
};

export const SearchAddress = () => {
  const { current: map } = useMap();
  const [query, setQuery] = useState("");
  const [hidden, setHidden] = useState(true);
  const [isPlaceLoading, setIsPlaceLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["search-address", query],
    queryFn: async ({ signal }) => await search(query),
    enabled: !!query,
    select: (data) => data.data,
  });

  const handleSearchResultSelect = async (
    searchResult: BaatoSearchResponse["data"][number],
  ) => {
    setHidden(true);
    try {
      setIsPlaceLoading(true);
      // Fetch place details using the OSM ID
      const placeDetails = await places(searchResult.osmId);
      console.log("placeDetails:", placeDetails);
      if (placeDetails) {
        map?.flyTo({
          center: {
            lat: placeDetails.data[0].centroid.lat,
            lng: placeDetails.data[0].centroid.lon,
          },
          zoom: 17,
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      toast.error("Error fetching place details. Please try again later.");
    } finally {
      setIsPlaceLoading(false);
    }
  };

  return (
    <Command shouldFilter={false}>
      <CommandInput
        autoFocus
        placeholder="Search address..."
        value={query}
        isLoading={isPlaceLoading}
        onValueChange={(value) => {
          setQuery(value);
          setHidden(false);
        }}
      />
      <CommandList hidden={hidden}>
        {isLoading && (
          <CommandLoading>
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          </CommandLoading>
        )}
        {query && data?.length === 0 && !isLoading && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {data?.map((result) => (
          <CommandItem
            key={result.placeId}
            onSelect={() => handleSearchResultSelect(result)}
          >
            {result.name}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};
