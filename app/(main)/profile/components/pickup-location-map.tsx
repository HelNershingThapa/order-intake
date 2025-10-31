"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import Map, {
  MapLayerMouseEvent,
  Marker,
  type MarkerDragEvent,
  NavigationControl,
  useMap,
} from "react-map-gl/maplibre"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"
import { places, search } from "@/lib/baato"
import type { BaatoSearchResponse } from "@/types/baato"

import "maplibre-gl/dist/maplibre-gl.css"

export const PickupLocationMap = () => {
  const form = useFormContext()
  const point =
    form.watch("pickup_lat") && form.watch("pickup_lon")
      ? { lat: form.watch("pickup_lat")!, lng: form.watch("pickup_lon")! }
      : null

  const handleDragEnd = (e: MarkerDragEvent) => {
    form.setValue("pickup_lat", e.lngLat.lat, { shouldValidate: true })
    form.setValue("pickup_lon", e.lngLat.lng, { shouldValidate: true })
  }

  const handleMapClick = (e: MapLayerMouseEvent) => {
    form.setValue("pickup_lat", e.lngLat.lat)
    form.setValue("pickup_lon", e.lngLat.lng)
  }

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
        attributionControl={false}
      >
        <NavigationControl showCompass={false} />
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
        {!point && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 border rounded-md px-4 py-2 shadow-md">
              <p className="text-xs text-muted-foreground">
                Click on the map to place a marker
              </p>
            </div>
          </div>
        )}
      </Map>
    </div>
  )
}

export const SearchAddress = () => {
  const form = useFormContext()

  const { current: map } = useMap()
  const [query, setQuery] = useState("")
  const [hidden, setHidden] = useState(true)
  const [isPlaceLoading, setIsPlaceLoading] = useState(false)

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search-address", query],
    queryFn: () => search(query),
    enabled: !!query,
    select: (data) => data.data,
  })

  const handleSearchResultSelect = async (
    searchResult: BaatoSearchResponse["data"][number]
  ) => {
    setHidden(true)
    try {
      setIsPlaceLoading(true)
      // Fetch place details using the OSM ID
      const placeDetails = await places(searchResult.placeId)
      if (placeDetails) {
        const { address, centroid } = placeDetails.data[0]
        map?.flyTo({
          center: {
            lat: centroid.lat,
            lng: centroid.lon,
          },
          zoom: 17,
          duration: 1000,
        })
        form.setValue("pickup_lat", centroid.lat)
        form.setValue("pickup_lon", centroid.lon)
        form.setValue("suggested_address", address)
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
      toast.error("Error fetching place details. Please try again later.")
    } finally {
      setIsPlaceLoading(false)
    }
  }

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search address..."
        value={query}
        isLoading={isPlaceLoading}
        onValueChange={(value) => {
          setQuery(value)
          setHidden(false)
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
        {query && searchResults?.length === 0 && !isLoading && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {searchResults?.map((result) => (
          <CommandItem
            key={result.placeId}
            onSelect={() => handleSearchResultSelect(result)}
          >
            {result.name}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}
