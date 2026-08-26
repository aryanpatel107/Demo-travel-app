"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }

  return (
    <div className="mx-auto max-w-xl">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder ?? "Search destinations..."}
        className="w-full rounded-full border border-cloud bg-white px-5 py-3 text-sm shadow-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
      />
    </div>
  );
}