"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(() => {
    if (query.trim() !== "") {
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.replace("/search");
    }
  }, [query, router]);

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
        className="border px-3 py-2 rounded-md"
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}