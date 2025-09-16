"use client";
import { useState } from "react";
import { Search } from "lucide-react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function MapSearch({
  onSelect,
}: {
  onSelect: (lat: number, lon: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg rounded-xl p-3 w-72 z-50">
      <div className="flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search location..."
          className="flex-1 p-2 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 p-2 text-white flex items-center justify-center"
        >
          <Search size={18} />
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}

      {results.length > 0 && (
        <ul className="bg-white mt-2 border rounded-lg max-h-48 overflow-y-auto">
          {results.map((item, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                const lat = parseFloat(item.lat);
                const lon = parseFloat(item.lon);
                onSelect(lat, lon); // Pass coordinates to parent
                setQuery(item.display_name);
                setResults([]);
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
