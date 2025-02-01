import React from "react";

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ setSearchTerm }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search posts..."
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
