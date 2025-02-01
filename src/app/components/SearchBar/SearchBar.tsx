import React from "react";

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ setSearchTerm }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search posts..."
      className="border-black border-2 w-full min-w-10 max-w-80 outline-none pl-2"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
