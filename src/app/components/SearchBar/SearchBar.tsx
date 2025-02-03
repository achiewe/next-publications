import React, { useState, useEffect } from "react";

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
}

// Modify SearchBar component to implement debouncing
export default function SearchBar({ setSearchTerm }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [inputValue, setSearchTerm]);
  return (
    <input
      type="text"
      placeholder="Search posts..."
      className="border-black border-2 w-full min-w-10 max-w-80 outline-none pl-2"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
